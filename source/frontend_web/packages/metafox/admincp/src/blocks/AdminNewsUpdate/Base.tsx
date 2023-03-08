import { useGlobal } from '@metafox/framework';
import HtmlViewer from '@metafox/html-viewer';
import { Block, BlockContent, BlockHeader, BlockTitle } from '@metafox/layout';
import {
  ItemMedia,
  ItemSummary,
  ItemText,
  ItemTitle,
  UIBlockViewProps
} from '@metafox/ui';
import { Box, Link, Skeleton, styled, Tooltip } from '@mui/material';
import moment from 'moment';
import React from 'react';

export interface Props extends UIBlockViewProps {}

const ItemTitleStyled = styled(ItemTitle, {
  slot: 'ItemTitleStyled',
  shouldForwardProp: prop => prop !== 'isMobile'
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  '& a': {
    fontWeight: 'bold'
  }
}));

const ItemContent = styled('div', { slot: 'ItemContent' })(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(2),
  '&:first-child': {
    paddingTop: 0
  }
}));

const ItemMediaWrapper = styled(ItemMedia, { slot: 'ItemMedia' })(
  ({ theme }) => ({
    overflow: 'hidden',
    maxWidth: '200px',
    width: '200px',
    marginRight: '16px',
    '& img': {
      display: 'block',
      border: 'none'
    }
  })
);

const ItemSummaryWrapper = styled(ItemSummary, { slot: 'ItemSummary' })(
  ({ theme }) => ({
    '& p': {
      color: theme.palette.grey[700],
      fontSize: 13
    }
  })
);

const ViewMore = styled(Link, { slot: 'ViewMore' })(({ theme }) => ({
  color: '#2681d5',
  paddingTop: theme.spacing(2),
  display: 'block'
}));

const BlockContentSkeleton = styled(BlockContent, {
  slot: 'BlockContentSkeleton'
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& .ItemView-media': {
    paddingRight: theme.spacing(2)
  }
}));

export default function AdminItemStats({ blockProps, title }: Props) {
  const { useIsMobile, useFetchDetail, getSetting } = useGlobal();
  const isMobile = useIsMobile();

  const [data, loading] = useFetchDetail({
    dataSource: {
      apiUrl: 'admincp/dashboard/metafox-news'
    },
    pageParams: {
      limit: 3
    }
  });

  const url = getSetting('core.metafox_news_url', '/admincp');

  if (loading) {
    return (
      <Block>
        <BlockHeader>
          <BlockTitle>{title}</BlockTitle>
        </BlockHeader>
        <BlockContentSkeleton>
          <ItemMedia>
            <Skeleton variant="rectangular" width={120} height={65} />
          </ItemMedia>
          <ItemText>
            <Skeleton width={200} />
            <Skeleton width={160} />
          </ItemText>
        </BlockContentSkeleton>
      </Block>
    );
  }

  return (
    <Block>
      <BlockHeader>
        <BlockTitle>{title}</BlockTitle>
      </BlockHeader>
      <BlockContent>
        {!loading && data ? (
          <>
            {data.map((item, index) => (
              <ItemContent key={index}>
                <ItemMediaWrapper src={item.image} />
                <ItemText>
                  <Box>
                    <ItemTitleStyled isMobile={isMobile}>
                      <Tooltip title={item.title} arrow>
                        <Link target="_blank" href={item.link}>
                          <HtmlViewer html={item.title} />
                        </Link>
                      </Tooltip>
                    </ItemTitleStyled>
                    <ItemSummaryWrapper>
                      {item.creator}
                      {' . '}
                      {moment(item?.created_at).format('MMMM DD, yyyy')}
                    </ItemSummaryWrapper>
                  </Box>
                </ItemText>
              </ItemContent>
            ))}
            <ViewMore target="_blank" href={url}>
              View More
            </ViewMore>
          </>
        ) : null}
      </BlockContent>
    </Block>
  );
}
