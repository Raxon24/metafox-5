/**
 * @type: block
 * name: core.block.offline
 * bundle: web
 * experiment: true
 */

import { createBlock } from '@metafox/framework';
import { Block, BlockContent } from '@metafox/layout';
import { Box } from '@mui/material';
import React from 'react';

function Offline() {
  return (
    <Block>
      <BlockContent>
        <Box sx={{ width: 320, height: 320 }}>
          Application is in maintain mode.
        </Box>
      </BlockContent>
    </Block>
  );
}

export default createBlock({
  extendBlock: Offline,
  overrides: {
    title: 'Offline'
  }
});
