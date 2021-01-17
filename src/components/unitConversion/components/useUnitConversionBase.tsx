// based on base.jsx
import { useEffect, useState } from 'react';
// React docs:
// If you want to reuse non-UI functionality between components, we suggest extracting it into a separate JavaScript
// module.
// The components may import it and use that function, object, or a class, without extending it.
// Don't use inheritance.

import Qty from 'js-quantities';

// this will add jQuery to window
import './mathquill-loader';
// this will add MathQuill to window
// import * as MathQuill from '@edtr-io/mathquill/build/mathquill.js';
import * as MathQuill from '@edtr-io/mathquill';
// this will add evaluatex to window
import 'evaluatex/dist/evaluatex.min.js';

declare global {
  interface Window {
    MathQuill: any;
  }
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IUNITS {
  [key: string]: { [key: string]: string };
}

export const UNITS: IUNITS = {
  DISTANCE: {
    mm: 'millimeters',
    cm: 'centimeters',
    km: 'kilometers',
    ft: 'feet',
    mi: 'miles',
  },
  TIME: {
    ms: 'milliseconds',
    min: 'minutes',
    hr: 'hours',
    d: 'days',
    wk: 'weeks',
  },
  MASS: {
    mg: 'milligrams',
    g: 'grams',
    oz: 'ounces',
  },
};

UNITS['SPEED'] = (() => {
  const distanceO: { [key: string]: string } = { m: 'meters', ...UNITS.DISTANCE };
  const timeO: { [key: string]: string } = { s: 'seconds', ...UNITS.TIME };

  const speedO: { [key: string]: string } = {};
  Object.keys(distanceO).forEach(function(keyDist) {
    Object.keys(timeO).forEach(function(keyTime) {
      if (!(keyDist === 'm' && keyTime === 's')) {
        // exclude SI unit
        speedO[keyDist + '/' + keyTime] = distanceO[keyDist] + '/' + timeO[keyTime];
      }
    });
  });

  return speedO;
})();

export const getInputUnits = () => {
  let INPUT_UNITS = ['s', 'm', 'kg', 'm/s'];
  Object.getOwnPropertyNames(UNITS)
    .map(key => [key, Object.getOwnPropertyDescriptor(UNITS, key)])
    .filter(([key, descriptor]) => descriptor && typeof descriptor !== 'string' && descriptor.enumerable === true)
    .map(([key]) => key as string)
    .forEach(function(key: string) {
      INPUT_UNITS = INPUT_UNITS.concat(Object.keys(UNITS[key]));
    });
  return INPUT_UNITS;
};

const INPUT_UNITS = getInputUnits();

// export class UnitConversionBase extends React.Component {
// //   constructor(props) {
// //     super(props);
// //
// //     let numColumns = 1;
// //     if (this.props.level === 5) {
// //       numColumns = 0;
// //     }
// //
// //     this.onMathQuillChange = this.onMathQuillChange.bind(this);
// //     this.onResultChange = this.onResultChange.bind(this);
// //     this.onQuestionValueChange = this.onQuestionValueChange.bind(this);
// //     this.resetStrikeAnswers = this.resetStrikeAnswers.bind(this);
// //     this.reDrawStrikes = this.reDrawStrikes.bind(this);
// //
// //     this.addColumn = this.addColumn.bind(this);
// //     this.removeColumn = this.removeColumn.bind(this);
// //
// //     this.state = {
// //       numColumns: numColumns,
// //       strikethroughD: false,
// //       strikethroughN: false,
// //     };
// //   }

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IUseUnitConversionProps {
  level: number;
  unit: string;
}

export function useUnitConversionBase(props: IUseUnitConversionProps) {
  const {
    // direct props
    level,
    unit,
  } = props;

  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface IAnswer {
    data: string;
    box: any;
    splitData?: any;
  }

  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface ISetLatexWoFireEvent {
    (box: any, text: string): void;
  }

  // why we need numColumns state if we can calculate it from answersSteps ?
  const [numColumns, setNumColumns] = useState(level === 5 ? 0 : 1);
  const [strikethroughN, setStrikethroughN] = useState(false);
  const [strikethroughD, setStrikethroughD] = useState(false);
  const [answersSteps, setAnswersSteps] = useState<Array<[IAnswer, IAnswer]>>([]);
  const [uncrossedUnits, setUncrossedUnits] = useState({ nums: [], denoms: [] });
  const [answer, setAnswer] = useState<IAnswer>({ data: '', box: {} });

  const MQ = window.MathQuill.getInterface(2);

  const addColumn = () => {
    const newNumColumns = numColumns + 1;

    setNumColumns(newNumColumns);
    setAnswersSteps([
      ...answersSteps,
      [
        { data: '', box: MQ(document.getElementById('1' + newNumColumns)) },
        { data: '', box: MQ(document.getElementById('2' + newNumColumns)) },
      ],
    ]);

    // const MQ = window.MathQuill.getInterface(2);
    // const newNumColumns = numColumns + 1;
    // this.setState(
    //   {
    //     numColumns: newColumns,
    //   },
    //   function() {
    //     // need wait mount mathquill span!
    //     this.setState({
    //       answersSteps: [
    //         ...this.state.answersSteps,
    //         [
    //           { data: '', box: MQ(document.getElementById('1' + newNumColumns)) },
    //           { data: '', box: MQ(document.getElementById('2' + newNumColumns)) },
    //         ],
    //       ],
    //     });
    //   },
    // );
  };

  const removeColumn = () => {
    const newNumColumns = numColumns - 1;
    setNumColumns(newNumColumns);
    setAnswersSteps(answersSteps.slice(0, -1));

    // this.setState(
    //   {
    //     numColumns: this.state.numColumns - 1,
    //     answersSteps: this.state.answersSteps.slice(0, -1),
    //   },
    //   function() {
    //     this.reDrawStrikes();
    //   },
    // );
  };

  const setLatexWoFireEvent = (box: any, text: string) => {
    box.data.fromJsCall = true;
    box.latex(text);
    box.data.fromJsCall = false;
  };

  const reset = () => {
    // const MQ = window.MathQuill.getInterface(2);

    const resetBox = function(id: string, setLatexWoFireEvent: ISetLatexWoFireEvent) {
      const span = document.getElementById(id);
      if (!span) return;
      const mq = MQ(span);
      setLatexWoFireEvent(mq, '');
      span.classList.remove('red-border', 'green-border');
    };

    // const setLatexWoFireEvent = this.setLatexWoFireEvent;
    const ids = ['11', '21', '15'];
    ids.forEach(function(item, i, arr) {
      resetBox(item, setLatexWoFireEvent);
    });

    setNumColumns(1);
    // first column set by default
    setAnswersSteps([
      [
        { data: '', box: MQ(document.getElementById('11')) },
        { data: '', box: MQ(document.getElementById('12')) },
      ],
    ]);
    setStrikethroughD(false);
    setStrikethroughN(false);

    // this.setState({
    //   numColumns: 1,
    //   strikethroughD: false,
    //   strikethroughN: false,
    //   answersSteps: [
    //     [
    //       { data: '', box: MQ(document.getElementById('11')) },
    //       { data: '', box: MQ(document.getElementById('12')) },
    //     ],
    //   ], // first column set by default
    // });
  };

  const reDrawStrikes = () => {
    const answers = resetStrikeAnswers();
    const uncrossedUnits: any = { nums: [], denoms: [] };

    // fill uncrossedUnits
    let splitNumerator, splitDenominator;
    for (let col = 0; col < answers.length; col++) {
      splitNumerator = answers[col][0]['splitData'];
      if (splitNumerator && splitNumerator[1]) {
        uncrossedUnits['nums'].push(splitNumerator[1]);
      }
      splitDenominator = answers[col][1]['splitData'];
      if (splitDenominator && splitDenominator[1]) {
        uncrossedUnits['denoms'].push(splitDenominator[1]);
      }
    }

    const alreadyStrikeDenomIndex = [];

    // strikethrough units
    numeratorsC: for (let column = -1; column < answers.length; column++) {
      // walk through numerators
      if (column === -1) {
        if (unit) {
          splitNumerator = ['', unit.split('/')[0]]; // main unit
        }
      } else {
        splitNumerator = answers[column][0]['splitData'];
      } // "2 cm"

      if (splitNumerator) {
        for (let column2 = -1; column2 < answers.length; column2++) {
          // walk through denominators
          if (column2 === -1) {
            if (unit.split('/')[1]) {
              splitDenominator = ['', unit.split('/')[1]]; // km/hr
            } else {
              splitDenominator = null;
            }
          } else {
            splitDenominator = answers[column2][1]['splitData'];
          }
          if (splitDenominator) {
            // numeratorBoxes boxes
            if (splitNumerator[1] === splitDenominator[1]) {
              // second one in "1.23 cm"
              if (alreadyStrikeDenomIndex.indexOf(column2) === -1) {
                // if denominator not striked already
                alreadyStrikeDenomIndex.push(column2);

                let toRemoveI;
                // strikethrough Numerator
                if (column === -1) {
                  // this.setState({ strikethroughN: true });
                  setStrikethroughN(true);
                } else {
                  const numeratorBox = answers[column][0]['box'];
                  const newLatexN = answers[column][0]['data'].replace(
                    splitNumerator[1],
                    '\\class{strikethrough}{' + splitNumerator[1] + '}',
                  );

                  answers[column][0]['data'] = newLatexN; // data will not fill, because edit event not fire onMathQuillChange

                  setLatexWoFireEvent(numeratorBox, newLatexN);

                  // remove numerator unit from uncrossed out
                  toRemoveI = uncrossedUnits['nums'].indexOf(splitNumerator[1]);
                  if (toRemoveI !== -1) {
                    uncrossedUnits['nums'].splice(toRemoveI, 1);
                  }
                }
                if (column2 === -1) {
                  // this.setState({ strikethroughD: true });
                  setStrikethroughD(true);
                } else {
                  // strikethrough denominator
                  const denominatorBox = answers[column2][1]['box'];
                  const newLatexDN = answers[column2][1]['data'].replace(
                    splitNumerator[1],
                    '\\class{strikethrough}{' + splitNumerator[1] + '}',
                  );

                  answers[column2][1]['data'] = newLatexDN; // data will not fill, because edit event not fire onMathQuillChange

                  setLatexWoFireEvent(denominatorBox, newLatexDN);

                  // remove denominator unit from uncrossed out
                  toRemoveI = uncrossedUnits['denoms'].indexOf(splitNumerator[1]);
                  if (toRemoveI !== -1) {
                    uncrossedUnits['denoms'].splice(toRemoveI, 1);
                  }

                  continue numeratorsC; // need for stop search 2nd and more denominator with current unit
                }
              }
            }
          }
        } // end for denominators
      }
    } // end for numerators

    setAnswersSteps(answers);
    setUncrossedUnits(uncrossedUnits);

    // this.setState({
    //   answersSteps: answers,
    //   uncrossedUnits: uncrossedUnits,
    // });
  };

  useEffect(() => {
    // todo redraw only when remove steps? useRef to old value
    reDrawStrikes();
  }, [answersSteps, reDrawStrikes]);

  const onMathQuillChange = (data: string, row: number, col: number, mathquillObj: any) => {
    // check cursor position: if it not at the end - does not remove
    if (mathquillObj.__controller.cursor[1] === 0) {
      // if data contain strikethrough with end of line remove it
      // we must replace it only in currently edited mathquill box
      const tmpData = data.replace(/\\class{strikethrough}{(\S+)}$/, function(match, find) {
        if (find && typeof find === 'string' && find.length > 1) {
          // remove last char ot unit
          return find.slice(0, -1);
        } else {
          return '';
        } // remove unit if it is one char
      });
      if (tmpData !== data) {
        data = tmpData;
        setLatexWoFireEvent(mathquillObj, data);
      }
    }

    // store value in matrix
    const answers = answersSteps;

    answers[col - 1][row - 1] = {
      data: data,
      // splitData: this.constructor.parseToValueUnit(this.clearDataText(data)),
      splitData: parseToValueUnit(clearDataText(data)),
      box: mathquillObj,
    };

    setAnswersSteps(answers);

    // this.setState(
    //   {
    //     answersSteps: answers,
    //   },
    //   function() {
    //     this.reDrawStrikes();
    //   },
    // );
  };

  // result answer change
  const onResultChange = (data: string, row: number, col: number, mathquillObj: any) => {
    setAnswer({ data: data, box: mathquillObj });
    // this.setState({
    //   answer: { data: data, box: mathquillObj },
    // });
  };

  // clear data before js-q parse
  // remove  strikethrough
  const clearDataText = (tmpData: string) => {
    tmpData = tmpData.replace(/\\class{strikethrough}{(\S+)}/, '$1');
    // remove backslash with whitespace
    tmpData = tmpData.replace(/\\ /g, ' ');
    tmpData = tmpData.replace(/\\frac{(\S+)}{(\S+)}/, '$1/$2');
    // convert scientific notation
    tmpData = tmpData.replace(/\\cdot/g, '*');
    tmpData = tmpData.replace(/\^{\s*(\S+)\s*}/, '^($1)'); // fix for math.parser()

    // const parsedToValUnit = this.constructor.parseToValueUnit(tmpData);
    const parsedToValUnit = parseToValueUnit(tmpData);

    if (parsedToValUnit && parsedToValUnit[0]) {
      // const parser = math.parser();
      try {
        const value = window.evaluatex(parsedToValUnit[0])();
        // const value = parser.eval(parsedToValUnit[0]);
        if (value && parsedToValUnit[1]) {
          tmpData = value + ' ' + parsedToValUnit[1];
        }
      } catch (e) {} // catch SyntaxError
    }

    return tmpData;
  };

  const getQtyFromSplitData = (splitData: string) => {
    if (splitData) {
      return Qty.parse(splitData[0] + splitData[1]);
    }
    return null;
  };

  const sigFigs = (n: number, sig: number) => {
    const mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
    return Math.round(n * mult) / mult;
  };

  const getBaseFor2Qty = (firstQty: any, secondQty: any) => {
    // Determine the minimum of minLength
    let minLength = 0;
    minLength = firstQty.baseScalar.toString().length;
    if (secondQty.toString().length < minLength) {
      minLength = secondQty.baseScalar.toString().length;
    }

    const asf = sigFigs(firstQty.baseScalar, minLength);
    const isf = sigFigs(secondQty.baseScalar, minLength);

    const decimalPlaces = (num: number) => {
      const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      }
      return Math.max(
        0,
        // Number of digits right of decimal point + scientific notation.
        (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0),
      );
    };

    let decPlaces = decimalPlaces(asf);
    if (decimalPlaces(isf) < decPlaces) {
      decPlaces = decimalPlaces(isf);
    }

    function roundX(x: number, n: number) {
      const mult = Math.pow(10, n);
      return Math.round(x * mult) / mult;
    }

    return [roundX(asf, decPlaces), roundX(isf, decPlaces)];
  };

  const compareWithSigFigs = (firstQty: any, secondQty: any) => {
    const baseCompareLst = getBaseFor2Qty(firstQty, secondQty);

    let equal = '' + baseCompareLst[0] === '' + baseCompareLst[1];

    if (!equal) {
      const a = baseCompareLst[0];
      const b = baseCompareLst[1];
      const percent = (Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b))) * 100;
      if (percent <= 11) {
        equal = true;
      }
    }

    return equal;
  };

  const resetStrikeAnswers = () => {
    const answers = answersSteps;

    // this.state.strikethroughN = false;
    // this.state.strikethroughD = false;
    setStrikethroughN(false);
    setStrikethroughD(false);

    const resetStrike = function(answer: IAnswer, setLatexWoFireEvent: ISetLatexWoFireEvent) {
      const tmpData = answer['data'];
      if (!tmpData) return;

      const resetTxt = tmpData.replace(/\\class{strikethrough}{(\S+)}/, '$1'); // replace if with whitespaces

      if (resetTxt !== tmpData) {
        // replace only if changed
        answer['data'] = resetTxt;
        setLatexWoFireEvent(answer['box'], resetTxt);
      }
    };

    // const setLatexWoFireEvent = setLatexWoFireEvent;

    // reset all strikethrough after update any value
    for (let column = 0; column < answers.length; column++) {
      // walk through columns
      resetStrike(answers[column][0], setLatexWoFireEvent);
      resetStrike(answers[column][1], setLatexWoFireEvent);
    }
    return answers;
  };

  const parseToValueUnit = (input: string) => {
    // trim backslash and spaces
    input = input.replace(/^[\\\s]+|[\\\s]+$/gm, '');

    const unitsArr = INPUT_UNITS;
    // check for longer unit name firstly
    unitsArr.sort(function(a, b) {
      return b.length - a.length;
    });

    for (let i = 0; i < unitsArr.length; i++) {
      const unit = unitsArr[i];
      const foundIndex = input.indexOf(unit, input.length - unit.length);
      if (foundIndex !== -1) {
        // replace all char and spaces in value
        const val = input.substring(0, foundIndex).replace(/[^0-9*^.-]+/g, '');
        return [val, unit];
        // return [parseFloat(val), unit];
      }
    }
    return null;
  };
  // }

  return {
    addColumn,
    removeColumn,
    numColumns,
    clearDataText,
    reset,
    sigFigs,
    compareWithSigFigs,
    parseToValueUnit,
    answer,
    answersSteps,
    uncrossedUnits,
    strikethroughN,
    strikethroughD,
    onResultChange,
    onMathQuillChange,
  };
}
