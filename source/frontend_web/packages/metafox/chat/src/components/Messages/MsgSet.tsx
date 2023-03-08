import { ChatMsgPassProps, MsgSetShape } from '@metafox/chat/types';
import { useGlobal } from '@metafox/framework';
import { styled } from '@mui/material';
import React from 'react';
import MsgAvatar from './MsgAvatar';
import MsgItem from './MsgItem';

interface MessageSetProps extends ChatMsgPassProps {
  msgSet: MsgSetShape;
}

const name = 'MsgSet';

const UIChatMsgSet = styled('div', {
  name,
  slot: 'uiChatMsgSet',
  shouldForwardProp: prop => prop !== 'isOwner' && prop !== 'isAlert'
})<{ isOwner?: boolean; isAlert?: boolean }>(({ theme, isOwner, isAlert }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(0.5, 2),
  ...(isAlert && {
    '&.uiChatMsgItemCall': {
      border: 'none'
    },
    '&.uiChatMsgActions': {
      justifyContent: 'center',
      '&.my-1; .btn': {
        '&.mx-1': '!important'
      }
    }
  }),
  ...(isOwner && { flexDirection: 'row-reverse' })
}));

const UIChatMsgSetAvatar = styled('div', {
  name,
  slot: 'uiChatMsgSetAvatar',
  shouldForwardProp: prop => prop !== 'isOwner' && prop !== 'isAlert'
})<{ isOwner?: boolean; isAlert?: boolean }>(({ theme, isOwner, isAlert }) => ({
  marginRight: theme.spacing(1),
  ...(isOwner && { display: 'none', flexDirection: 'row-reverse' }),
  ...(isAlert && { display: 'none' })
}));

const UIChatMsgSetBody = styled('div', {
  name,
  slot: 'uiChatMsgSetBody',
  shouldForwardProp: prop => prop !== 'isOwner'
})<{ isOwner?: boolean }>(({ theme, isOwner }) => ({
  flex: 1,
  minWidth: 0,
  ...(isOwner && { flexDirection: 'row-reverse' })
}));

const UIChatMsgSetBodyUser = styled('div', {
  name,
  slot: 'uiChatMsgSetBodyUser'
})(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0, 0.5)
}));

export default function MsgSet({
  msgSet,
  disableReact,
  handleAction
}: MessageSetProps) {
  const { useSession, useGetItem } = useGlobal();

  const { user: authUser } = useSession();

  const user = useGetItem(msgSet?.user);

  if (!msgSet) return;

  const { items } = msgSet;

  const isOwner = authUser.id === user.id;

  if (!items || !items.length) {
    return null;
  }

  return (
    <UIChatMsgSet
      isOwner={isOwner}
      className={`uiChatMsgSet ${isOwner ? 'isOwner' : ''}`}
    >
      <UIChatMsgSetAvatar isOwner={isOwner} className={'uiChatMsgSetAvatar'}>
        <MsgAvatar user={user} size={32} />
      </UIChatMsgSetAvatar>
      <UIChatMsgSetBody className={'uiChatMsgSetBody'}>
        {!isOwner && (
          <UIChatMsgSetBodyUser>{user.full_name}</UIChatMsgSetBodyUser>
        )}
        {items.map((msgId, i) => (
          <MsgItem
            authUser={authUser}
            key={msgId.toString()}
            msgId={msgId}
            disableReact={disableReact}
            handleAction={handleAction}
          />
        ))}
      </UIChatMsgSetBody>
    </UIChatMsgSet>
  );
}
