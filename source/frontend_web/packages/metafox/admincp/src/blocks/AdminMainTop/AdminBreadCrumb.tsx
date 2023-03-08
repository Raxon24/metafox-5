import { Link } from '@metafox/framework';
import { MenuItemShape } from '@metafox/ui';
import { Box, styled, Typography } from '@mui/material';
import React from 'react';

const sx: React.CSSProperties = {
  display: 'inline-block',
  whiteSpace: 'nowrap',
  letterSpacing: -0.1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 200,
  fontSize: 15
};

const BreadcrumbItem = ({ to, label }) => {
  if (!to) {
    return (
      <Typography component="span" sx={sx}>
        {label}
      </Typography>
    );
  }

  return (
    <Link to={to} underline="hover" color="primary" sx={sx}>
      {label}
    </Link>
  );
};

const Root = styled(Box, {
  name: 'AdminBreadCrumb',
  slot: 'Root'
})(({ theme }) => ({
  width: '275px',
  display: 'flex',
  padding: '8px 0',
  [theme.breakpoints.up('md')]: {
    width: '400px'
  }
}));

interface Props {
  breadcrumbs: MenuItemShape[];
  appName: string;
}

const AdminBreadCrumb = ({ breadcrumbs: items }: Props) => {
  const count = items?.length;

  if (!count) return null;

  return (
    <Root data-testid="Breadcrumbs">
      {items.map((item, key) => {
        return (
          <React.Fragment key={key.toString()}>
            {key > 0 ? <Separator /> : null}
            <BreadcrumbItem to={item.to} label={item.label} />
          </React.Fragment>
        );
      })}
    </Root>
  );
};

function Separator() {
  return (
    <Typography color="text.secondary" sx={{ px: 0.6 }}>
      »
    </Typography>
  );
}

export default AdminBreadCrumb;
