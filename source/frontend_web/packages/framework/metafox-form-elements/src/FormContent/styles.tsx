import { Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

export default makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        display: 'block',
        flexGrow: 2
      },
      rootSide: {
        overflow: 'auto',
        paddingRight: 0,
        '& > *:first-child': {
          height: '100% !important'
        }
      }
    }),
  {
    name: 'FormContent'
  }
);
