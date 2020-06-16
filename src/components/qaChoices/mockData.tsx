import { QAData } from './IData/index';

export const mockQaChoices: QAData = {
  question: {
    content: {
      text: 'this is the question!',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  choices: [
    {
      content: {
        image: '',
        text: 'this is the 1st choice',
      },
      type: 'base',
      uuid: 'uuid1',
      position: 0,
    },
    {
      content: {
        image: '',
        text: 'this is the 2nd choice',
      },
      type: 'base',
      uuid: 'uuid2',
      position: 1,
    },
  ],
};
