/* eslint-disable max-len */
import { useGlobal } from '@metafox/framework';
import { Block, BlockContent, BlockHeader, BlockTitle } from '@metafox/layout';
import { ItemText, UIBlockViewProps } from '@metafox/ui';
import { Skeleton, styled } from '@mui/material';
import moment from 'moment';
import React from 'react';

const ItemTextWrapper = styled(ItemText, { slot: 'ItemWrapper' })(
  ({ theme }) => ({
    paddingTop: theme.spacing(2),
    marginTop: theme.spacing(1),
    borderTop: '1px solid #eaeaea',
    '&:first-child': {
      paddingTop: 0,
      marginTop: 0,
      border: 'none'
    }
  })
);

const ItemTitle = styled('h3', { slot: 'ItemWrapper' })(({ theme }) => ({
  marginTop: 0,
  marginBottom: theme.spacing(1.5)
}));

const ItemContent = styled('div', { slot: 'ItemContent' })(({ theme }) => ({
  color: theme.palette.grey[700],
  marginBottom: theme.spacing(1),
  '& span': {
    fontWeight: 'bold'
  }
}));

export interface Props extends UIBlockViewProps {}

export default function AdminItemStats({ blockProps, title }: Props) {
  const { useFetchDetail } = useGlobal();

  const [data, loading] = useFetchDetail({
    dataSource: {
      apiUrl: 'admincp/dashboard/admin-logged'
    }
  });

  if (loading) {
    return (
      <Block>
        <BlockHeader title={title} />
        <BlockContent>
          <Skeleton variant="text" width={160} />
          <Skeleton variant="text" width={160} />
          <Skeleton variant="text" width="100%" />
        </BlockContent>
      </Block>
    );
  }

  return (
    <Block>
      <BlockHeader>
        <BlockTitle>{title}</BlockTitle>
      </BlockHeader>
      <BlockContent>
        {!loading && data
          ? data.map((item, index) => (
              <ItemTextWrapper key={index}>
                <ItemTitle>{item?.user.full_name}</ItemTitle>
                <ItemContent>{item?.ip_address}</ItemContent>
                <ItemContent>
                  Last login:{' '}
                  <span>
                    {moment(item?.modification_date).format('MMMM DD, yyyy')}{' '}
                  </span>
                  <span>({moment(item?.modification_date).format('LT')})</span>
                </ItemContent>
              </ItemTextWrapper>
            ))
          : null}
      </BlockContent>
    </Block>
  );
}
