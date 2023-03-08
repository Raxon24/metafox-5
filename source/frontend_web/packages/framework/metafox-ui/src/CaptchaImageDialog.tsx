/**
 * @type: dialog
 * name: captcha_image.dialog.Form
 */
import { useGlobal, useResourceAction } from '@metafox/framework';
import { ConfirmParams, TModalDialogProps } from '@metafox/dialog';
import { Dialog } from '@mui/material';
import React from 'react';
import { RemoteFormBuilder } from '@metafox/form';
interface Props extends ConfirmParams, TModalDialogProps {
  config?: Record<string, any>;
}

export default function CaptchaImageDialog({ config }: Props) {
  const { action_name, onSubmit } = config || {};
  const { useDialog } = useGlobal();
  const { setDialogValue, dialogProps } = useDialog();
  const dataSource = useResourceAction('captcha', 'captcha', 'getVerifyForm');

  const onHandleSubmit = values => {
    setDialogValue(values);
  };

  return (
    <Dialog
      {...dialogProps}
      fullScreen={false}
      data-testid="dialogCaptchaImage"
      maxWidth="xs"
      fullWidth
      aria-modal
    >
      <RemoteFormBuilder
        dataSource={dataSource}
        onSubmit={onSubmit || onHandleSubmit}
        pageParams={{
          action_name,
          auto_focus: true
        }}
        navigationConfirmWhenDirty={false}
        dialog
      />
    </Dialog>
  );
}
