import * as t from 'io-ts';

import { QuestionIo } from '../../common/IData/question';

const HiddenFields = t.interface({
  SQLQuery: t.string,
  expectedOutputJson: t.string,
  expectedOutput: t.string,
});

const MySQLAnswerIo = t.interface({
  SQLQuery: t.string,
  SQLSchema: t.string,
  // schemaIsValid: t.boolean,
  expectedOutputJson: t.string, // TODO not sure we need to save this
  expectedOutput: t.string,
  hiddenFields: HiddenFields,
});

// const HiddenFields = t.interface({
//   answer: MySQLAnswerIoHidden,
// });

export const MySQLDataIo = t.interface({
  question: QuestionIo,
  answer: MySQLAnswerIo,
  // hiddenFields: HiddenFields,
  SQLSchemaResultJson: t.string, // valid result for SQLSchema from service API request
});

export type MySQLData = t.TypeOf<typeof MySQLDataIo>;
