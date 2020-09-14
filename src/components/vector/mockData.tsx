import { VectorData } from './IData/index';

// <MenuItem value={10}>Full vector match</MenuItem>
/// <MenuItem value={20}>Magnitude only</MenuItem>
// <MenuItem value={30}>Angle only</MenuItem>

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
      text: '',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  questionTextOnly: false,
  questionVectorIsNull: false,
  hiddenFields: {
    answerVectors: [],
    answer: {
      content: {
        text: '',
        image: '',
        hint: '',
      },
      type: 'base',
    },
  },
  questionVectors: [
    // {
    //   angle: 0,
    //   xComponent: 0,
    //   yComponent: 0,
    //   magnitude: 0,
    // },
  ],
  answerVectors: [
    // {
    //   angle: 0,
    //   xComponent: 0,
    //   yComponent: 0,
    //   magnitude: 0,
    // },
  ],
  answerVectorIsNull: false,
  answerTextOnly: false,
  answerNullableVector: false,
  answerToCheck: 10,
};
