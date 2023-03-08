/**
 * @type: block
 * name: backup.block.BackupWizard
 * bundle: admincp
 */

import { createBlock } from '@metafox/framework';
import { Block, BlockContent } from '@metafox/layout';
import { VerticalSteps } from '@metafox/ui/steps';
import React from 'react';

const data = {
  steps: [
    {
      title: 'Prepare',
      id: 'prepare',
      content: { component: 'backup.step.PrepareBackup' }
    },
    {
      title: 'Process Backup',
      id: 'process',
      content: { component: 'backup.step.ProcessBackup' }
    }
  ]
};

const BackupWizard = () => {
  return (
    <Block>
      <BlockContent>
        <VerticalSteps data={data} />
      </BlockContent>
    </Block>
  );
};

export default createBlock({
  extendBlock: BackupWizard
});
