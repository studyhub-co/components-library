import produce from 'immer';
import { QABaseData } from './IData/index';

// import { ReducerObject as IReducerObject, ComponentsData as IComponentsData } from '../hooks/IData';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: QABaseData | null };

// TODO add action typings
export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  return produce(state, (draft: { reducerData: QABaseData }) => {
    if (action.type === 'QUESTION_TEXT_CHANGE') {
      const text = action.payload;
      draft.reducerData.question.content.text = text;
    }
    if (action.type === 'QUESTION_HINT_CHANGE') {
      const text = action.payload;
      draft.reducerData.answer.content.hint = text;
    }
    if (action.type === 'ANSWER_TEXT_CHANGE') {
      const text = action.payload;
      draft.reducerData.answer.content.text = text;
    }
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
  });
};
