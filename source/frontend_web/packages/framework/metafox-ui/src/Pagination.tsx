import { useGlobal, useResourceForm, useLocation } from '@metafox/framework';
import React from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  styled,
  Button,
  Box,
  Typography
} from '@mui/material';
import { range } from 'lodash';
import qs from 'query-string';
import { LineIcon } from '@metafox/ui';
import { FormBuilder } from '@metafox/form';

export interface PaginationProps {
  'data-testid'?: string;
  currentPage: number;
  from: number;
  to: number;
  total: number;
  itemsPerPage: number;
  message?: string;
  hasSort?: boolean;
  moduleName?: string;
  resourceName?: string;
  actionName?: string;
}
const Wrapper = styled(Box, {
  shouldForwardProp: props => props !== 'isMobile'
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  display: 'flex',
  ...(!isMobile && {
    justifyContent: 'space-between'
  }),

  flexFlow: 'wrap',
  alignItems: 'center',
  padding: theme.spacing(2),
  '&:first-child': {
    paddingBottom: theme.spacing(1)
  }
}));
const List = styled('ul', {
  name: 'PaginationList'
})(({ theme }) => ({
  margin: theme.spacing(0, 0, 0, 1.5),
  listStyle: 'none',
  padding: 0,
  display: 'flex',
  '& .MuiInputBase-root': {
    fontSize: '13px',
    paddingTop: (40 - 13) / 2,
    paddingBottom: (40 - 13) / 2,
    height: '32px',
    boxSizing: 'border-box',
    '& .MuiSelect-select': {
      padding: '5px 8px !important'
    }
  }
}));

const ButtonNav = styled(Button, {
  name: 'ButtonNav'
})(({ theme }) => ({
  minWidth: theme.spacing(4)
}));

export default function Pagination({
  currentPage,
  from,
  to,
  total,
  itemsPerPage,
  message = 'showing_from_to_of_total_items',
  'data-testid': testid = 'pagination',
  hasSort,
  moduleName,
  resourceName,
  actionName
}: PaginationProps) {
  const { i18n, navigate, useIsMobile } = useGlobal();
  const totalPage = Math.ceil(total / itemsPerPage);
  const location = useLocation();
  const isMobile = useIsMobile();

  const searchParams = location?.search
    ? qs.parse(location.search.replace(/^\?/, ''))
    : {};

  const handleChange = event => {
    const value = event.target.value;

    navigate(
      {
        search: qs.stringify({
          ...searchParams,
          page: value
        })
      },
      { replace: true }
    );
  };

  const handlePrevious = () => {
    navigate(
      {
        search: qs.stringify({
          ...searchParams,
          page: currentPage - 1
        })
      },
      { replace: true }
    );
  };

  const handleNext = () => {
    navigate(
      {
        search: qs.stringify({
          ...searchParams,
          page: currentPage + 1
        })
      },
      { replace: true }
    );
  };

  const formSchema = useResourceForm(moduleName, resourceName, actionName);

  const onChangeSort = ({ values }) => {
    if (values?.sort_by !== searchParams?.sort_by) {
      navigate(
        {
          search: qs.stringify({
            ...searchParams,
            sort_by: values.sort_by,
            page: 1
          })
        },
        { replace: true }
      );
    }
  };

  const onSubmit = (values, actions) => {
    actions.setSubmitting(false);
  };

  if (!hasSort && totalPage < 2) return null;

  return (
    <Wrapper isMobile={hasSort && isMobile}>
      {hasSort && (
        <FormBuilder
          noHeader
          noBreadcrumb
          formSchema={formSchema}
          onSubmit={onSubmit}
          onChange={onChangeSort}
        />
      )}
      {totalPage > 1 && (
        <>
          <Typography component="div" color="textHint" variant="body2">
            {i18n.formatMessage(
              {
                id: message
              },
              { from, to, total }
            )}
          </Typography>
          <List>
            <ButtonNav
              disabled={currentPage === 1}
              size="small"
              variant="outlined"
              onClick={handlePrevious}
            >
              <LineIcon icon="ico-angle-left" />
            </ButtonNav>
            <FormControl sx={{ minWidth: 50, mx: 1 }} size="small">
              <Select
                labelId="select-page-pagination"
                id="select-page-pagination"
                value={currentPage}
                onChange={handleChange}
              >
                {range(1, totalPage + 1).map(page => (
                  <MenuItem key={page} value={page}>
                    {page}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ButtonNav
              disabled={currentPage === totalPage}
              size="small"
              variant="outlined"
              onClick={handleNext}
            >
              <LineIcon icon="ico-angle-right" />
            </ButtonNav>
          </List>
        </>
      )}
    </Wrapper>
  );
}
