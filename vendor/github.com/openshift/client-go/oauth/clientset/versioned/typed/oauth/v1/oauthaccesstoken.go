// Code generated by client-gen. DO NOT EDIT.

package v1

import (
	"context"
	json "encoding/json"
	"fmt"
	"time"

	v1 "github.com/openshift/api/oauth/v1"
	oauthv1 "github.com/openshift/client-go/oauth/applyconfigurations/oauth/v1"
	scheme "github.com/openshift/client-go/oauth/clientset/versioned/scheme"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	types "k8s.io/apimachinery/pkg/types"
	watch "k8s.io/apimachinery/pkg/watch"
	rest "k8s.io/client-go/rest"
)

// OAuthAccessTokensGetter has a method to return a OAuthAccessTokenInterface.
// A group's client should implement this interface.
type OAuthAccessTokensGetter interface {
	OAuthAccessTokens() OAuthAccessTokenInterface
}

// OAuthAccessTokenInterface has methods to work with OAuthAccessToken resources.
type OAuthAccessTokenInterface interface {
	Create(ctx context.Context, oAuthAccessToken *v1.OAuthAccessToken, opts metav1.CreateOptions) (*v1.OAuthAccessToken, error)
	Update(ctx context.Context, oAuthAccessToken *v1.OAuthAccessToken, opts metav1.UpdateOptions) (*v1.OAuthAccessToken, error)
	Delete(ctx context.Context, name string, opts metav1.DeleteOptions) error
	DeleteCollection(ctx context.Context, opts metav1.DeleteOptions, listOpts metav1.ListOptions) error
	Get(ctx context.Context, name string, opts metav1.GetOptions) (*v1.OAuthAccessToken, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.OAuthAccessTokenList, error)
	Watch(ctx context.Context, opts metav1.ListOptions) (watch.Interface, error)
	Patch(ctx context.Context, name string, pt types.PatchType, data []byte, opts metav1.PatchOptions, subresources ...string) (result *v1.OAuthAccessToken, err error)
	Apply(ctx context.Context, oAuthAccessToken *oauthv1.OAuthAccessTokenApplyConfiguration, opts metav1.ApplyOptions) (result *v1.OAuthAccessToken, err error)
	OAuthAccessTokenExpansion
}

// oAuthAccessTokens implements OAuthAccessTokenInterface
type oAuthAccessTokens struct {
	client rest.Interface
}

// newOAuthAccessTokens returns a OAuthAccessTokens
func newOAuthAccessTokens(c *OauthV1Client) *oAuthAccessTokens {
	return &oAuthAccessTokens{
		client: c.RESTClient(),
	}
}

// Get takes name of the oAuthAccessToken, and returns the corresponding oAuthAccessToken object, and an error if there is any.
func (c *oAuthAccessTokens) Get(ctx context.Context, name string, options metav1.GetOptions) (result *v1.OAuthAccessToken, err error) {
	result = &v1.OAuthAccessToken{}
	err = c.client.Get().
		Resource("oauthaccesstokens").
		Name(name).
		VersionedParams(&options, scheme.ParameterCodec).
		Do(ctx).
		Into(result)
	return
}

// List takes label and field selectors, and returns the list of OAuthAccessTokens that match those selectors.
func (c *oAuthAccessTokens) List(ctx context.Context, opts metav1.ListOptions) (result *v1.OAuthAccessTokenList, err error) {
	var timeout time.Duration
	if opts.TimeoutSeconds != nil {
		timeout = time.Duration(*opts.TimeoutSeconds) * time.Second
	}
	result = &v1.OAuthAccessTokenList{}
	err = c.client.Get().
		Resource("oauthaccesstokens").
		VersionedParams(&opts, scheme.ParameterCodec).
		Timeout(timeout).
		Do(ctx).
		Into(result)
	return
}

// Watch returns a watch.Interface that watches the requested oAuthAccessTokens.
func (c *oAuthAccessTokens) Watch(ctx context.Context, opts metav1.ListOptions) (watch.Interface, error) {
	var timeout time.Duration
	if opts.TimeoutSeconds != nil {
		timeout = time.Duration(*opts.TimeoutSeconds) * time.Second
	}
	opts.Watch = true
	return c.client.Get().
		Resource("oauthaccesstokens").
		VersionedParams(&opts, scheme.ParameterCodec).
		Timeout(timeout).
		Watch(ctx)
}

// Create takes the representation of a oAuthAccessToken and creates it.  Returns the server's representation of the oAuthAccessToken, and an error, if there is any.
func (c *oAuthAccessTokens) Create(ctx context.Context, oAuthAccessToken *v1.OAuthAccessToken, opts metav1.CreateOptions) (result *v1.OAuthAccessToken, err error) {
	result = &v1.OAuthAccessToken{}
	err = c.client.Post().
		Resource("oauthaccesstokens").
		VersionedParams(&opts, scheme.ParameterCodec).
		Body(oAuthAccessToken).
		Do(ctx).
		Into(result)
	return
}

// Update takes the representation of a oAuthAccessToken and updates it. Returns the server's representation of the oAuthAccessToken, and an error, if there is any.
func (c *oAuthAccessTokens) Update(ctx context.Context, oAuthAccessToken *v1.OAuthAccessToken, opts metav1.UpdateOptions) (result *v1.OAuthAccessToken, err error) {
	result = &v1.OAuthAccessToken{}
	err = c.client.Put().
		Resource("oauthaccesstokens").
		Name(oAuthAccessToken.Name).
		VersionedParams(&opts, scheme.ParameterCodec).
		Body(oAuthAccessToken).
		Do(ctx).
		Into(result)
	return
}

// Delete takes name of the oAuthAccessToken and deletes it. Returns an error if one occurs.
func (c *oAuthAccessTokens) Delete(ctx context.Context, name string, opts metav1.DeleteOptions) error {
	return c.client.Delete().
		Resource("oauthaccesstokens").
		Name(name).
		Body(&opts).
		Do(ctx).
		Error()
}

// DeleteCollection deletes a collection of objects.
func (c *oAuthAccessTokens) DeleteCollection(ctx context.Context, opts metav1.DeleteOptions, listOpts metav1.ListOptions) error {
	var timeout time.Duration
	if listOpts.TimeoutSeconds != nil {
		timeout = time.Duration(*listOpts.TimeoutSeconds) * time.Second
	}
	return c.client.Delete().
		Resource("oauthaccesstokens").
		VersionedParams(&listOpts, scheme.ParameterCodec).
		Timeout(timeout).
		Body(&opts).
		Do(ctx).
		Error()
}

// Patch applies the patch and returns the patched oAuthAccessToken.
func (c *oAuthAccessTokens) Patch(ctx context.Context, name string, pt types.PatchType, data []byte, opts metav1.PatchOptions, subresources ...string) (result *v1.OAuthAccessToken, err error) {
	result = &v1.OAuthAccessToken{}
	err = c.client.Patch(pt).
		Resource("oauthaccesstokens").
		Name(name).
		SubResource(subresources...).
		VersionedParams(&opts, scheme.ParameterCodec).
		Body(data).
		Do(ctx).
		Into(result)
	return
}

// Apply takes the given apply declarative configuration, applies it and returns the applied oAuthAccessToken.
func (c *oAuthAccessTokens) Apply(ctx context.Context, oAuthAccessToken *oauthv1.OAuthAccessTokenApplyConfiguration, opts metav1.ApplyOptions) (result *v1.OAuthAccessToken, err error) {
	if oAuthAccessToken == nil {
		return nil, fmt.Errorf("oAuthAccessToken provided to Apply must not be nil")
	}
	patchOpts := opts.ToPatchOptions()
	data, err := json.Marshal(oAuthAccessToken)
	if err != nil {
		return nil, err
	}
	name := oAuthAccessToken.Name
	if name == nil {
		return nil, fmt.Errorf("oAuthAccessToken.Name must be provided to Apply")
	}
	result = &v1.OAuthAccessToken{}
	err = c.client.Patch(types.ApplyPatchType).
		Resource("oauthaccesstokens").
		Name(*name).
		VersionedParams(&patchOpts, scheme.ParameterCodec).
		Body(data).
		Do(ctx).
		Into(result)
	return
}
