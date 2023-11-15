package server

import (
	"compress/gzip"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/openshift/console/pkg/auth"
	"github.com/openshift/console/pkg/serverutils"

	"k8s.io/klog"
)

type HandlerWithUser func(user *auth.User, w http.ResponseWriter, r *http.Request)

// Middleware generates a middleware wrapper for request hanlders.
// Responds with 401 for requests with missing/invalid/incomplete token with verified email address.
func authMiddleware(authers map[string]*auth.Authenticator, hdlr http.HandlerFunc) http.Handler {
	f := func(user *auth.User, w http.ResponseWriter, r *http.Request) {
		hdlr.ServeHTTP(w, r)
	}
	return authMiddlewareWithUser(authers, f)
}

func authMiddlewareWithUser(authers map[string]*auth.Authenticator, handlerFunc HandlerWithUser) http.Handler {
	return verifyCSRF(authers, func(w http.ResponseWriter, r *http.Request) {
		cluster := serverutils.GetCluster(r)
		auther := authers[cluster]
		user, err := auther.Authenticate(r)
		if err != nil {
			klog.V(4).Infof("authentication failed: %v", err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		r.Header.Set("Authorization", fmt.Sprintf("Bearer %s", user.Token))
		handlerFunc(user, w, r)
	})
}

func verifyCSRF(authers map[string]*auth.Authenticator, h http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cluster := serverutils.GetCluster(r)
		auther, autherFound := authers[cluster]

		if !autherFound {
			klog.Errorf("Bad Request. Invalid cluster: %v", cluster)
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(fmt.Sprintf("Bad Request. Invalid cluster: %v", cluster)))
			return
		}

		safe := false
		switch r.Method {
		case
			"GET",
			"HEAD",
			"OPTIONS",
			"TRACE":
			safe = true
		}
		if !safe {
			if err := auther.VerifySourceOrigin(r); err != nil {
				klog.Errorf("invalid source origin: %v", err)
				w.WriteHeader(http.StatusForbidden)
				return
			}

			if err := auther.VerifyCSRFToken(r); err != nil {
				klog.Errorf("invalid CSRFToken: %v", err)
				w.WriteHeader(http.StatusForbidden)
				return
			}
		}
		h(w, r)
	})
}

func allowMethods(methods []string, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		for _, method := range methods {
			if r.Method == method {
				h.ServeHTTP(w, r)
				return
			}
		}
		allowedStr := strings.Join(methods, ", ")
		w.Header().Set("Allow", allowedStr)
		serverutils.SendResponse(w, http.StatusMethodNotAllowed, serverutils.ApiError{Err: fmt.Sprintf("Method '%s' not allowed. Allowed methods: %s", r.Method, allowedStr)})
	})
}

func allowMethod(method string, h http.Handler) http.Handler {
	return allowMethods([]string{method}, h)
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
	sniffDone bool
}

func (w *gzipResponseWriter) Write(b []byte) (int, error) {
	if !w.sniffDone {
		if w.Header().Get("Content-Type") == "" {
			w.Header().Set("Content-Type", http.DetectContentType(b))
		}
		w.sniffDone = true
	}
	return w.Writer.Write(b)
}

// gzipHandler wraps a http.Handler to support transparent gzip encoding.
func gzipHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Accept-Encoding")
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			h.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(w)
		defer gz.Close()
		h.ServeHTTP(&gzipResponseWriter{Writer: gz, ResponseWriter: w}, r)
	})
}

func securityHeadersMiddleware(hdlr http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Prevent MIME sniffing (https://en.wikipedia.org/wiki/Content_sniffing)
		w.Header().Set("X-Content-Type-Options", "nosniff")
		// Ancient weak protection against reflected XSS (equivalent to CSP no unsafe-inline)
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		// Prevent clickjacking attacks involving iframes
		w.Header().Set("X-Frame-Options", "DENY")
		// Less information leakage about what domains we link to
		w.Header().Set("X-DNS-Prefetch-Control", "off")
		// Less information leakage about what domains we link to
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		hdlr.ServeHTTP(w, r)
	}
}
