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
  answer: {
    expectedOutput: '',
    schemaIsValid: false,
    SQLQuery: '',
    SQLSchema: '',
  },
  hiddenFields: {
    answer: {
      expectedOutput: '',
      schemaIsValid: false,
      SQLQuery: '',
      SQLSchema: '',
    },
  },
};
