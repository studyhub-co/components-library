import { VectorData } from './IData/index';

export const mockVector: VectorData = {
  question: {
    content: {
      text: 'this is the question!',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  answer: {
    content: {
      text: 'this is the answer!',
      image: '',
      hint: 'this is the hint',
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
