import { UnitConversionData } from './IData/index';

export const mockUnitConversion: UnitConversionData = {
  question: {
    content: {
      text: 'Enter question text',
      evaluatedMathText: '',
      image: '',
      hint: '',
    },
    type: 'base',
  },
  hiddenFields: {},
  conversionSteps: [],
  questionStepNumber: null,
  questionStepUnit: null,
  answerStepNumber: null,
  answerStepUnit: null,
  conversionType: 10,
};
