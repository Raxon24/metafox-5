import { Link, useGlobal } from '@metafox/framework';
import React from 'react';
import {
  FormatDate,
  ItemAction,
  ItemText,
  ItemTitle,
  ItemView,
  SponsorFlag,
  LineIcon,
  PendingFlag
} from '@metafox/ui';
import { styled, Box } from '@mui/material';
import { slugify } from '@metafox/utils';
import { ThreadItemProps } from '@metafox/forum/types';
import LoadingSkeleton from './LoadingSkeleton';

const name = 'ThreadItemSmallCard';

const ItemTitleStyled = styled(ItemTitle, {
  name,
  slot: 'ItemTitleStyled'
})(({ theme }) => ({
  maxWidth: 'calc(100% - 32px)'
}));

const SubInfoStyled = styled('div', { name, slot: 'subInfoStyled' })(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center'
  })
);

const ProfileLink = styled(Link, { name, slot: 'profileLink' })(
  ({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: theme.mixins.pxToRem(13),
    fontWeight: theme.typography.fontWeightBold,
    '&:hover': {
      textDecoration: 'underline'
    }
  })
);

const ForumLink = styled(Link, { name, slot: 'forumLink' })(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: theme.mixins.pxToRem(13),
  '&:hover': {
    textDecoration: 'underline'
  }
}));

const InfoStyled = styled('div', { name, slot: 'infoStyled' })(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  flexDirection: 'column'
}));

const TotalComment = styled('div', { name, slot: 'totalComment' })(
  ({ theme }) => ({
    margin: theme.spacing(0.5, 0.5, 0, 0),
    fontSize: theme.mixins.pxToRem(13),
    display: 'flex'
  })
);

const WrapperTitleAction = styled(Box, { name, slot: 'title-action' })(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mt: 1
  })
);

export default function ThreadItemSmallCard({
  item,
  identity,
  itemProps,
  user,
  state,
  handleAction,
  wrapAs,
  wrapProps
}: ThreadItemProps) {
  const { ItemActionMenu, useGetItem } = useGlobal();

  const to = `/forum/thread/${item?.id}`;

  const {
    statistic,
    title,
    modification_date,
    forum: forumEntity
  } = item || {};
  const forum: Record<string, any> = useGetItem(forumEntity);

  const toForum = forum
    ? `/forum/${forum?.id}/${slugify(forum?.title || '')}`
    : '';

  if (!user || !item) return null;

  return (
    <ItemView testid={item.resource_name} wrapAs={wrapAs} wrapProps={wrapProps}>
      <ItemText>
        <ItemTitleStyled>
          <SponsorFlag variant="itemView" value={item.is_sponsor} />
          <PendingFlag variant="itemView" value={item.is_pending} />
          <Link to={to}>{title}</Link>
        </ItemTitleStyled>
        <InfoStyled>
          <SubInfoStyled sx={{ color: 'text.secondary' }}>
            <ProfileLink
              hoverCard={`/user/${user.id}`}
              to={user.link}
              children={user.full_name}
            />
            <Box mr={1} ml={1}>
              {'·'}
            </Box>
            <FormatDate
              data-testid="creationDate"
              value={modification_date}
              format="ll"
            />
          </SubInfoStyled>
          <WrapperTitleAction>
            {forum?.title ? (
              <ForumLink to={toForum} children={forum?.title} />
            ) : null}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TotalComment>
                <LineIcon icon="ico-comment-square-empty-o" />
                <Box ml={0.75} sx={{ lineHeight: 0.9, fontSize: 15 }}>
                  {statistic?.total_comment ?? 0}
                </Box>
              </TotalComment>
              {itemProps.showActionMenu ? (
                <ItemAction>
                  <ItemActionMenu
                    identity={identity}
                    icon={'ico-dottedmore-vertical-o'}
                    state={state}
                    handleAction={handleAction}
                  />
                </ItemAction>
              ) : null}
            </Box>
          </WrapperTitleAction>
        </InfoStyled>
      </ItemText>
    </ItemView>
  );
}

ThreadItemSmallCard.LoadingSkeleton = LoadingSkeleton;
