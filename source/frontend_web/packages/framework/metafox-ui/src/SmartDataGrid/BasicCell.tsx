/**
 * @type: ui
 * name: dataGrid.cell.BasicCell
 */

import { RouteLink } from '@metafox/framework';
import { styled } from '@mui/material';
import { get } from 'lodash';
import React from 'react';
import { LineIcon } from '@metafox/ui';

const IsUrlReg = /^(http|https)?:?\/\//s;

const FeaturedIcon = styled(LineIcon, { name: 'FeaturedIcon' })(
  ({ theme }) => ({
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(0.5),
    fontSize: 12
  })
);

const StyledBox = styled('span', {
  name: 'StyledBox'
})<{ multiline: boolean }>(({ multiline }) => ({
  ...(multiline && {
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2'
  })
}));

// todo moved this column to base size.
export default function BasicCell({
  row,
  colDef: { field, target, urlField, multiline }
}) {
  const content = get(row, field, null);
  const sx = get(row, 'sx');
  const sxProps = get(sx, field);
  let url: string = '';

  if (urlField) {
    url = get<string>(row, urlField);

    if (url) {
      if (IsUrlReg.test(url) || target) {
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {content}
            {row?.is_featured && <FeaturedIcon icon="ico-check-circle" />}
          </a>
        );
      }

      return <RouteLink to={url}>{content}</RouteLink>;
    }
  }

  return (
    <StyledBox multiline={multiline} sx={sxProps}>
      {content}
    </StyledBox>
  );
}
