import { QAData } from './IData/index';
import { uuidV4 } from '../../utils/index';

export const mockQaChoices: QAData = {
  question: {
    content: {
      text: 'Enter question text',
      // text: '\\text{Enter question text}', // mathquill version
      evaluatedMathText: '',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  choices: [
    {
      content: {
        image: '',
        text: '1st\\ choice',
      },
      selected: true,
      hiddenFields: { selected: false },
      type: 'base',
      uuid: uuidV4(),
      position: 0,
      reactionResult: 'none',
    },
    {
      content: {
        image: '',
        text: '2nd\\ choice',
      },
      selected: false,
      hiddenFields: { selected: false },
      type: 'base',
      uuid: uuidV4(),
      position: 1,
      reactionResult: 'none',
    },
  ],
  multiSelectMode: false,
};
