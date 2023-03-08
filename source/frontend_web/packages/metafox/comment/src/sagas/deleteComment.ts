/**
 * @type: saga
 * name: comment.saga.deleteComment
 */

import {
  deleteEntity,
  getGlobalContext,
  getItem,
  getItemActionConfig,
  handleActionConfirm,
  handleActionError,
  handleActionFeedback,
  ItemLocalAction,
  patchEntity
} from '@metafox/framework';
import { takeEvery } from 'redux-saga/effects';

function* updateParentComment(identity: string, child_total: number) {}

function* deleteComment(action: ItemLocalAction) {
  const { identity } = action.payload;
  const item = yield* getItem(identity);

  if (!item) return;

  const { apiClient, compactUrl } = yield* getGlobalContext();

  const config = yield* getItemActionConfig(item, 'deleteItem');

  if (!config.apiUrl) return;

  const ok = yield* handleActionConfirm(config);

  if (!ok) return;

  try {
    yield* deleteEntity(identity);
    const response = yield apiClient.request({
      method: config.apiMethod,
      url: compactUrl(config.apiUrl, item)
    });

    yield* handleActionFeedback(response);

    const data = response.data.data;

    if (data.parent_id) {
      yield* updateParentComment(
        `comment.entities.comment.${data.parent_id}`,
        data.child_total
      );
    } else {
      const feedIdentity = data.feed_id
        ? `feed.entities.feed.${data.feed_id}`
        : `${data.item_module_id}.entities.${data.item_type}.${data.item_id}`;

      const feedItem = yield* getItem(feedIdentity);

      if (!feedItem) return;

      const { statistic } = data;
      const { related_comments, statistic: currentStatistic } = feedItem;

      const newRelatedComment = related_comments.filter(i => i !== identity);
      const newStatistic = { ...currentStatistic, ...statistic };

      yield* patchEntity(feedIdentity, {
        related_comments: newRelatedComment,
        statistic: newStatistic
      });
    }
  } catch (error) {
    yield* handleActionError(error);
  }
}

const sagas = [takeEvery('deleteComment', deleteComment)];

export default sagas;
