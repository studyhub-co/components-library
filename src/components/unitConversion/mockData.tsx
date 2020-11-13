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
  conversionSteps: [{ denominator: '', numerator: '' }],
  questionStepNumber: null,
  questionStepUnit: '',
  answerStepNumber: null,
  answerStepUnit: '',
  conversionType: 10,
};
