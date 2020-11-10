import * as t from 'io-ts';

import { QuestionIo } from '../../common/IData/question';

const HiddenFields = t.interface({
  // answer: QuestionIo,
});

const ConversionSteps = t.interface({
  numerator: t.string,
  denominator: t.string,
});

export const UnitConversionDataIo = t.interface({
  question: QuestionIo,
  // answer: QuestionIo,
  hiddenFields: HiddenFields,
  conversionSteps: t.array(ConversionSteps),
  questionStepNumber: t.union([t.number, t.null]),
  questionStepUnit: t.union([t.string, t.null]),
  answerStepNumber: t.union([t.number, t.null]),
  answerStepUnit: t.union([t.string, t.null]),
  conversionType: t.number,
});

export type UnitConversionData = t.TypeOf<typeof UnitConversionDataIo>;

// import { Question } from '../../common/IData/question';
//
// export interface QABaseData {
//   question: Question;
//   answer: Question;
// }
