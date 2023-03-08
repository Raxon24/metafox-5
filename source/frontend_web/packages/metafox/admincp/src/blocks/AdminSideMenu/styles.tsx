import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      menuItem: {
        padding: '12px 32px 12px 30px',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        minHeight: 24,
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none', // harmed user selection
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          color: 'rgb(238, 238, 238)'
        }
      },
      menuItemLink: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        minHeight: 24,
        color: 'rgba(238,238,238,0.7)',
        cursor: 'pointer',
        '&:hover': {
          color: 'rgb(238, 238, 238)'
        }
      },
      menuItemActive: {
        backgroundColor: 'rgb(30, 41, 58)',
        color: 'rgb(238, 238, 238)',
        '& $menuItemLink': {
          color: 'rgb(238, 238, 238)'
        }
      },
      menuItemIcon: {
        width: 24,
        fontSize: 18,
        color: 'rgb(238, 238, 238,0.6)',
        marginRight: 8,
        display: 'inline-block'
      },
      iconArrow: {
        color: 'rgb(238, 238, 238,0.6)',
        fontSize: 13
      },
      subMenuItem: {},
      subMenuItemLink: {
        padding: '12px 16px 12px 62px',
        color: 'rgba(238, 238, 238, 0.7)',
        fontSize: 13,
        display: 'block',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          color: 'rgb(238, 238, 238)'
        }
      },
      subMenuItemActive: {
        backgroundColor: '#323944',
        color: 'rgb(238, 238, 238)',
        fontWeight: 'bold'
      }
    }),
  {
    name: 'AdminSideMenu'
  }
);

export default useStyles;
