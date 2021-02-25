import produce from 'immer';
import { VectorData } from './IData/index';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: VectorData | null };

export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  return produce(state, (draft: { reducerData: VectorData }) => {
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
    if (action.type === 'QUESTION_TEXT_ONLY') {
      draft.reducerData.questionTextOnly = action.payload;
    }
    if (action.type === 'QUESTION_VECTOR_IS_NULL') {
      draft.reducerData.questionVectorIsNull = action.payload;
    }
    if (action.type === 'QUESTION_IMAGE_CHANGE') {
      draft.reducerData.question.content.image = action.payload.image;
    }
    if (action.type === 'QUESTION_HINT_CHANGE') {
      draft.reducerData.question.content.hint = action.payload;
    }
    if (action.type === 'QUESTION_TEXT_CHANGE') {
      draft.reducerData.question.content.text = action.payload;
    }
    if (action.type === 'QUESTION_VECTOR_ADD') {
      draft.reducerData.questionVectors.push(action.payload);
    }
    if (action.type === 'QUESTION_SET_VECTORS') {
      draft.reducerData.questionVectors = action.payload;
    }
    if (action.type === 'ANSWER_IMAGE_CHANGE') {
      draft.reducerData.answer.content.image = action.payload;
    }
    if (action.type === 'ANSWER_TEXT_CHANGE') {
      draft.reducerData.answer.content.text = action.payload;
    }
    if (action.type === 'ANSWER_VECTOR_IS_NULL') {
      draft.reducerData.answerVectorIsNull = action.payload;
    }
    if (action.type === 'ANSWER_TEXT_ONLY') {
      draft.reducerData.answerTextOnly = action.payload;
    }
    if (action.type === 'ANSWER_NULLABLE_VECTOR') {
      draft.reducerData.answerNullableVector = action.payload;
    }
    if (action.type === 'ANSWER_TO_CHECK') {
      draft.reducerData.answerToCheck = action.payload;
    }
    if (action.type === 'ANSWER_VECTOR_ADD') {
      draft.reducerData.answerVectors.push(action.payload);
    }
    if (action.type === 'ANSWER_SET_VECTORS') {
      draft.reducerData.answerVectors = action.payload;
    }
  });
};
