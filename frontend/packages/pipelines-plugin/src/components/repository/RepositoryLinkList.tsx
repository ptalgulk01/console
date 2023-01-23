import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResourceLink,
  ExternalLink,
  CopyToClipboard,
  truncateMiddle,
} from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { RepositoryModel } from '../../models';
import { PipelineRunKind } from '../../types';
import {
  RepositoryLabels,
  RepositoryFields,
  RepositoryAnnotations,
  RepoAnnotationFields,
} from './consts';
import { getLabelValue, sanitizeBranchName, getGitProviderIcon } from './repository-utils';

export type RepositoryLinkListProps = {
  pipelineRun: PipelineRunKind;
};

const RepositoryLinkList: React.FC<RepositoryLinkListProps> = ({ pipelineRun }) => {
  const { t } = useTranslation();
  const plrLabels = pipelineRun.metadata.labels;
  const plrAnnotations = pipelineRun.metadata.annotations;
  const repoLabel = RepositoryLabels[RepositoryFields.REPOSITORY];
  const repoName = plrLabels?.[repoLabel];
  const repoURL = plrAnnotations?.[RepositoryAnnotations[RepoAnnotationFields.REPO_URL]];
  const shaURL = plrAnnotations?.[RepositoryAnnotations[RepoAnnotationFields.SHA_URL]];

  if (!repoName) return null;

  return (
    <dl>
      <dt>{t('pipelines-plugin~Repository')}</dt>
      <dd>
        <ResourceLink
          data-test="pl-repository-link"
          kind={referenceForModel(RepositoryModel)}
          name={repoName}
          namespace={pipelineRun.metadata.namespace}
        />
        {repoURL && (
          <ExternalLink href={repoURL}>
            {getGitProviderIcon(repoURL)} {repoURL}
          </ExternalLink>
        )}
      </dd>
      {plrLabels?.[RepositoryLabels[RepositoryFields.BRANCH]] && (
        <>
          <dt>{t(getLabelValue(plrLabels[RepositoryLabels[RepositoryFields.BRANCH]]))}</dt>
          <dd data-test="pl-repository-branch">
            {sanitizeBranchName(plrLabels[RepositoryLabels[RepositoryFields.BRANCH]])}
          </dd>
        </>
      )}
      {plrLabels?.[RepositoryLabels[RepositoryFields.SHA]] && (
        <>
          <dt>{t('pipelines-plugin~Commit id')}</dt>
          <dd>
            {shaURL ? (
              <ExternalLink href={shaURL} data-test="pl-sha-url">
                {truncateMiddle(plrLabels[RepositoryLabels[RepositoryFields.SHA]], {
                  length: 7,
                  truncateEnd: true,
                  omission: '',
                })}
              </ExternalLink>
            ) : (
              <CopyToClipboard
                value={plrLabels[RepositoryLabels[RepositoryFields.SHA]]}
                data-test="pl-commit-id"
              />
            )}
          </dd>
        </>
      )}
      {plrLabels?.[RepositoryLabels[RepositoryFields.EVENT_TYPE]] && (
        <>
          <dt>{t('pipelines-plugin~Event type')}</dt>
          <dd data-test="pl-event-type">
            {plrLabels[RepositoryLabels[RepositoryFields.EVENT_TYPE]]}
          </dd>
        </>
      )}
    </dl>
  );
};

export default RepositoryLinkList;
