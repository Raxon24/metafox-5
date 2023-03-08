/**
 * @type: ui
 * name: backup.step.ProcessBackup
 * bundle: admincp
 */

import { useGlobal, Link } from '@metafox/framework';
import { LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function SendRequest() {
  const { useFetchDetail } = useGlobal();

  const [data, loading, error] = useFetchDetail({
    dataSource: {
      apiUrl: '/admincp/backup/file',
      apiMethod: 'post'
    }
  });

  if (loading) {
    return <LinearProgress variant="indeterminate" />;
  }

  if (data) {
    return (
      <Box>
        <Box>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data.output}</Typography>
        </Box>
        <Box sx={{ pt: 2 }}>
          <Typography color="primary">
            <Link to="/admincp/backup/file/browse">Browse Backup Files</Link>
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(error)}
      </Typography>
    );
  }
}
