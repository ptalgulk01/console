import * as React from 'react';
import { AsyncComponent } from '@console/internal/components/utils';

const QuickStartCatalogPageAsync: React.FC = () => (
  <AsyncComponent loader={() => import('./QuickStartCatalogPage').then((c) => c.default)} />
);

export default QuickStartCatalogPageAsync;
