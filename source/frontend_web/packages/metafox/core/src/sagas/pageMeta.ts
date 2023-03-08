/**
 * @type: saga
 * name: core.pageMeta
 */
import {
  getGlobalContext,
  getPageMetaDataSelector,
  LOAD_PAGE_META,
  LocalAction
} from '@metafox/framework';
import { uniqMetaName } from '@metafox/utils';
import { put, select, takeLatest } from 'redux-saga/effects';

export function* loadPageMeta({
  payload: { pageMetaName: _pageMetaName, params },
  meta
}: LocalAction<
  { pageMetaName: string; params?: Record<string, any> },
  { onSuccess: (data: unknown) => void }
>) {
  try {
    const { apiClient } = yield* getGlobalContext();

    if (!_pageMetaName) return;

    const pageMetaName = uniqMetaName(_pageMetaName);

    let data = yield select(getPageMetaDataSelector, pageMetaName);

    if (!data) {
      data = yield apiClient
        .get(`seo/meta/${pageMetaName}`, { params })
        .then(x => x.data?.data);
    }

    yield put({ type: 'pageMeta/put', payload: { id: pageMetaName, data } });

    if (meta?.onSuccess) {
      meta.onSuccess(data);
    }
  } catch (err) {
    //
  }
}

const sagas = [takeLatest(LOAD_PAGE_META, loadPageMeta)];

export default sagas;
