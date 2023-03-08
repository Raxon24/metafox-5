/**
 * @type: saga
 * name: captcha_image.token
 */

import { LocalAction, getGlobalContext } from '@metafox/framework';
import { put, takeLatest } from 'redux-saga/effects';

function* getImageCaptchaToken({
  payload
}: LocalAction<{ actionSuccess: string }>) {
  const { dialogBackend, i18n } = yield* getGlobalContext();
  const { actionSuccess, ...config } = payload;
  const values = yield dialogBackend.present({
    component: 'captcha_image.dialog.Form',
    props: {
      title: i18n.formatMessage({ id: 'image_captcha' }),
      config
    }
  });

  yield put({
    type: actionSuccess || 'captcha_image/token/response',
    payload: values
  });
}

export default takeLatest('captcha/image_captcha/token', getImageCaptchaToken);
