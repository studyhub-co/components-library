import * as t from 'io-ts';

import { QuestionIo } from '../../common/IData/question';

const HiddenFields = t.interface({
  // answer: QuestionIo,
});

export const UnitConversionDataIo = t.interface({
  question: QuestionIo,
  // answer: QuestionIo,
  hiddenFields: HiddenFields,
});

export type UnitConversionData = t.TypeOf<typeof UnitConversionDataIo>;

// import { Question } from '../../common/IData/question';
//
// export interface QABaseData {
//   question: Question;
//   answer: Question;
// }
