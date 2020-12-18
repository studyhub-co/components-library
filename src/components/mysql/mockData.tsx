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
    expectedOutput: '',
    expectedOutputJson: '',
    SQLQuery: '',
    SQLSchema: '',
    hiddenFields: {
      expectedOutput: '',
      expectedOutputJson: '',
      SQLQuery: '',
    },
  },
};
