// this will add evaluatex to window / TODO check that is not readded
import 'evaluatex/dist/evaluatex.min.js';

import { parseToValueUnit, replaceLatexFormulas } from '../components/unitConversion/components/useUnitConversionBase';

declare global {
  interface Window {
    evaluatex: any;
  }
}

export function uuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * convert Mathquill Latex text to evaluated math value + unit (if exist), return the input text if parse error
 * @param text: string from MathQuill latex
 */
export function convertMQToEvaluatedMath(text: string) {
  const parsedToValUnit = parseToValueUnit(replaceLatexFormulas(text));
  // if parseToValueUnit is null then text have no units
  let newText = text.slice();
  if (parsedToValUnit) {
    newText = parsedToValUnit[0];
  }
  try {
    let evaluatedMathText = `${window.evaluatex(newText)()}`;
    if (parsedToValUnit) {
      // value + unit
      evaluatedMathText = `${evaluatedMathText}${parsedToValUnit[1]}`;
    }
    // console.log(evaluatedMathText);
    // draft.reducerData.answer.content.evaluatedMathText = evaluatedMathText;
    return evaluatedMathText;
  } catch (e) {
    // direct user's typed text if fault
    return text;
    // draft.reducerData.answer.content.evaluatedMathText = text;
  }
}
