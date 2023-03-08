/**
 * @type: ui
 * name: commentComposer.control.attachFile
 */

import { useGlobal } from '@metafox/framework';
import { ClickOutsideListener, LineIcon } from '@metafox/ui';
import { Paper, styled, Tooltip } from '@mui/material';
import Popper from '@mui/material/Popper';
import React from 'react';

const WrapperButtonIcon = styled('div')(({ theme }) => ({
  fontSize: theme.spacing(1.875),
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  minWidth: '28px',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey['700']
      : theme.palette.text.primary,
  cursor: 'pointer'
}));
const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.25, 1.75),
  fontSize: theme.mixins.pxToRem(13),
  lineHeight: theme.mixins.pxToRem(16),
  fontWeight: theme.typography.fontWeightMedium,
  '& .ico': {
    marginRight: theme.spacing(1)
  }
}));

function AttachEmojiToStatusComposer({
  rid,
  onAttachFiles,
  previewRef,
  filesUploadRef,
  control: Control
}: any) {
  const { i18n, useIsMobile } = useGlobal();
  const inputRef = React.useRef<HTMLInputElement>();
  const fileUploadRef = React.useRef<HTMLInputElement>();
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const isMobile = useIsMobile();

  const onChangeImage = () => {
    if (!inputRef.current.files.length) return;

    if (previewRef) {
      previewRef.current?.attachFiles(inputRef.current.files);
      previewRef.current?.typeUpload('image');
    }

    if (filesUploadRef) {
      filesUploadRef.current?.attachFiles(inputRef.current.files);
    }

    if (onAttachFiles) onAttachFiles(inputRef.current.files);
  };

  const fileUploadChanged = () => {
    if (!fileUploadRef.current.files.length) return;

    if (previewRef) {
      previewRef.current?.attachFiles(fileUploadRef.current.files);
      previewRef.current?.typeUpload('file');
    }

    if (filesUploadRef) {
      filesUploadRef.current?.attachFiles(fileUploadRef.current.files);
    }

    if (onAttachFiles) onAttachFiles(fileUploadRef.current.files);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleMouseLeave = () => {
    setOpenTooltip(false);
  };

  const handleMouseEnter = () => {
    if (!anchorEl) setOpenTooltip(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const attachImages = () => {
    inputRef.current.click();
  };

  const attachFile = () => {
    fileUploadRef.current.click();
  };

  const items = [
    {
      label: i18n.formatMessage({ id: 'send_photo' }),
      icon: 'ico-photo',
      onClick: attachImages,
      condition: true
    },
    {
      label: i18n.formatMessage({ id: 'attach_files' }),
      icon: 'ico-paperclip-alt',
      onClick: attachFile,
      condition: true
    }
  ];

  return (
    <div>
      <Tooltip
        open={isMobile ? false : openTooltip}
        title={i18n.formatMessage({ id: 'open_more_options' })}
        placement="top"
      >
        <WrapperButtonIcon
          onClick={handleClick}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <LineIcon icon="ico-plus" />
        </WrapperButtonIcon>
      </Tooltip>
      {open ? (
        <ClickOutsideListener onClickAway={handleClick}>
          <Popper
            id={id}
            open={open}
            placeholder="top-end"
            anchorEl={anchorEl}
            style={{ zIndex: 1300 }}
          >
            <Paper style={{ padding: '4px 0' }}>
              {items.map((item, index) => (
                <Item key={index} role={'button'} onClick={item.onClick}>
                  {item.icon ? <LineIcon icon={item.icon} /> : null}
                  {item.label ? <span>{item.label}</span> : null}
                </Item>
              ))}
            </Paper>
          </Popper>
        </ClickOutsideListener>
      ) : null}
      <input
        data-testid="inputAttachPhoto"
        onChange={onChangeImage}
        multiple
        ref={inputRef}
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
      />
      <input
        style={{ display: 'none' }}
        type="file"
        multiple
        ref={fileUploadRef}
        onChange={fileUploadChanged}
      />
    </div>
  );
}

export default React.memo(
  AttachEmojiToStatusComposer,
  (prev, next) => prev.rid === next.rid
);
