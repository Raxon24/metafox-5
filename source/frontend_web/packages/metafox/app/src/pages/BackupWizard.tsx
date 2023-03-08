/**
 * @type: route
 * path: /admincp/backup/wizard
 * name: admincp.backup.wizard
 * bundle: admincp
 */

import { useGlobal } from '@metafox/framework';
import { Page } from '@metafox/layout';
import React from 'react';

export default function BackupWizard(props) {
  const { createPageParams } = useGlobal();

  const pageParams = createPageParams(props, () => ({
    appName: 'backup',
    module_name: 'backup',
    pageMetaName: 'backup.wizard.backup_now'
  }));

  return <Page pageName="admincp.backup.wizard" pageParams={pageParams} />;
}
