import { RouteLink, useGlobal } from '@metafox/framework';
import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export const AppBarBranch = styled(Box, {
  name: 'AppBarLogo',
  slot: 'Root'
})({
  display: 'inline-block',
  height: 32,
  '& a': {
    display: 'inline-block'
  }
});

export default React.forwardRef((prop, ref) => {
  const theme = useTheme();
  const { assetUrl } = useGlobal();
  const logo =
    theme.palette.mode === 'dark'
      ? assetUrl('layout.image_logo_dark')
      : assetUrl('layout.image_logo');

  return (
    <AppBarBranch>
      <RouteLink
        draggable={false}
        to="/"
        ref={ref}
        data-testid="linkLogo"
        role="link"
      >
        <img
          draggable={false}
          data-testid="imgLogo"
          src={logo}
          height="32"
          alt="Home"
        />
      </RouteLink>
    </AppBarBranch>
  );
});
