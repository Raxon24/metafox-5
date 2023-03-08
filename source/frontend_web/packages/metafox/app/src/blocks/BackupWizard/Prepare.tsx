/**
 * @type: ui
 * name: backup.step.PrepareBackup
 * bundle: admincp
 */

import { useGlobal } from '@metafox/framework';
import { useStepNavigate } from '@metafox/ui/steps';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

export default function PrepareBackup() {
  const { useFetchDetail, i18n, getErrorMessage } = useGlobal();
  const [next] = useStepNavigate();
  const [data, , error] = useFetchDetail({
    dataSource: {
      apiUrl: '/admincp/backup/file/prepare'
    }
  });

  return (
    <Box>
      <Typography>Prepare</Typography>
      {data ? (
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data}</Typography>
      ) : null}
      {error ? (
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
          {getErrorMessage(error)}
        </Typography>
      ) : null}
      {data ? (
        <Box sx={{ py: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            data-testid="buttonSubmit"
            onClick={next}
          >
            {i18n.formatMessage({ id: 'continue' })}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
