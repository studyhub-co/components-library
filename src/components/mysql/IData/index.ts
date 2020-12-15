import * as t from 'io-ts';

import { QuestionIo } from '../../common/IData/question';

const MySQLAnswerIo = t.interface({
  SQLQuery: t.string,
  SQLSchema: t.string,
  schemaIsValid: t.boolean,
  expectedOutputJson: t.string,
});

const HiddenFields = t.interface({
  answer: MySQLAnswerIo,
});

export const MySQLDataIo = t.interface({
  question: QuestionIo,
  answer: MySQLAnswerIo,
  hiddenFields: HiddenFields,
  SQLSchemaResultJson: t.string, // valid result for SQLSchema from service API request
});

export type MySQLData = t.TypeOf<typeof MySQLDataIo>;
