/**
 * @type: saga
 * name: quiz.saga.submitQuiz
 */

import {
  getGlobalContext,
  handleActionError,
  handleActionFeedback,
  patchEntity,
  fulfillEntity
} from '@metafox/framework';
import { takeEvery } from 'redux-saga/effects';

type SubmitQuizAction = {
  type: string;
  payload: {
    quiz_id: string;
    answers: Record<string, number>;
    result: string;
  };
  meta?: {
    onSuccess: () => void;
  };
};

function* submitQuiz(action: SubmitQuizAction) {
  const {
    payload: { quiz_id, answers }
  } = action;
  const { apiClient, normalization } = yield* getGlobalContext();

  try {
    const response = yield apiClient.request({
      method: 'post',
      url: '/quiz-result',
      data: {
        quiz_id,
        answers
      }
    });
    const { results, statistic } = response?.data?.data;

    const normalizedResult = normalization.normalize(results);

    yield* patchEntity(`quiz.entities.quiz.${quiz_id}`, {
      statistic,
      results: `quiz.entities.quiz_result.${results.id}`
    });
    yield* fulfillEntity(normalizedResult.data);

    yield* handleActionFeedback(response);
  } catch (error) {
    yield* handleActionError(error);
  }
}

const sagas = [takeEvery('submitQuiz', submitQuiz)];

export default sagas;
