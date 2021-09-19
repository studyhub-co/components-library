import * as t from 'io-ts';

import { QuestionIo } from '../../common/IData/question';
import { VectorIo } from './vector';

const HiddenFields = t.interface({
  answerVectors: t.array(VectorIo),
  answer: QuestionIo,
  answerVectorIsNull: t.boolean,
});

export const VectorDataIo = t.interface({
  question: QuestionIo,
  questionVectors: t.array(VectorIo),
  questionTextOnly: t.boolean,
  questionVectorIsNull: t.boolean,
  answer: QuestionIo,
  hiddenFields: HiddenFields,
  answerVectors: t.array(VectorIo),
  answerVectorIsNull: t.boolean,
  answerTextOnly: t.boolean,
  answerNullableVector: t.boolean,
  answerToCheck: t.number,
});

export type VectorData = t.TypeOf<typeof VectorDataIo>;
