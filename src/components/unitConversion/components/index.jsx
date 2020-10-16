import React from 'react';

import { UnitConversionBase } from './base';
import { MathquillBox } from './mathquillBox';
import { ConversionTable } from './conversionTable';
import { addStyles, EditableMathField } from 'react-mathquill';

// this will add jQuery to window
import './mathquill-loader';
// this will add MathQuill to window
import * as MathQuill from '@edtr-io/mathquill/build/mathquill.js';

addStyles();

export class UnitConversion extends UnitConversionBase {
  initialBoxes(props) {
    const spanBoxesIds = ['11', '21', '15'];

    for (let i = 0; i < spanBoxesIds.length; i++) {
      // toto refactor this
      document.getElementById(spanBoxesIds[i]).classList.remove('green-border');
      document.getElementById(spanBoxesIds[i]).classList.remove('red-border');
      document.getElementById(spanBoxesIds[i]).style.pointerEvents = 'auto';
    }

    const MQ = window.MathQuill.getInterface(2);

    const numBox = MQ(document.getElementById('11'));
    const denumBox = MQ(document.getElementById('21'));
    const answerBox = MQ(document.getElementById('15'));

    if (props.unitConversionType === '10') {
      // fill right hand side
      // fist column reset
      this.setLatexWoFireEvent(numBox, '');
      this.setLatexWoFireEvent(denumBox, '');

      document.getElementById('15').style.pointerEvents = 'none';
      document.getElementById('15').firstElementChild.firstElementChild.setAttribute('tabindex', '-1');

      this.setState(
        {
          answer: { data: props.answerNumber + ' ' + props.answerUnit, box: answerBox },
          numColumns: 1,
          answersSteps: [
            [
              { data: '', box: MQ(document.getElementById('11')) },
              { data: '', box: MQ(document.getElementById('21')) },
            ],
          ], // column set by default
        },
        function() {
          this.setLatexWoFireEvent(answerBox, props.answerNumber + '\\ ' + props.answerUnit);
          // set focus on 1st box
          MQ(document.getElementById('11')).focus();
        },
      );
    }

    if (props.unitConversionType === '20') {
      // fill left hand side
      const answersSteps = [];

      this.setLatexWoFireEvent(answerBox, '');

      this.setState(
        {
          numColumns: props.conversionSteps.length,
        },
        function() {
          for (let x = 0; x < props.conversionSteps.length; x++) {
            if (props.conversionSteps[x]['numerator'] && props.conversionSteps[x]['denominator']) {
              answersSteps.push([
                {
                  data: props.conversionSteps[x]['numerator'],
                  splitData: this.constructor.parseToValueUnit(
                    this.clearDataText(props.conversionSteps[x]['numerator']),
                  ),
                  box: MQ(document.getElementById('1' + (x + 1))),
                },
                {
                  data: props.conversionSteps[x]['denominator'],
                  splitData: this.constructor.parseToValueUnit(
                    this.clearDataText(props.conversionSteps[x]['denominator']),
                  ),
                  box: MQ(document.getElementById('2' + (x + 1))),
                },
              ]);

              this.setLatexWoFireEvent(answersSteps[x][0]['box'], answersSteps[x][0]['data']);
              this.setLatexWoFireEvent(answersSteps[x][1]['box'], answersSteps[x][1]['data']);
              answersSteps[x][0]['box'].__controller.container[0].style.pointerEvents = 'none';
              answersSteps[x][1]['box'].__controller.container[0].style.pointerEvents = 'none';
            }
          }
          this.setState(
            {
              answersSteps: answersSteps,
              numColumns: answersSteps.length,
            },
            function() {
              this.reDrawStrikes();
            },
          );
        },
      );
    }

    if (props.unitConversionType === '30') {
      // no fill any side
      // set focus on 1st box
      MQ(document.getElementById('11')).focus();
      this.setState(
        {
          answersSteps: [
            [
              { data: '', box: MQ(document.getElementById('11')) },
              { data: '', box: MQ(document.getElementById('21')) },
            ],
          ],
        },
        function() {
          // set focus on 1st box
          MQ(document.getElementById('11')).focus();
        },
      );
    }
  }

  componentDidMount() {
    this.reset();
    this.props.updateAnswer(null);
    this.initialBoxes(this.props);
  }

  componentWillReceiveProps(newProps) {
    // UnitConversionCanvas is child for SingleUnitConversionAnswer where props.question located
    if (newProps.uuid !== this.props.uuid) {
      this.reset();
      this.props.updateAnswer(null);
      this.initialBoxes(newProps);
    }
  }

  updateExternalAnswer() {
    const answerSteps = this.state.answersSteps;
    let conversionSteps = [];

    if (this.props.unitConversionType === '20') {
      conversionSteps = this.props.conversionSteps;
    } else {
      for (let x = 0; x < answerSteps.length; x++) {
        try {
          conversionSteps.push({
            numerator: answerSteps[x][0]['splitData'].join(' '),
            denominator: answerSteps[x][1]['splitData'].join(' '),
          });
        } catch (err) {}
      }
    }

    let answerSplit = null;

    if (typeof this.state.answer !== 'undefined' && this.state.answer['box']) {
      answerSplit = this.constructor.parseToValueUnit(this.clearDataText(this.state.answer['box'].latex()));
    }

    if (conversionSteps.length != 0) {
      if (answerSplit) {
        this.props.updateAnswer([
          this.props.uuid,
          {
            unitConversion: {
              answerNumber: answerSplit[0],
              answerUnit: answerSplit[1],
              conversionSteps: conversionSteps,
            },
          },
        ]);
      }
    } else {
      // if no steps - do not update
      this.props.updateAnswer(null);
    }
  }

  // result answer change
  onResultChange(data, row, col, mathquillObj) {
    if (this.props.unitConversionType === '10') {
      this.setLatexWoFireEvent(mathquillObj, this.calculateAnswer()); // recalculate answer from lefside
    } else {
      // show num & denum
      this.setState({
        answer: { data: data, box: mathquillObj },
      });
    }

    this.updateExternalAnswer();
  }

  calculateAnswer() {
    const numUnits = [];
    const denomUnits = [];

    let answerValue = this.props.number;

    // exclude strikethrouth
    if (!this.state.strikethroughN) {
      numUnits.push(this.props.unit.split('/')[0]);
    }
    if (!this.state.strikethroughD && this.props.unit.split('/').length > 1) {
      denomUnits.push(this.props.unit.split('/')[1]);
    }

    const uncrossedUnits = Object.assign({}, this.state.uncrossedUnits);

    for (let x = 0; x < this.state.answersSteps.length; x++) {
      let numSplitData = this.state.answersSteps[x][0].splitData;
      const numAnswerData = this.clearDataText(this.state.answersSteps[x][0].data).split(' ')[0];

      // test if it simple Number
      if (!numSplitData && Number(numAnswerData) === Number(numAnswerData)) {
        numSplitData = [Number(numAnswerData)];
      }

      if (typeof numSplitData !== 'undefined' && numSplitData) {
        let numValue = numSplitData[0];
        if (numValue === '') {
          numValue = 1;
        }

        if (numValue || numAnswerData.trim() === '0') {
          answerValue *= numValue;
        }
        if (numSplitData[1] && uncrossedUnits['nums'].length > 0) {
          const indexNUnit = uncrossedUnits['nums'].indexOf(numSplitData[1]);
          if (indexNUnit !== -1) {
            // remove unit from nums
            uncrossedUnits['nums'].splice(indexNUnit, 1);
            numUnits.push(numSplitData[1]);
          }
        }
      }

      let denomSplitData = this.state.answersSteps[x][1].splitData;
      const denomAnswerData = this.clearDataText(this.state.answersSteps[x][1].data).split(' ')[0];

      // test if it simple Number
      if (!denomSplitData && Number(denomAnswerData) === Number(denomAnswerData)) {
        denomSplitData = [Number(denomAnswerData)];
      }

      if (typeof denomSplitData !== 'undefined' && denomSplitData) {
        let denomValue = denomSplitData[0];
        if (denomValue === '') {
          denomValue = 1;
        }

        if (denomValue || denomAnswerData.trim() === '0') {
          answerValue = answerValue / denomValue;
        }

        if (denomSplitData[1] && uncrossedUnits['denoms'].length > 0) {
          const indexDUnit = uncrossedUnits['denoms'].indexOf(denomSplitData[1]);
          if (indexDUnit !== -1) {
            uncrossedUnits['denoms'].splice(indexDUnit, 1);
            denomUnits.push(denomSplitData[1]);
          }
        }
      }
    }

    let unit;

    if (denomUnits.length > 0) {
      unit = '\\frac{' + numUnits.join('*') + '}{' + denomUnits.join('*') + '}';
    } else {
      unit = numUnits.join('*');
    }

    return answerValue + '\\ ' + unit;
  }

  // one of the boxes value changed
  onMathQuillChange(data, row, col, mathquillObj) {
    super.onMathQuillChange(data, row, col, mathquillObj);
    const MQ = window.MathQuill.getInterface(2);

    const answerSteps = this.state.answersSteps;

    if (this.props.unitConversionType === '10') {
      // automatically fill right hand box | left side blank
      const answerBox = MQ(document.getElementById('15'));
      this.setLatexWoFireEvent(answerBox, this.calculateAnswer());
    }
    // all side blank | right side blank - do nothing
    this.setState({
      answerSteps: answerSteps,
    });

    this.updateExternalAnswer();
  }

  render() {
    if (typeof this.props.is_correct_answer !== 'undefined') {
      // user gave answer
      const spanBoxes = [];
      if (this.props.unitConversionType === '20' || '30') {
        // RIGHT SIDE BLANK
        spanBoxes.push(15);
      }
      if (this.props.unitConversionType === '10' || '30') {
        // LEFT SIDE BLANK
        for (let x = 0; x < this.state.answersSteps.length; x++) {
          spanBoxes.push('1' + (x + 1));
          spanBoxes.push('2' + (x + 1));
        }
      }

      for (let i = 0; i < spanBoxes.length; i++) {
        const element = document.getElementById(spanBoxes[i]);
        element.style.pointerEvents = 'none'; // disable editable

        if (this.props.is_correct_answer === true) {
          element.classList.add('green-border'); // green if correct
        }

        if (this.props.is_correct_answer === false) {
          element.classList.add('red-border'); // red if incorrect
        }
      }
    }

    const buttonStyle = {
      padding: 2,
      display: 'block',
      margin: 'auto',
      marginTop: 1,
      marginBottom: 1,
    };
    const disabledButtonStyle = {
      padding: 2,
      display: 'block',
      margin: 'auto',
      marginTop: 1,
      marginBottom: 1,
      cursor: 'not-allowed',
      pointerEvents: 'none',
      color: '#c0c0c0',
      border: '.2rem solid #c0c0c0',
      backgroundColor: '#ffffff',
    };

    return (
      <div style={{ display: 'block' }}>
        <div style={{ display: 'table', marginLeft: 'auto', marginRight: 'auto' }}>
          <ConversionTable
            numColumns={this.state.numColumns}
            onMathQuillChange={this.onMathQuillChange}
            number={this.props.number}
            unit={this.props.unit}
            strikethroughN={this.state.strikethroughN}
            strikethroughD={this.state.strikethroughD}
          />
          {this.props.unitConversionType === '20' ? null : (
            <div
              style={{ fontSize: 10, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 0, paddingRight: 0 }}
            >
              <button
                className="hover-button"
                style={this.state.numColumns === 4 ? disabledButtonStyle : buttonStyle}
                onClick={this.addColumn}
              >
                +Add Step
              </button>
              <button
                className="hover-button"
                style={this.state.numColumns === 1 ? disabledButtonStyle : buttonStyle}
                onClick={this.removeColumn}
                disabled={this.state.numColumns === 1}
              >
                -Remove Step
              </button>
            </div>
          )}
          <div
            style={{ fontSize: 30, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 15, paddingRight: 15 }}
          >
            =
          </div>
          <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
            <MathquillBox
              onMathQuillChange={this.onResultChange}
              row={1}
              column={5}
              focus={this.props.unitConversionType === '20'}
            />
          </div>
        </div>
      </div>
    );
  }
}
// TODO replace with ts
// UnitConversionCanvas.propTypes = {
//     updateAnswer: PropTypes.func.isRequired,
//     unitConversionType: PropTypes.string,
//     conversionSteps: PropTypes.array,
//     is_correct_answer: PropTypes.bool
// }