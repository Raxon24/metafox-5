import { BlockViewProps, useFixedRect, useGlobal } from '@metafox/framework';
import { Box, styled } from '@mui/material';
import React from 'react';

export interface Props extends BlockViewProps {}

const name = 'AllMessage';
const Root = styled(Box, { name, slot: 'Root' })(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}));

const ContainerStyled = styled(Box, { name, slot: 'container' })(
  ({ theme }) => ({
    display: 'flex',
    width: '100%',
    height: '100%'
  })
);

const BuddyWrapStyled = styled(Box, {
  name,
  slot: 'buddy-wrap',
  shouldForwardProp: props => props !== 'isMobile' && props !== 'isNoShow'
})<{ isMobile: boolean; isNoShow: boolean }>(
  ({ theme, isMobile, isNoShow }) => ({
    width: '360px',
    ...(isMobile && {
      width: '100%'
    }),
    ...(isNoShow && {
      display: 'none'
    })
  })
);

const RoomWrapStyled = styled(Box, {
  name,
  slot: 'room-wrap',
  shouldForwardProp: props => props !== 'isMobile' && props !== 'isNoShow'
})<{ isMobile: boolean; isNoShow: boolean }>(
  ({ theme, isMobile, isNoShow }) => ({
    ...(!isMobile && {
      flex: 1,
      minWidth: 0
    }),
    ...(isMobile && {
      width: '100%'
    }),
    ...(isNoShow && {
      display: 'none'
    })
  })
);

export default function Base(props: Props) {
  const { jsxBackend, useIsMobile, usePageParams } = useGlobal();
  const Buddy = jsxBackend.get('chat.block.buddy');
  const Room = jsxBackend.get('chat.block.chatroom');
  const ref = React.useRef();
  const rect = useFixedRect(ref);
  const isMobile = useIsMobile();
  const pageParams = usePageParams();

  const { rid } = pageParams;

  return (
    <Root ref={ref}>
      <Box style={rect.style}>
        <ContainerStyled>
          <BuddyWrapStyled
            isNoShow={Boolean(isMobile && rid)}
            isMobile={isMobile}
          >
            <Buddy />
          </BuddyWrapStyled>
          <RoomWrapStyled
            isNoShow={Boolean(isMobile && !rid)}
            isMobile={isMobile}
          >
            <Room />
          </RoomWrapStyled>
        </ContainerStyled>
      </Box>
    </Root>
  );
}
