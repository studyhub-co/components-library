import produce from 'immer';
import { QABaseData } from './IData/index';
// import { uploadImage } from '../../utils/serviceRequests';

import { convertMQToEvaluatedMath } from '../../utils/index';

// // this will add evaluatex to window
// import 'evaluatex/dist/evaluatex.min.js';
//
// declare global {
//   interface Window {
//     evaluatex: any;
//   }
// }

// import { ReducerObject as IReducerObject, ComponentsData as IComponentsData } from '../hooks/IData';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: QABaseData | null };

// TODO add action typings
export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  return produce(state, (draft: { reducerData: QABaseData }) => {
    if (action.type === 'QUESTION_TEXT_CHANGE') {
      const text = action.payload;
      draft.reducerData.question.content.text = text;
      // FIXME not sure that we need evaluatedMathText for question, no need to compare with user answer
      // draft.reducerData.question.content.evaluatedMathText = convertMQToEvaluatedMath(text);
      // try {
      //   draft.reducerData.question.content.evaluatedMathText = '' + window.evaluatex(text)();
      // } catch (e) {
      //   draft.reducerData.question.content.evaluatedMathText = text;
      // }
    }
    if (action.type === 'QUESTION_HINT_CHANGE') {
      const text = action.payload;
      draft.reducerData.question.content.hint = text;
    }
    if (action.type === 'QUESTION_IMAGE_CHANGE') {
      draft.reducerData.question.content.image = action.payload.image;
    }
    if (action.type === 'ANSWER_TEXT_CHANGE') {
      const text = action.payload;

      draft.reducerData.answer.content.text = text;
      draft.reducerData.answer.content.evaluatedMathText = convertMQToEvaluatedMath(text);

      // const parsedToValUnit = parseToValueUnit(replaceLatexFormulas(text));
      // // if parseToValueUnit is null then text have no units
      // if (parsedToValUnit) {
      //   text = parsedToValUnit[0];
      // }
      // try {
      //   let evaluatedMathText = `${window.evaluatex(text)()}`;
      //   if (parsedToValUnit) {
      //     // value + unit
      //     evaluatedMathText = `${evaluatedMathText}${parsedToValUnit[1]}`;
      //   }
      //   console.log(evaluatedMathText);
      //   draft.reducerData.answer.content.evaluatedMathText = evaluatedMathText;
      // } catch (e) {
      //   // direct user's typed text if fault
      //   draft.reducerData.answer.content.evaluatedMathText = text;
      //   // console.log(e);
      // }
    }
    if (action.type === 'ANSWER_IMAGE_CHANGE') {
      draft.reducerData.answer.content.image = action.payload;
    }
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
  });
};
