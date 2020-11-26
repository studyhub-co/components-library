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
  conversionSteps: [{ denominator: '', numerator: '', numeratorSI: '', denominatorSI: '' }],
  questionStepNumber: null,
  questionStepUnit: '',
  questionStepSI: '',
  answerStepNumber: null,
  answerStepUnit: '',
  answerStepSI: '',
  conversionType: 10,
};
