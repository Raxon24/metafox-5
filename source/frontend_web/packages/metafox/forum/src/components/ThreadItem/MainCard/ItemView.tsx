/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useGlobal } from '@metafox/framework';
import React from 'react';
import {
  FormatDate,
  ItemAction,
  ItemText,
  ItemTitle,
  ItemView,
  ItemSummary,
  SponsorFlag,
  LineIcon,
  PendingFlag,
  UserAvatar
} from '@metafox/ui';
import { styled, Box, Chip } from '@mui/material';
import { slugify } from '@metafox/utils';
import { ThreadItemProps } from '@metafox/forum/types';

const name = 'ThreadItemMainCard';

const SubInfoStyled = styled('div', { name, slot: 'subInfoStyled' })(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
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
  marginTop: theme.spacing(1.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative'
}));

const TotalComment = styled('div', { name, slot: 'totalComment' })(
  ({ theme }) => ({
    marginRight: theme.spacing(4),
    fontSize: theme.mixins.pxToRem(13),
    display: 'flex'
  })
);

const IconTitle = styled(LineIcon, { name, slot: 'IconTitle' })(
  ({ theme }) => ({
    marginRight: theme.spacing(1.5),
    color: theme.palette.success.main,
    fontSize: theme.spacing(2.5)
  })
);

const Profile = styled(Box, { name, slot: 'Profile' })(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(0.5)
  }
}));

const Description = styled(ItemSummary, { name, slot: 'Description' })(
  ({ theme }) => ({
    marginTop: theme.spacing(1.5),
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.grey[100]
        : theme.palette.grey[700],
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  })
);

const FlagWrapper = styled('span', {
  slot: 'FlagWrapper',
  name
})(({ theme }) => ({
  display: 'inline-flex',
  '&>span': {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0)
  }
}));

export default function ThreadItemMainCard({
  item,
  identity,
  itemProps,
  user,
  state,
  handleAction,
  wrapAs,
  wrapProps
}: ThreadItemProps) {
  const { ItemActionMenu, useGetItem, i18n, useTheme } = useGlobal();

  const theme = useTheme();

  const to = `/forum/thread/${item?.id}`;

  const {
    statistic,
    title,
    modification_date,
    description,
    short_description,
    forum: forumEntity,
    is_closed,
    is_sticked,
    is_wiki
  } = item || {};

  let iconMedia = '';
  let labelTitle = '';

  if (is_sticked) {
    iconMedia = 'ico-thumb-tack';
    labelTitle = 'pinned';
  }

  if (is_wiki) {
    iconMedia = 'ico-file-word';
    labelTitle = 'wiki';
  }

  const forum: Record<string, any> = useGetItem(forumEntity);

  const toForum = forum
    ? `/forum/${forum?.id}/${slugify(forum?.title || '')}`
    : '';

  if (!user || !item) return null;

  return (
    <ItemView testid={item.resource_name} wrapAs={wrapAs} wrapProps={wrapProps}>
      <ItemText>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {iconMedia && <IconTitle icon={iconMedia} />}
          <FlagWrapper>
            <SponsorFlag variant="itemView" value={item.is_sponsor} />
            <PendingFlag variant="itemView" value={item.is_pending} />
          </FlagWrapper>
          <ItemTitle>
            <Link to={to}>{title}</Link>
          </ItemTitle>
        </Box>

        <Description>
          <div
            dangerouslySetInnerHTML={{
              __html: short_description || description
            }}
          />
        </Description>
        <InfoStyled>
          <SubInfoStyled sx={{ color: 'text.secondary' }}>
            {is_closed && (
              <Chip
                size="small"
                label={i18n.formatMessage({ id: 'closed' })}
                variant="filled"
                sx={{
                  mr: 1,
                  mb: { sm: 0, xs: 1 },
                  color: 'default.contrastText',
                  backgroundColor: 'text.secondary',
                  fontSize: '13px'
                }}
              />
            )}
            <Profile>
              <UserAvatar size={32} user={user} variant="circular" />
              <Box ml={1} mr={0.5}>
                {i18n.formatMessage({ id: 'posted_by_' })}
              </Box>
              <ProfileLink
                hoverCard={`/user/${user.id}`}
                to={user.link}
                children={user.full_name}
              />
            </Profile>
            <Box sx={{ display: { sm: 'block', xs: 'none' } }} mr={1} ml={1}>
              {'·'}
            </Box>
            <FormatDate
              data-testid="creationDate"
              value={modification_date}
              format="ll"
              phrase="last_update_on_time"
            />
            <Box sx={{ display: { sm: 'block', xs: 'none' } }} mr={1} ml={1}>
              {'·'}
            </Box>
            <ForumLink
              sx={{ mt: { sm: 0, xs: 0.5 } }}
              to={toForum}
              children={forum?.title}
            />
          </SubInfoStyled>
          <TotalComment>
            <LineIcon icon="ico-comment-square-empty-o" sx={{ fontSize: 16 }} />
            <Box ml={0.75} sx={{ lineHeight: 0.9, fontSize: 15 }}>
              {statistic?.total_comment ?? 0}
            </Box>
          </TotalComment>
          {itemProps.showActionMenu ? (
            <ItemAction placement="center-end">
              <ItemActionMenu
                identity={identity}
                icon={'ico-dottedmore-vertical-o'}
                state={state}
                handleAction={handleAction}
              />
            </ItemAction>
          ) : null}
        </InfoStyled>
      </ItemText>
    </ItemView>
  );
}
