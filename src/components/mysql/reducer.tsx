import produce from 'immer';
import { MySQLData } from './IData/index';

// this will add evaluatex to window
import 'evaluatex/dist/evaluatex.min.js';

declare global {
  interface Window {
    evaluatex: any;
  }
}

// import { ReducerObject as IReducerObject, ComponentsData as IComponentsData } from '../hooks/IData';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: MySQLData | null };

// TODO add action typings
export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  return produce(state, (draft: { reducerData: MySQLData }) => {
    if (action.type === 'QUESTION_TEXT_CHANGE') {
      const text = action.payload;
      draft.reducerData.question.content.text = text;
      try {
        draft.reducerData.question.content.evaluatedMathText = '' + window.evaluatex(text)();
      } catch (e) {
        draft.reducerData.question.content.evaluatedMathText = '';
      }
    }
    if (action.type === 'QUESTION_HINT_CHANGE') {
      const text = action.payload;
      draft.reducerData.question.content.hint = text;
    }
    if (action.type === 'QUESTION_IMAGE_CHANGE') {
      draft.reducerData.question.content.image = action.payload.image;
    }
    if (action.type === 'MYSQL_DATA_CHANGE') {
      draft.reducerData.answer.SQLSchema = action.payload.SQLSchema;
      draft.reducerData.answer.SQLQuery = action.payload.SQLQuery;
      draft.reducerData.answer.expectedOutput = action.payload.expectedOutput;
      draft.reducerData.SQLSchemaResultJson = action.payload.SQLSchemaResultJson;
    }
    if (action.type === 'STUDENT_MYSQL_DATA_CHANGE') {
      draft.reducerData.answer.expectedOutputJson = action.payload.expectedOutputJson;
      draft.reducerData.answer.SQLQuery = action.payload.SQLQuery;
      draft.reducerData.answer.expectedOutput = action.payload.expectedOutput;
    }
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
  });
};
