import * as t from 'io-ts';

import { QuestionIo } from '../../common/IData/question';
import { ChoiceIo } from './choices';

export const QADataIo = t.interface({
  question: QuestionIo,
  choices: t.array(ChoiceIo),
});

export type QAData = t.TypeOf<typeof QADataIo>;

// import { Question, isQuestion } from '../../common/IData/question';
// import { Question } from '../../common/IData/question';
// import { Choice } from './choices';
//
// export interface QAData {
//   question: Question;
//   choices: Choice[];
// }

// // User-Defined Type Guards
// export function isQAData(data: any): data is QAData {
//   if ('question' in (data as QAData) && 'choices' in (data as QAData)) {
//     if (isQuestion(data['question'])) {
//       return true;
//     }
//   }
//   return false;
// }
