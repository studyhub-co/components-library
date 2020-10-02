import * as t from 'io-ts';

import { QuestionIo } from '../../common/IData/question';

const HiddenFields = t.interface({
  answer: QuestionIo,
});

export const QABaseDataIo = t.interface({
  question: QuestionIo,
  answer: QuestionIo,
  hiddenFields: HiddenFields,
});

export type QABaseData = t.TypeOf<typeof QABaseDataIo>;

// import { Question } from '../../common/IData/question';
//
// export interface QABaseData {
//   question: Question;
//   answer: Question;
// }
