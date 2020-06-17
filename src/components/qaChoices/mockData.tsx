import { QAData } from './IData/index';

export const mockQaChoices: QAData = {
  question: {
    content: {
      text: 'Enter question text',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  choices: [
    {
      content: {
        image: '',
        text: '1st choice text',
      },
      selected: true,
      type: 'base',
      uuid: 'uuid1',
      position: 0,
    },
    {
      content: {
        image: '',
        text: '2nd choice text',
      },
      selected: false,
      type: 'base',
      uuid: 'uuid2',
      position: 1,
    },
  ],
};
