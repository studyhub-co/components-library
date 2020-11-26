import produce from 'immer';
import { UnitConversionData } from './IData/index';

// this will add evaluatex to window
import 'evaluatex/dist/evaluatex.min.js';

declare global {
  interface Window {
    evaluatex: any;
  }
}

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
    if (action.type === 'UNIT_CONVERSION_TYPE_CHANGE') {
      draft.reducerData.conversionType = action.payload;
    }
    if (action.type === 'UNIT_CONVERSION_QUESTION_STEP_CHANGE') {
      draft.reducerData.questionStepNumber = action.payload.val;
      draft.reducerData.questionStepUnit = action.payload._unit;
      // console.log(action.payload.val.toString());
      try {
        draft.reducerData.questionStepSI = window
          .evaluatex(action.payload.val)()
          .toString();
      } catch (e) {
        draft.reducerData.questionStepSI = '';
      }
    }
    if (action.type === 'UNIT_CONVERSION_STEPS_CHANGE') {
      draft.reducerData.conversionSteps = action.payload.steps;
    }
    if (action.type === 'UNIT_CONVERSION_ANSWER_STEP_CHANGE') {
      draft.reducerData.answerStepNumber = action.payload.val;
      draft.reducerData.answerStepUnit = action.payload._unit;
      try {
        draft.reducerData.answerStepUnit = window
          .evaluatex(action.payload.val)()
          .toString();
      } catch (e) {
        draft.reducerData.answerStepUnit = '';
      }
    }
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
  });
};
