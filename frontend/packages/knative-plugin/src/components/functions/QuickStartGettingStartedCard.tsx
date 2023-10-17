import * as React from 'react';
import {
  AllQuickStartStates,
  QuickStart,
  QuickStartStatus,
  QuickStartContext,
  QuickStartContextValues,
  getQuickStartStatus,
} from '@patternfly/quickstarts';
import { RouteIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import QuickStartsLoader from '@console/app/src/components/quick-starts/loader/QuickStartsLoader';
import {
  GettingStartedCard,
  GettingStartedLink,
} from '@console/shared/src/components/getting-started';

interface QuickStartGettingStartedCardProps {
  featured?: string[];
  title?: string;
  description?: string;
  filter?: (QuickStart) => boolean;
}

const orderQuickStarts = (
  allQuickStarts: QuickStart[],
  allQuickStartStates: AllQuickStartStates,
  featured: string[],
  filter?: (QuickStart) => boolean,
): QuickStart[] => {
  const orderedQuickStarts: QuickStart[] = [];

  const filteredQuickStarts = filter ? allQuickStarts.filter(filter) : allQuickStarts;

  const getStatus = (quickStart: QuickStart) =>
    getQuickStartStatus(allQuickStartStates, quickStart.metadata.name);

  // Prioritize featured quick starts and keep specified order
  if (featured) {
    const featuredQuickStartsByName = filteredQuickStarts.reduce((acc, q) => {
      acc[q.metadata.name] = q;
      return acc;
    }, {} as Record<string, QuickStart>);
    featured.forEach((quickStartName) => {
      if (
        featuredQuickStartsByName[quickStartName] &&
        getStatus(featuredQuickStartsByName[quickStartName]) !== QuickStartStatus.COMPLETE
      ) {
        orderedQuickStarts.push(featuredQuickStartsByName[quickStartName]);
      }
    });
  }

  return orderedQuickStarts;
};

export const QuickStartGettingStartedCard: React.FC<QuickStartGettingStartedCardProps> = ({
  featured,
  title,
  description,
  filter,
}) => {
  const { t } = useTranslation();
  const { allQuickStartStates, setActiveQuickStart } = React.useContext<QuickStartContextValues>(
    QuickStartContext,
  );

  return (
    <QuickStartsLoader>
      {(quickStarts, loaded) => {
        const orderedQuickStarts = orderQuickStarts(
          quickStarts,
          allQuickStartStates,
          featured,
          filter,
        );
        const slicedQuickStarts = orderedQuickStarts.slice(0, 2);

        let links: GettingStartedLink[] = [];
        if (loaded && slicedQuickStarts.length === 0) {
          links.push(
            {
              id: 'ide-extensions',
              href:
                'https://marketplace.visualstudio.com/items?itemName=redhat.vscode-openshift-connector',
              title: t('knative-plugin~Create using IDE extension'),
              external: true,
            },
            {
              id: 'functions-tekton-pipelines',
              title: t('knative-plugin~Building Functions on Cluster with Tekton Pipelines'),
              href:
                'https://github.com/knative/func/blob/main/docs/building-functions/on_cluster_build.md',
              external: true,
            },
          );
        } else {
          links = loaded
            ? slicedQuickStarts.map((quickStart: QuickStart) => ({
                id: quickStart.metadata.name,
                title: quickStart.spec.displayName,
                onClick: () => {
                  setActiveQuickStart(quickStart.metadata.name, quickStart.spec.tasks.length);
                },
              }))
            : featured?.map((name) => ({
                id: name,
                loading: true,
              }));
        }
        return (
          <GettingStartedCard
            id="quick-start"
            icon={<RouteIcon color="var(--co-global--palette--purple-600)" aria-hidden="true" />}
            title={title || t('knative-plugin~Build with guided documentation')}
            titleColor={'var(--co-global--palette--purple-700)'}
            description={
              description ||
              t(
                'knative-plugin~Follow guided documentation to build applications and familiarize yourself with key features.',
              )
            }
            links={links}
          />
        );
      }}
    </QuickStartsLoader>
  );
};
