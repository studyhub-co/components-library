import produce from 'immer';
import { UnitConversionData } from './IData/index';

// import { ReducerObject as IReducerObject, ComponentsData as IComponentsData } from '../hooks/IData';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: UnitConversionData | null };

// TODO add action typings
export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  return produce(state, (draft: { reducerData: UnitConversionData }) => {
    if (action.type === 'QUESTION_TEXT_CHANGE') {
      const text = action.payload;
      draft.reducerData.question.content.text = text;
    }
    if (action.type === 'QUESTION_HINT_CHANGE') {
      const text = action.payload;
      draft.reducerData.question.content.hint = text;
    }
    if (action.type === 'QUESTION_IMAGE_CHANGE') {
      draft.reducerData.question.content.image = action.payload;
    }
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
  });
};
