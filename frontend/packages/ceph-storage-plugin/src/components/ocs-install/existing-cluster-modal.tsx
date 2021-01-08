import * as React from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { match as RouteMatch } from 'react-router';
import { Button } from '@patternfly/react-core';
import { Modal } from '@console/shared/src/components/modal';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager/src';
import { history, resourcePathFromModel } from '@console/internal/components/utils';
import { ListKind, referenceForModel } from '@console/internal/module/k8s';
import { StorageClusterKind } from '../../types';
import { OCSServiceModel } from '../../models';

const ExistingClusterModal: React.FC<ExistingClusterModalProps> = ({ match, storageCluster }) => {
  const {
    params: { ns, appName },
  } = match;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(true);

  const clusterName = storageCluster.items.find((sc) => sc.status.phase !== 'Ignored').metadata
    .name;

  const storageClusterPath = `/k8s/ns/${ns}/clusterserviceversions/${appName}/${referenceForModel(
    OCSServiceModel,
  )}/${clusterName}`;

  const onConfirm = () => {
    setIsOpen(false);
    history.push(resourcePathFromModel(ClusterServiceVersionModel, appName, ns));
  };

  const onCancel = () => {
    setIsOpen(false);
    history.push(storageClusterPath);
  };

  return (
    <Modal
      title={t('ceph-storage-plugin~Storage Cluster exists')}
      titleIconVariant="warning"
      isOpen={isOpen}
      variant="small"
      isFullScreen={false}
      actions={[
        <Button key="confirm" variant="primary" onClick={onConfirm}>
          {t('ceph-storage-plugin~Back to operator page')}
        </Button>,
        <Button key="cancel" variant="link" onClick={onCancel}>
          {t('ceph-storage-plugin~Go to cluster page')}
        </Button>,
      ]}
    >
      <Trans t={t} ns="ceph-storage-plugin" i18nKey="clusterExistText">
        A storage cluster <Link to={storageClusterPath}>{{ clusterName }}</Link> is already created.
        <br />
        You cannot create another storage cluster.
      </Trans>
    </Modal>
  );
};

type ExistingClusterModalProps = {
  match: RouteMatch<{ ns: string; appName: string }>;
  storageCluster: ListKind<StorageClusterKind>;
};

export default ExistingClusterModal;
