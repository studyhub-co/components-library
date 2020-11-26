import React from 'react';

import { addStyles, EditableMathField } from 'react-mathquill';
import { parser } from 'mathjs';
import Qty from 'js-quantities';

// this will add jQuery to window
import './mathquill-loader';
// this will add MathQuill to window
import * as MathQuill from '@edtr-io/mathquill/build/mathquill.js';
// this will add evaluatex to window
import 'evaluatex/dist/evaluatex.min.js';

addStyles();

class UNITS {
  static get DISTANCE() {
    return {
      mm: 'millimeters',
      cm: 'centimeters',
      km: 'kilometers',
      ft: 'feet',
      mi: 'miles',
    };
  }

  static get TIME() {
    return {
      ms: 'milliseconds',
      min: 'minutes',
      hr: 'hours',
      d: 'days',
      wk: 'weeks',
    };
  }

  static get MASS() {
    return {
      mg: 'milligrams',
      g: 'grams',
      oz: 'ounces',
    };
  }

  static get SPEED() {
    const distanceO = UNITS.DISTANCE;
    distanceO['m'] = 'meters';
    const timeO = UNITS.TIME;
    timeO['s'] = 'seconds';

    const speedO = {};
    Object.keys(distanceO).forEach(function(keyDist) {
      Object.keys(timeO).forEach(function(keyTime) {
        if (!(keyDist === 'm' && keyTime === 's')) {
          // exclude SI unit
          speedO[keyDist + '/' + keyTime] = distanceO[keyDist] + '/' + timeO[keyTime];
        }
      });
    });

    return speedO;
  }
}

let INPUT_UNITS = ['s', 'm', 'kg', 'm/s'];
Object.getOwnPropertyNames(UNITS)
  .map(key => [key, Object.getOwnPropertyDescriptor(UNITS, key)])
  .filter(([key, descriptor]) => typeof descriptor.get === 'function')
  .map(([key]) => key)
  .forEach(function(key) {
    INPUT_UNITS = INPUT_UNITS.concat(Object.keys(UNITS[key]));
  });

export class UnitConversionBase extends React.Component {
  constructor(props) {
    super(props);

    let numColumns = 1;
    if (this.props.level === 5) {
      numColumns = 0;
    }

    this.onMathQuillChange = this.onMathQuillChange.bind(this);
    this.onResultChange = this.onResultChange.bind(this);
    this.onQuestionValueChange = this.onQuestionValueChange.bind(this);
    this.resetStrikeAnswers = this.resetStrikeAnswers.bind(this);
    this.reDrawStrikes = this.reDrawStrikes.bind(this);

    this.addColumn = this.addColumn.bind(this);
    this.removeColumn = this.removeColumn.bind(this);

    this.state = {
      numColumns: numColumns,
      strikethroughD: false,
      strikethroughN: false,
    };
  }

  addColumn() {
    const MQ = window.MathQuill.getInterface(2);
    const newColumns = this.state.numColumns + 1;

    this.setState(
      {
        numColumns: newColumns,
      },
      function() {
        // need wait mount mathquill span!
        this.setState({
          answersSteps: [
            ...this.state.answersSteps,
            [
              { data: '', box: MQ(document.getElementById('1' + newColumns)) },
              { data: '', box: MQ(document.getElementById('2' + newColumns)) },
            ],
          ],
        });
      },
    );
  }

  removeColumn() {
    this.setState(
      {
        numColumns: this.state.numColumns - 1,
        answersSteps: this.state.answersSteps.slice(0, -1),
      },
      function() {
        this.reDrawStrikes();
      },
    );
  }

  setLatexWoFireEvent(box, text) {
    box.data.fromJsCall = true;
    box.latex(text);
    box.data.fromJsCall = false;
  }

  reset() {
    const MQ = window.MathQuill.getInterface(2);

    const resetBox = function(id, setLatexWoFireEvent) {
      const span = document.getElementById(id);
      if (!span) return;
      const mq = MQ(span);
      setLatexWoFireEvent(mq, '');
      span.classList.remove('red-border', 'green-border');
    };

    const setLatexWoFireEvent = this.setLatexWoFireEvent;
    const ids = ['11', '21', '15'];
    ids.forEach(function(item, i, arr) {
      resetBox(item, setLatexWoFireEvent);
    });

    this.setState({
      numColumns: 1,
      strikethroughD: false,
      strikethroughN: false,
      answersSteps: [
        [
          { data: '', box: MQ(document.getElementById('11')) },
          { data: '', box: MQ(document.getElementById('12')) },
        ],
      ], // first column set by default
    });
  }

  reDrawStrikes() {
    const answers = this.resetStrikeAnswers();
    const uncrossedUnits = { nums: [], denoms: [] };

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
        if (this.props.unit) {
          splitNumerator = ['', this.props.unit.split('/')[0]]; // main unit
        }
      } else {
        splitNumerator = answers[column][0]['splitData'];
      } // "2 cm"

      if (splitNumerator) {
        for (let column2 = -1; column2 < answers.length; column2++) {
          // walk through denominators
          if (column2 === -1) {
            if (this.props.unit.split('/')[1]) {
              splitDenominator = ['', this.props.unit.split('/')[1]]; // km/hr
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
                  this.setState({ strikethroughN: true });
                } else {
                  const numeratorBox = answers[column][0]['box'];
                  const newLatexN = answers[column][0]['data'].replace(
                    splitNumerator[1],
                    '\\class{strikethrough}{' + splitNumerator[1] + '}',
                  );

                  answers[column][0]['data'] = newLatexN; // data will not fill, because edit event not fire onMathQuillChange

                  this.setLatexWoFireEvent(numeratorBox, newLatexN);

                  // remove numerator unit from uncrossed out
                  toRemoveI = uncrossedUnits['nums'].indexOf(splitNumerator[1]);
                  if (toRemoveI !== -1) {
                    uncrossedUnits['nums'].splice(toRemoveI, 1);
                  }
                }
                if (column2 === -1) {
                  this.setState({ strikethroughD: true });
                } else {
                  // strikethrough denominator
                  const denominatorBox = answers[column2][1]['box'];
                  const newLatexDN = answers[column2][1]['data'].replace(
                    splitNumerator[1],
                    '\\class{strikethrough}{' + splitNumerator[1] + '}',
                  );

                  answers[column2][1]['data'] = newLatexDN; // data will not fill, because edit event not fire onMathQuillChange

                  // console.log(newLatexDN);

                  this.setLatexWoFireEvent(denominatorBox, newLatexDN);

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

    this.setState({
      answersSteps: answers,
      uncrossedUnits: uncrossedUnits,
    });
  }

  onMathQuillChange(data, row, col, mathquillObj) {
    // check cursor position: if it not at the end - does not remove
    if (mathquillObj.__controller.cursor[1] === 0) {
      // if data contain strikethrough with end of line remove it
      // we must replace it only in currently edited mathquill box
      const tmpData = data.replace(/\\class{strikethrough}{(\S+)}$/, function(match, find) {
        if (find && find.length > 1) {
          // remove last char ot unit
          return find.slice(0, -1);
        } else {
          return '';
        } // remove unit if it is one char
      });
      if (tmpData !== data) {
        data = tmpData;
        this.setLatexWoFireEvent(mathquillObj, data);
      }
    }

    // store value in matrix
    const answers = this.state.answersSteps;

    answers[col - 1][row - 1] = {
      data: data,
      splitData: this.constructor.parseToValueUnit(this.clearDataText(data)),
      box: mathquillObj,
    };

    this.setState(
      {
        answersSteps: answers,
      },
      function() {
        this.reDrawStrikes();
      },
    );
  }

  // result answer change
  onResultChange(data, row, col, mathquillObj) {
    this.setState({
      answer: { data: data, box: mathquillObj },
    });
  }

  // clear data before js-q parse
  // remove  strikethrough
  clearDataText(tmpData) {
    tmpData = tmpData.replace(/\\class{strikethrough}{(\S+)}/, '$1');
    // remove backslash with whitespace
    tmpData = tmpData.replace(/\\ /g, ' ');
    tmpData = tmpData.replace(/\\frac{(\S+)}{(\S+)}/, '$1/$2');
    // convert scientific notation
    tmpData = tmpData.replace(/\\cdot/g, '*');
    tmpData = tmpData.replace(/\^{\s*(\S+)\s*}/, '^($1)'); // fix for math.parser()

    const parsedToValUnit = this.constructor.parseToValueUnit(tmpData);

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
  }

  getQtyFromSplitData(splitData) {
    if (splitData) {
      return Qty.parse(splitData[0] + splitData[1]);
    }
    return null;
  }

  sigFigs(n, sig) {
    const mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
    return Math.round(n * mult) / mult;
  }

  getBaseFor2Qty(firstQty, secondQty) {
    // Determine the minimum of minLength
    let minLength = 0;
    minLength = firstQty.baseScalar.toString().length;
    if (secondQty.toString().length < minLength) {
      minLength = secondQty.baseScalar.toString().length;
    }

    const asf = this.sigFigs(firstQty.baseScalar, minLength);
    const isf = this.sigFigs(secondQty.baseScalar, minLength);

    function decimalPlaces(num) {
      const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      }
      return Math.max(
        0,
        // Number of digits right of decimal point + scientific notation.
        (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0),
      );
    }

    let decPlaces = 0;
    decPlaces = decimalPlaces(asf);
    if (decimalPlaces(isf) < decPlaces) {
      decPlaces = decimalPlaces(isf);
    }

    function roundX(x, n) {
      const mult = Math.pow(10, n);
      return Math.round(x * mult) / mult;
    }

    return [roundX(asf, decPlaces), roundX(isf, decPlaces)];
  }

  compareWithSigFigs(firstQty, secondQty) {
    const baseCompareLst = this.getBaseFor2Qty(firstQty, secondQty);

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
  }

  resetStrikeAnswers() {
    const answers = this.state.answersSteps;

    this.state.strikethroughN = false;
    this.state.strikethroughD = false;
    const resetStrike = function(answer, setLatexWoFireEvent) {
      const tmpData = answer['data'];
      if (!tmpData) return;

      const resetTxt = tmpData.replace(/\\class{strikethrough}{(\S+)}/, '$1'); // replace if with whitespaces

      if (resetTxt !== tmpData) {
        // replace only if changed
        answer['data'] = resetTxt;
        setLatexWoFireEvent(answer['box'], resetTxt);
      }
    };

    const setLatexWoFireEvent = this.setLatexWoFireEvent;

    // reset all strikethrough after update any value
    for (let column = 0; column < answers.length; column++) {
      // walk through columns
      resetStrike(answers[column][0], setLatexWoFireEvent);
      resetStrike(answers[column][1], setLatexWoFireEvent);
    }
    return answers;
  }

  static parseToValueUnit(input) {
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
  }
}
// TODO replace with ts
// UnitConversionBase.propTypes = {
//   level: PropTypes.number,
//   unit: PropTypes.string,
// };
