import { MySQLData } from './IData/index';

export const mockMysql: MySQLData = {
  question: {
    content: {
      text: 'Enter\\  question\\  text',
      evaluatedMathText: '',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  SQLSchemaResultJson: '',
  answer: {
    expectedOutputJson: '',
    schemaIsValid: false,
    SQLQuery: '',
    SQLSchema: '',
  },
  hiddenFields: {
    answer: {
      expectedOutputJson: '',
      schemaIsValid: false,
      SQLQuery: '',
      SQLSchema: '',
    },
  },
};
