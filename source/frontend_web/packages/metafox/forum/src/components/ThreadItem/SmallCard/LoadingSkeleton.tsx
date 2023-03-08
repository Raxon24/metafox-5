/**
 * @type: skeleton
 * name: forum_thread.itemView.smallCard.skeleton
 */

import { ItemText, ItemView, ItemTitle } from '@metafox/ui';
import { Box, Skeleton } from '@mui/material';
import React from 'react';

export default function LoadingSkeleton({ wrapAs, wrapProps }) {
  return (
    <ItemView testid="skeleton" wrapAs={wrapAs} wrapProps={wrapProps}>
      <ItemText>
        <ItemTitle>
          <Skeleton width={160} />
        </ItemTitle>
        <Box>
          <Skeleton width="100%" />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton width={200} sx={{ ml: 1 }} />
        </Box>
      </ItemText>
    </ItemView>
  );
}
