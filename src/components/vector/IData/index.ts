import * as t from 'io-ts';

import { QuestionIo } from '../../common/IData/question';
import { VectorIo } from './vector';

export const VectorIo = t.interface({
  question: QuestionIo,
  questionVector: VectorIo,
  questionTextOnly: t.boolean,
  answer: QuestionIo,
});

export type Vector = t.TypeOf<typeof VectorIo>;

// import { Question } from '../../common/IData/question';
// import { Vector } from './vector';
//
// export interface VectorData {
//   question: Question;
//   questionVector: Vector;
//   questionTextOnly: boolean;
//   answer: Question;
// }
