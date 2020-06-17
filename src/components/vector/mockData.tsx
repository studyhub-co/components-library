import { VectorData } from './IData/index';

export const mockVector: VectorData = {
  question: {
    content: {
      text: 'Enter question text',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  answer: {
    content: {
      text: 'Enter answer text',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  questionTextOnly: false,
  questionVector: {
    angle: 0,
    xComponent: 0,
    yComponent: 0,
  },
};
