import { QABaseData } from '../src/components/qaBase/IData/index';
import { QAData } from '../src/components/qaChoices/IData/index';
import { VectorData } from '../src/components/vector/IData/index';
import { Material } from '../src/models/';

export const mockQaBaseMaterial: Material = {
  uuid: 'materialUuid',
  data: {
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
        // hint: 'this is the hint',
      },
      type: 'base',
    },
  } as QABaseData,
};

export const mockQaChoicesMaterial: Material = {
  uuid: 'materialUuid',
  data: {
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
  } as QAData,
};

export const mockVectorMaterial: Material = {
  uuid: 'materialUuid',
  data: {
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
        // hint: 'this is the hint',
      },
      type: 'base',
    },
    questionTextOnly: false,
    questionVector: {
      angle: 0,
      xComponent: 0,
      yComponent: 0,
    },
  } as VectorData,
};
