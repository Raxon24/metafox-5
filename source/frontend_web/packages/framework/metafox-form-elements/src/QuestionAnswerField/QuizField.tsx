/**
 * @type: formElement
 * name: form.element.QuizQuestion
 * chunkName: formElement
 */

import { FormFieldProps } from '@metafox/form';
import { useGlobal } from '@metafox/framework';
import { LineIcon } from '@metafox/ui';
import { Box, Button, styled, Typography } from '@mui/material';
import { useField } from 'formik';
import produce from 'immer';
import { get, isString } from 'lodash';
import React from 'react';
import ErrorMessage from '../ErrorMessage';
import QuizItem from './QuizQuestionItem';
import useStyles from './styles';
import { QuestionItemProps } from './types';

const ButtonIcon = styled(Button)(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(13),
  minWidth: theme.spacing(6.25),
  '& .ico.ico-plus-circle-o': {
    marginRight: theme.spacing(0.75),
    fontSize: theme.mixins.pxToRem(15)
  }
}));

const WrapperError = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1, 0)
}));

const QuizQuestion = ({
  config,
  formik,
  name,
  disabled: forceDisabled
}: FormFieldProps) => {
  const { i18n, dialogBackend } = useGlobal();
  const {
    minQuestions,
    maxQuestions,
    minAnswers,
    maxAnswers,
    disabled,
    defaultAnswers,
    maxLength
  } = config;
  const [{ value }, meta, { setValue }] = useField(name ?? 'QuizQuestion');
  const [questions, setQuestions] = React.useState<QuestionItemProps[]>(
    value || []
  );

  const keyQuestion = React.useRef(value?.length || 0);
  const keyAnswer = React.useRef(
    questions.map(item => item.answers[item.answers.length - 1].ordering) || []
  );

  const classes = useStyles();

  const handleChangeQuestion = (e, index: number) => {
    const { value } = e.target;

    setQuestions(prev =>
      produce(prev, draft => {
        draft[index].question = value ? value.trim() : '';
      })
    );
  };

  const handleChangeAnswer = (e, questionIndex: number, index: number) => {
    const { value } = e.target;

    setQuestions(prev =>
      produce(prev, draft => {
        draft[questionIndex].answers[index].answer = value ? value.trim() : '';
      })
    );
  };

  const addMoreAnswer = index => {
    if (maxAnswers > 0 && questions[index].answers.length >= maxAnswers) {
      dialogBackend.alert({
        message: i18n.formatMessage(
          { id: 'you_must_have_max_answer' },
          { value: maxAnswers }
        )
      });

      return;
    }

    keyAnswer.current = keyAnswer.current.map((item, idx) => {
      if (idx === index) {
        return ++item;
      }

      return item;
    });

    setQuestions(prev =>
      produce(prev, draft => {
        const questionItem = {
          answer: '',
          ordering: keyAnswer.current[index]
        };
        draft[index].answers.push(questionItem);
      })
    );
  };

  const handleDeleteAnswer = (
    indexQuestion: number,
    orderingAnswer: number
  ) => {
    const answers = questions[indexQuestion].answers;

    if (!answers) return;

    if (answers.length <= Math.max(minAnswers, 1)) {
      dialogBackend.alert({
        message: i18n.formatMessage(
          { id: 'you_must_have_min_answer' },
          { value: minAnswers }
        )
      });

      return;
    }

    setQuestions(prev =>
      produce(prev, draft => {
        if (orderingAnswer) {
          const itemIndex = draft[indexQuestion].answers.findIndex(
            item => item.ordering === orderingAnswer
          );

          if (itemIndex === -1) return;

          const answer = draft[indexQuestion].answers[itemIndex];

          draft[indexQuestion].answers.splice(itemIndex, 1);

          if (answer.is_correct) {
            draft[indexQuestion].answers[0].is_correct = 1;
          }
        } else {
          const answer = draft[indexQuestion].answers[answers.length - 1];

          if (answer.is_correct) {
            draft[indexQuestion].answers[0].is_correct = 1;
          }

          draft[indexQuestion].answers.pop();
        }
      })
    );
  };

  const addMoreQuestion = () => {
    if (maxQuestions > 0 && questions.length >= maxQuestions) {
      dialogBackend.alert({
        message: i18n.formatMessage(
          { id: 'you_must_have_max_question' },
          { value: maxQuestions }
        )
      });

      return;
    }

    const answers = [];
    let i = 2;
    while (answers.length < (defaultAnswers || minAnswers)) {
      if (answers.length === 0) {
        answers.push({ answer: '', is_correct: 1, ordering: 1 });
      }

      answers.push({ answer: '', is_correct: 0, ordering: i });
      ++i;
    }

    setQuestions(prev =>
      produce(prev, draft => {
        const questionItem: QuestionItemProps = {
          answers,
          question: '',
          ordering: ++keyQuestion.current
        };
        draft.push(questionItem);
      })
    );
  };

  const handleDeleteQuestion = (ordering: number) => {
    if (questions.length <= Math.max(minQuestions, 1)) {
      dialogBackend.alert({
        message: i18n.formatMessage(
          { id: 'you_must_have_min_question' },
          { value: minQuestions }
        )
      });

      return;
    }

    setQuestions(prev =>
      produce(prev, draft => {
        if (ordering) {
          const itemIndex = draft.findIndex(item => item.ordering === ordering);
          draft.splice(itemIndex, 1);
        } else {
          draft.pop();
        }
      })
    );
  };

  const handleChangeCorrectAnswer = (
    e,
    questionIndex: number,
    answerIndex: number
  ) => {
    setQuestions(prev =>
      produce(prev, draft => {
        draft[questionIndex].answers.forEach((item, index) => {
          if (index === answerIndex) item.is_correct = 1;
          else item.is_correct = 0;
        });
      })
    );
  };

  React.useEffect(() => {
    if (questions.length < minQuestions) addMoreQuestion();
    else {
      setValue(questions);

      // update number question
      const mapValueAnswer = questions.map(
        item => item.answers[item.answers.length - 1].ordering
      );
      keyAnswer.current = mapValueAnswer;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const haveError = Boolean(meta.error && (meta.touched || formik.submitCount));
  const isErrorGeneral = haveError && isString(get(meta.error, '[0]'));

  return (
    <div className={classes.question}>
      {questions?.map((item, index) => (
        <QuizItem
          index={index}
          key={item.ordering}
          maxLength={maxLength}
          name={name}
          item={item}
          formik={formik}
          disabled={disabled || forceDisabled || formik.isSubmitting}
          submitCount={formik.submitCount}
          lastElement={index === questions.length - 1}
          handleChangeQuestion={handleChangeQuestion}
          handleChangeAnswer={handleChangeAnswer}
          addMoreQuestion={addMoreQuestion}
          handleDeleteQuestion={() => handleDeleteQuestion(item.ordering)}
          addMoreAnswer={() => addMoreAnswer(index)}
          handleDeleteAnswer={orderingAnswer => {
            handleDeleteAnswer(index, orderingAnswer);
          }}
          error={get(meta.error, `[${index}]`)}
          handleChangeCorrectAnswer={handleChangeCorrectAnswer}
        />
      ))}
      {isErrorGeneral && (
        <WrapperError>
          <ErrorMessage error={meta.error} />
        </WrapperError>
      )}
      <div>
        <ButtonIcon
          className={classes.button}
          variant="outlined"
          color="primary"
          disabled={disabled}
          onClick={addMoreQuestion}
        >
          <LineIcon icon="ico-plus-circle-o" />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {i18n.formatMessage({ id: 'add_question' })}
          </Typography>
        </ButtonIcon>
      </div>
    </div>
  );
};

export default QuizQuestion;
