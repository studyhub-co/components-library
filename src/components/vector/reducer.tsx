import produce from 'immer';
import { VectorData } from './IData/index';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: VectorData | null };

// TODO add action typings
export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  return produce(state, (draft: { reducerData: VectorData }) => {
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
    if (action.type === 'QUESTION_TEXT_ONLY') {
      draft.reducerData.questionTextOnly = action.payload;
    }
  });
};
