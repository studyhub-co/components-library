import React, { useEffect, useState } from 'react';

import Qty from 'js-quantities';

// // this will add jQuery to window
// import '../../components/unitConversion/components/mathquill-loader';
// // this will add MathQuill to window
// // import * as MathQuill from '@edtr-io/mathquill/build/mathquill.js';
// import * as MathQuill from '@edtr-io/mathquill';

import { playAudio } from '../../utils/sounds';

import { GameState } from '../constants';
import { useUnitConversionBase } from '../../components/unitConversion/components/useUnitConversionBase';
import { StyledButton } from '../../components/unitConversion/components/style';
import { MathquillBox } from './mathquillBox';
import { ConversionTable } from './unitConversionTable';
import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';

interface UnitConversionCanvasProps {
  // props
  gameOver: (number: any, unit: any) => void;
  nextQuestion: (adScore: number) => void;
  level: number;
  conversionSessionHash: string;
  // clear: boolean;
  number: string;
  unit: string;
  gameState: string;
  refreshAnswerValue?: string;
}

const UnitConversionCanvas: React.FC<UnitConversionCanvasProps> = props => {
  const {
    // direct props
    gameState,
    level,
    gameOver,
    nextQuestion,
    number,
    unit,
    refreshAnswerValue,
    conversionSessionHash: csh,
  } = props;

  // const [answersSteps, setAnswersSteps] = useState([]);
  // const [uncrossedUnits, setUncrossedUnits] = useState([]);
  // const [answer, setAnswer] = useState([]);
  const [incorrectUnitType, setIncorrectUnitType] = useState(false);
  const [incorrectConversion, setIncorrectConversion] = useState(false);
  const [incompleteConversion, setIncompleteConversion] = useState(false);
  const [incorrectAnswer, setIncorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const {
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
  } = useUnitConversionBase({
    level: level,
    unit: unit,
    conversionSessionHash: csh,
  });

  // useEffect(() => {
  //   // const MQ = MathQuill.getInterface(2);
  //   // if (this.props.level === 5) {
  //   //   this.setState({
  //   //     answersSteps: [],
  //   //   });
  //   // } else {
  //   //   this.setState({
  //   //     answersSteps: [
  //   //       [
  //   //         // first column set by default
  //   //         { data: '', box: MQ(document.getElementById('11')) },
  //   //         { data: '', box: MQ(document.getElementById('21')) },
  //   //       ],
  //   //     ],
  //   //   });
  //   // }
  //   reset();
  //   // document.addEventListener('keydown', keydown.bind(this), false);
  //   document.addEventListener('keydown', keydown, false);
  //
  //   return () => {
  //     document.removeEventListener('keydown', keydown, false);
  //   };
  // }, [reset]);

  useEffect(() => {
    // const MQ = MathQuill.getInterface(2);
    // if (this.props.level === 5) {
    //   this.setState({
    //     answersSteps: [],
    //   });
    // } else {
    //   this.setState({
    //     answersSteps: [
    //       [
    //         // first column set by default
    //         { data: '', box: MQ(document.getElementById('11')) },
    //         { data: '', box: MQ(document.getElementById('21')) },
    //       ],
    //     ],
    //   });
    // }
    reset();
    // document.addEventListener('keydown', keydown.bind(this), false);
    document.addEventListener('keydown', keydown, false);

    return () => {
      document.removeEventListener('keydown', keydown, false);
    };
  }, []); // do not use 'reset' and 'keydown' here!

  const submitQuestion = () => {
    const answers = answersSteps;
    // why we need this, it's only copy link to the object
    // const uncrossedUnits = uncrossedUnits as any;
    const qNumber = number;
    const qUnit = unit;

    let spanNElement = null;
    let spanDElement = null;

    let isRightAnswer = true;

    if (!answersSteps || answersSteps.length === 0 || !answer || !answer['data']) {
      return;
    }

    // checking for correct units conversions
    for (let column = 0; column < answers.length; column++) {
      // walk through columns
      const numerator = answers[column][0];
      if (numerator['box']) {
        spanNElement = numerator['box'].__controller.container[0];
      }
      const denominator = answers[column][1];
      if (denominator['box']) {
        spanDElement = denominator['box'].__controller.container[0];
      }
      let qnQty, qdQty;

      if (clearDataText(numerator['data']) === '' || clearDataText(denominator['data']) === '') {
        // catch empty text
        qnQty = null;
        qdQty = null;
      } else {
        qnQty = Qty.parse(clearDataText(numerator['data']));
        qdQty = Qty.parse(clearDataText(denominator['data']));
      }

      let incorrectKind = false;
      let incorrectCount = 0;

      if (qnQty && qdQty) {
        // check for unit kind
        const correctQsUnits = [qUnit.split('/')[0]];

        if (qUnit.split('/')[1]) {
          // km/s
          correctQsUnits.push(qUnit.split('/')[1]);
        }

        for (let i = 0; i < correctQsUnits.length; i++) {
          const initialUnitQty = Qty.parse(correctQsUnits[i]);
          if (initialUnitQty.kind() !== (qnQty.kind() && qdQty.kind())) {
            incorrectCount++;
          }
        }
        if (incorrectCount > correctQsUnits.length - 1) {
          // for km/s can be only one incorrect
          incorrectKind = true;
        }
      }

      // check conversions steps
      if (qnQty && qdQty && !incorrectKind && qnQty.isCompatible(qdQty) && compareWithSigFigs(qnQty, qdQty)) {
        if (spanNElement) {
          spanNElement.classList.add('green-border');
        }
        if (spanDElement) {
          spanDElement.classList.add('green-border');
        }
      } else {
        if (incorrectKind) {
          setIncorrectUnitType(true);
          // this.setState({
          //   incorrectUnitType: true,
          // });
        } else {
          setIncorrectConversion(true);
          // this.setState({
          //   incorrectConversion: true,
          // });
        }
        isRightAnswer = false;
        if (spanNElement) {
          spanNElement.classList.add('red-border');
        }
        if (spanDElement) {
          spanDElement.classList.add('red-border');
        }
      }
    } // end for

    // check answer
    const initialQty = new Qty(Number(qNumber), qUnit);
    const answerSpan = document.getElementById(csh + '-15');

    let answerQty;
    if (answer && answer['data'] && clearDataText(answer['data']) !== '') {
      answerQty = Qty.parse(clearDataText(answer['data']));
    } else {
      answerQty = null;
    }

    if (answerQty && answerQty.isCompatible(initialQty) && compareWithSigFigs(initialQty, answerQty)) {
      answerSpan?.classList?.add('green-border');
    } else {
      let correctAnswer;

      if (initialQty.toBase().scalar < 1) {
        // leave just significant figures for answer
        correctAnswer = sigFigs(initialQty.toBase().scalar, 4);
      } else {
        correctAnswer = initialQty.toBase().scalar.toFixed(2);
      }

      let incompleteConversionLocal = true;
      // checking for incomplete units conversions
      if (uncrossedUnits && uncrossedUnits['nums'].length === 1 && uncrossedUnits['denoms'].length <= 1) {
        let remainUnit = uncrossedUnits['nums'][0] as string;
        if (uncrossedUnits['denoms'].length === 1) {
          remainUnit += '/' + uncrossedUnits['denoms'];
        } else {
          // try to use initial denominator
          if (typeof qUnit.split('/')[1] !== 'undefined') {
            remainUnit += '/' + qUnit.split('/')[1];
          }
        }
        // compare answer and remain unit
        if (answer) {
          const answerText = parseToValueUnit(clearDataText(answer['data']));

          if (answerText && typeof answerText[1] !== 'undefined' && answerText[1] === remainUnit) {
            incompleteConversionLocal = false;
          }
        }
      }

      if (incompleteConversionLocal) {
        isRightAnswer = false;
        setIncompleteConversion(true);
        // this.setState({
        //   incompleteConversion: true,
        // });
      }

      setIncorrectAnswer(true);
      setCorrectAnswer(
        correctAnswer +
          ' ' +
          initialQty
            .toBase()
            .toString()
            .split(' ')[1],
      );

      // this.setState({
      //   incorrectAnswer: true,
      //   correctAnswer:
      //     correctAnswer +
      //     ' ' +
      //     initialQty
      //       .toBase()
      //       .toString()
      //       .split(' ')[1],
      // });
      isRightAnswer = false;
      answerSpan?.classList?.add('red-border');
    }

    if (isRightAnswer === true) {
      playAudio('correct', 1);
      reset();
      nextQuestion(500);
    } else {
      playAudio('incorrect', 1);
      gameOver(null, null);
    }

    // erase calculator
    if (document.getElementById(csh + '-calculatorField')) {
      const MQ = window.MathQuill.getInterface(2);
      MQ(document.getElementById(csh + '-calculatorField')).latex('');
    }
  };

  useEffect(() => {
    if (refreshAnswerValue !== '') {
      const MQ = window.MathQuill.getInterface(2);
      MQ.MathField(document.getElementById(csh + '-15')).latex(refreshAnswerValue);
      MQ.MathField(document.getElementById(csh + '-15')).focus();
    }
  }, [csh, refreshAnswerValue]);

  // const updateAnswer = (answer: string) => {
  //   const MQ = window.MathQuill.getInterface(2);
  //   MQ.MathField(document.getElementById('15')).latex(answer);
  //   MQ.MathField(document.getElementById('15')).focus();
  // };

  const keydown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      // detect that calculator field and button is not focused
      if (
        !document?.getElementById(csh + '-calculatorField')?.classList?.contains('mq-focused') &&
        document.activeElement !== document.getElementById('checkButton') &&
        document.activeElement !== document.getElementById('addStep') &&
        document.activeElement !== document.getElementById('removeStep')
      ) {
        submitQuestion();
      }
    }
  };

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

  let pointerEvents = { pointerEvents: 'auto' } as React.CSSProperties;

  if (gameState === GameState.GAME_OVER) {
    pointerEvents = { pointerEvents: 'none' } as React.CSSProperties;
    try {
      document?.getElementById('tryAgain')?.focus();
    } catch (e) {}
  }

  return (
    <div style={pointerEvents}>
      <div style={{ display: 'block', overflowX: 'auto' }}>
        <div style={{ display: 'table', marginLeft: 'auto', marginRight: 'auto', whiteSpace: 'nowrap' }}>
          <ConversionTable
            numColumns={numColumns}
            onMathQuillChange={onMathQuillChange}
            number={number}
            unit={unit}
            conversionSessionHash={csh}
            strikethroughN={strikethroughN}
            strikethroughD={strikethroughD}
          />
          <div
            style={{
              fontSize: 10,
              display: 'table-cell',
              verticalAlign: 'middle',
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <StyledButton
              id="addStep"
              className="hover-button"
              style={numColumns === 4 ? disabledButtonStyle : buttonStyle}
              onClick={addColumn}
            >
              +Add Step
            </StyledButton>
            <StyledButton
              id="removeStep"
              className="hover-button"
              style={numColumns === 1 ? disabledButtonStyle : buttonStyle}
              onClick={removeColumn}
              // disabled={numColumns === 1}
            >
              -Remove Step
            </StyledButton>
          </div>
          <div
            style={{ fontSize: 30, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 15, paddingRight: 15 }}
          >
            =
          </div>
          <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
            <MathquillBox conversionSessionHash={csh} onMathQuillChange={onResultChange} row={1} column={5} />
            {incorrectAnswer ? (
              <div style={{ border: '.1rem solid black' }}>
                <div style={{ color: 'red' }}>Incorrect answer</div>
                <div style={{ color: 'green' }}>Correct answer: {correctAnswer}</div>
              </div>
            ) : null}
          </div>
        </div>
        {/*</div>*/}
      </div>
      {incompleteConversion ? (
        <div style={{ border: '.1rem solid black' }}>
          <div style={{ color: 'red' }}>Incorrect: incomplete conversion</div>
        </div>
      ) : null}
      {incorrectConversion ? (
        <div style={{ border: '.1rem solid black' }}>
          <div style={{ color: 'red' }}>Incorrect unit conversion</div>
        </div>
      ) : null}
      {incorrectUnitType ? (
        <div style={{ border: '.1rem solid black' }}>
          <div style={{ color: 'red' }}>Incorrect unit type</div>
        </div>
      ) : null}
      <div style={gameState === GameState.GAME_OVER ? { display: 'none' } : { display: 'block' }}>
        <Button className="hover-button" color="primary" variant="contained" onClick={submitQuestion}>
          Submit
        </Button>
        {/*<button className="hover-button" style={{ marginTop: 15 }} onClick={() => submitQuestion()}>*/}
        {/*  Submit*/}
        {/*</button>*/}
      </div>
    </div>
  );
};

export default UnitConversionCanvas;
