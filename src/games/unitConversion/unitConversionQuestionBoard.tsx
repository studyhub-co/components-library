import React, { useState, useRef, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
// import Draggable from 'react-draggable';
// import ScrollContainer from 'react-indiana-drag-scroll';
// import MediaQuery from 'react-responsive';

import UnitConversionCanvas from './unitConversionCanvas';

import '../../components/unitConversion/components/mathquill-loader';
// this will add MathQuill to window
// import * as MathQuill from '@edtr-io/mathquill/build/mathquill.js';
// TODO It's already import on the bottom components, check that it's not reassigned again (move to the top level index?)
import * as MathQuill from '@edtr-io/mathquill';

import 'evaluatex/dist/evaluatex.min.js';
import Button from '@material-ui/core/Button';
import { checkSaveButtonStyle, checkSaveButtonStyleDisabled } from '../../components/common/style';

interface UnitConversionQuestionBoardProps {
  // props
  gameOver: (number: any, unit: any) => void;
  nextQuestion: (adScore: number) => void;
  level: number;
  conversionSessionHash: string;
  clear: boolean;
  number: string;
  unit: string;
  question: string;
  gameState: string;
}

const UnitConversionQuestionBoard: React.FC<UnitConversionQuestionBoardProps> = props => {
  const {
    // direct props
    gameState,
    level,
    gameOver,
    question,
    nextQuestion,
    number,
    unit,
    clear,
    conversionSessionHash: csh,
  } = props;

  const [calculatorAnswer, setCalculatorAnswer] = useState('');
  const [answer2Send, setAnswer2Send] = useState('');

  // const conversionCanvas = useRef();
  const calculatorField = useRef(null);

  useEffect(() => {
    const MQ = window.MathQuill.getInterface(2);

    calculatorField.current = MQ.MathField(document.getElementById(csh + '-calculatorField'), {
      autoCommands: 'pi',
      autoOperatorNames: 'sin',
      handlers: {
        edit: (mathField: any) => {
          const calculatedValue = clearCalculatorInput(mathField.latex());

          if (calculatedValue) {
            setCalculatorAnswer(calculatedValue);
          } else {
            setCalculatorAnswer('');
          }
        },
      },
    });

    MQ(document.getElementById(csh + '-11'))?.focus();
  }, [csh]);

  const copy2AnswerFunc = () => {
    // console.log('copy2AnswerFunc');
    if (calculatorAnswer !== '') {
      setAnswer2Send(calculatorAnswer);
      // const conversion = conversionCanvas.current as any;
      // conversion.updateAnswer(calculatorAnswer);
    }
  };

  const clearCalculatorInput = (tmpData: string) => {
    // remove backslash with whitespace
    tmpData = tmpData.replace(/\\ /g, ' ');
    tmpData = tmpData.replace(/\\frac{(\S+)}{(\S+)}/, '$1/($2)');
    // convert scientific notation
    tmpData = tmpData.replace(/\\cdot/g, '*');
    tmpData = tmpData.replace(/\^{\s*(\S+)\s*}/, '^($1)'); // fix for math.parser()
    tmpData = tmpData.replace(/\\left\(/g, '(');
    tmpData = tmpData.replace(/\\right\)/g, ')');
    // var parser = math.parser()

    try {
      // var value = parser.eval(tmpData)
      let value = window.evaluatex(tmpData)();
      if (value) {
        if (value < 1) {
          // leave just significant figures for answer
          const mult = Math.pow(10, 4 - Math.floor(Math.log(value) / Math.LN10) - 1);
          value = Math.round(value * mult) / mult;
        } else {
          value = value.toFixed(2);
        }
      }

      return value;
    } catch (e) {
      // console.log(e);
      // catch SyntaxError
    }

    return false;
  };

  const mathFieldStyle = {
    // minWidth: '10rem',
    width: '100%',
    fontSize: 30,
  };

  const cellCheatStyle = {
    border: '1px solid #d8d8d8',
    display: 'table-cell',
    verticalAlign: 'middle',
    padding: '1rem',
  };

  return (
    <div className="bounding-box text-center">
      {/*<Draggable*/}
      {/*  disabled={window.screen.width > 736}*/}
      {/*  axis="x"*/}
      {/*  bounds={{ left: -window.screen.width + 100, top: 0, right: 0, bottom: 0 }}*/}
      {/*  cancel=".mq-root-block"*/}
      {/*>*/}
      {/*<ScrollContainer vertical={false}>*/}
      {/*<div style={{ display: 'block', overflowX: 'auto' }}>*/}
      {/*  <div style={{ display: 'table', marginLeft: 'auto', marginRight: 'auto' }} className="bounding-box text-center">*/}
      <h2>{question}</h2>
      {/*<MediaQuery minDeviceWidth={736}>*/}
      {/*  <h2>{question}</h2>*/}
      {/*</MediaQuery>*/}
      {/*<MediaQuery maxDeviceWidth={736}>*/}
      {/*  <h2>{question}</h2>*/}
      {/*</MediaQuery>*/}
      <UnitConversionCanvas
        number={number}
        unit={unit}
        nextQuestion={nextQuestion}
        gameOver={gameOver}
        gameState={gameState}
        level={level}
        refreshAnswerValue={answer2Send}
        conversionSessionHash={csh}
        // ref={conversionCanvas => {
        //   conversionCanvas.current = conversionCanvas;
        // }}
      />
      {/*</div>*/}
      {/*</ScrollContainer>*/}
      {/*</Draggable>*/}
      {/*<Draggable*/}
      {/*  disabled={window.screen.width > 736}*/}
      {/*  axis="x"*/}
      {/*  bounds={{ left: -window.screen.width + 100, top: 0, right: 0, bottom: 0 }}*/}
      {/*  cancel=".mq-root-block"*/}
      {/*>*/}
      {/*<ScrollContainer vertical={false}>*/}
      {/*<div style={{ display: 'table', marginLeft: 'auto', marginRight: 'auto' }} className="bounding-box">*/}
      <div className="text-center">
        <h2>Calculator</h2>
        <div style={{ display: 'block', overflowX: 'auto' }}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={5}>
              <div style={{ verticalAlign: 'middle' }}>
                <p style={{ marginBottom: 5 }}>
                  <span id={csh + '-calculatorField'} style={mathFieldStyle} />
                </p>
              </div>
            </Grid>
            <Grid item xs={7}>
              <div
                style={{
                  fontSize: 30,
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
              >
                =
              </div>
              <div
                style={{
                  fontSize: 30,
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
              >
                {calculatorAnswer}
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="button-group">
            <Button style={checkSaveButtonStyle} variant="contained" color="primary" onClick={copy2AnswerFunc}>
              Copy to answer
            </Button>
            {/*<button*/}
            {/*  id="checkButton"*/}
            {/*  className={'btn btn-primary' + (calculatorAnswer === '' ? ' disabled' : '')}*/}
            {/*  onClick={copy2AnswerFunc}*/}
            {/*>*/}
            {/*  Copy to answer*/}
            {/*</button>*/}
          </div>
        </div>
        {/*</div>*/}
      </div>
      {/*</ScrollContainer>*/}
      {/*</Draggable>*/}
      {/*<Draggable*/}
      {/*  disabled={window.screen.width > 736}*/}
      {/*  axis="x"*/}
      {/*  bounds={{ left: -window.screen.width, top: 0, right: 0, bottom: 0 }}*/}
      {/*  cancel=".mq-root-block"*/}
      {/*>*/}
      <div style={{ marginLeft: 'auto', marginRight: 'auto' }} className="bounding-box">
        <div className="text-center">
          <h2>Unit Conversion Cheat Sheet</h2>
          <div style={{ overflowX: 'auto' }}>
            <div
              style={{
                display: 'table',
                marginLeft: 'auto',
                borderCollapse: 'collapse',
                marginRight: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ display: 'table-row' }}>
                <div style={Object.assign({}, cellCheatStyle, { textDecoration: 'underline', fontWeight: 'bold' })}>
                  Measurement
                </div>
                <div style={Object.assign({}, cellCheatStyle, { textDecoration: 'underline', fontWeight: 'bold' })}>
                  SI to US Standard
                </div>
                <div style={Object.assign({}, cellCheatStyle, { textDecoration: 'underline', fontWeight: 'bold' })}>
                  US Standard to SI
                </div>
              </div>
              <div style={{ display: 'table-row' }}>
                <div style={cellCheatStyle}>Distance</div>
                <div style={cellCheatStyle}>
                  1 cm = 0.3937 in <br />
                  1 m = 100 cm = 3.28 ft <br />1 km = 0.621 mi
                </div>
                <div style={cellCheatStyle}>
                  1 in = 2.54 cm <br />
                  1 ft = 0.3048 m <br />1 mi = 5280 ft = 1.609 km
                </div>
              </div>
              <div style={{ display: 'table-row' }}>
                <div style={cellCheatStyle}>Mass</div>
                <div style={cellCheatStyle}>
                  1 kg = 1000 g = 2.2 lb <br />1 g = 0.035 oz
                </div>
                <div style={cellCheatStyle}>
                  1 lb = 16 oz = 0.454 kg <br />1 oz = 28.35 g = 0.02835 kg
                </div>
              </div>
              <div style={{ display: 'table-row' }}>
                <div style={cellCheatStyle}>Time</div>
                <div style={cellCheatStyle}>1 s = 1000 ms = 0.0166 min</div>
                <div style={cellCheatStyle}>
                  1 min = 60 s <br /> <br />
                  Other useful non-SI conversions: <br />
                  1 hr = 60 min <br />
                  1 day = 24 hr <br />1 week = 7 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*</Draggable>*/}
    </div>
  );
};

export default UnitConversionQuestionBoard;

// class UnitConversionQuestionBoard extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {calulatorAnswer: '', copy2Answer: null}
//     this.copy2Answer = this.copy2Answer.bind(this)
//   }
//
//   copy2Answer () {
//     if (this.state.calulatorAnswer !== '') {
//       this.conversionCanvas.updateAnswer(this.state.calulatorAnswer)
//     }
//   }
//
//   clearCalculatorInput (tmpData) {
//     // remove backslash with whitespace
//     tmpData = tmpData.replace(/\\ /g, ' ')
//     tmpData = tmpData.replace(/\\frac{(\S+)}{(\S+)}/, '$1/($2)')
//     // convert scientific notation
//     tmpData = tmpData.replace(/\\cdot/g, '*')
//     tmpData = tmpData.replace(/\^{\s*(\S+)\s*}/, '^($1)') // fix for math.parser()
//     tmpData = tmpData.replace(/\\left\(/g, '(')
//     tmpData = tmpData.replace(/\\right\)/g, ')')
//
//     var parser = math.parser()
//     try {
//       var value = parser.eval(tmpData)
//       if (value) {
//         if (value < 1) {
//           // leave just significant figures for answer
//           var mult = Math.pow(10, 4 - Math.floor(Math.log(value) / Math.LN10) - 1)
//           value = Math.round(value * mult) / mult
//         } else {
//           value = value.toFixed(2)
//         }
//       }
//
//       return value
//     } catch (e) {
//       // https://github.com/josdejong/mathjs/issues/8 catched undefined error, wait for newer version of mathjs
//       // if (!(e instanceof SyntaxError)) { // catch SyntaxError
//       // throw e
//       // }
//     }
//
//     return false
//   }
//
//   componentDidMount () {
//     var MQ = MathQuill.getInterface(2)
//
//     this.calculatorField = MQ.MathField(document.getElementById('calculatorField'), {
//       autoCommands: 'pi',
//       autoOperatorNames: 'sin',
//       handlers: {
//         edit: (mathField) => {
//           var calcedValue = this.clearCalculatorInput(mathField.latex())
//           if (calcedValue) {
//             this.setState({
//               calulatorAnswer: calcedValue
//             })
//           } else {
//             this.setState({
//               calulatorAnswer: ''
//             })
//           }
//         }
//       }
//     })
//
//     MQ(document.getElementById('11')).focus()
//   }
//
//   render () {
//     var mathFieldStyle = {
//       minWidth: '25rem',
//       fontSize: 30
//     }
//
//     var cellCheatStyle = {
//       border: '1px solid #d8d8d8',
//       display: 'table-cell',
//       verticalAlign: 'middle',
//       padding: '1rem'
//     }
//
//     return (
//       <div>
//         <Draggable disabled={screen.width > 736} axis='x' bounds={{left: -screen.width + 100, top: 0, right: 0, bottom: 0}} cancel='.mq-root-block'>
//           <div style={{display: 'table', marginLeft: 'auto', marginRight: 'auto'}} className='bounding-box text-center'>
//             <MediaQuery minDeviceWidth={736}>
//               <h2>{ this.props.question }</h2>
//             </MediaQuery>
//             <MediaQuery maxDeviceWidth={736}>
//               <h2>{ this.props.question }</h2>
//             </MediaQuery>
//             <UnitConversionCanvas
//               number={this.props.number}
//               unit={this.props.unit}
//               nextQuestion={this.props.nextQuestion}
//               gameOver={this.props.gameOver}
//               gameState={this.props.gameState}
//               level={this.props.level}
//               ref={(conversionCanvas) => { this.conversionCanvas = conversionCanvas }}
//             />
//           </div>
//         </Draggable>
//         <Draggable disabled={screen.width > 736} axis='x' bounds={{left: -screen.width + 100, top: 0, right: 0, bottom: 0}} cancel='.mq-root-block'>
//           <div style={{display: 'table', marginLeft: 'auto', marginRight: 'auto'}} className='bounding-box'>
//             <div className='text-center'>
//               <h2>Calculator</h2>
//               <div>
//                 <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
//                   <p style={{marginBottom: 5}}>
//                     <span id={'calculatorField'} style={mathFieldStyle} />
//                   </p>
//                 </div>
//                 <div style={{fontSize: 30, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 15, paddingRight: 15}}>
//                   =
//                 </div>
//                 <div style={{fontSize: 30, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 15, paddingRight: 15}}>
//                   {this.state.calulatorAnswer}
//                 </div>
//                 <div style={{textAlign: 'right'}}>
//                   <div className='button-group'>
//                     <button id='checkButton'
//                             className={'btn btn-primary' + (this.state.calulatorAnswer === '' ? ' disabled' : '')}
//                             onClick={this.copy2Answer}
//                     >
//                       Copy to answer
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Draggable>
//         <div style={{display: 'table', marginLeft: 'auto', marginRight: 'auto'}} className='bounding-box'>
//           <div className='text-center'>
//             <h2>Unit Conversion Cheat Sheet</h2>
//             <div style={{display: 'table', marginLeft: 'auto', borderCollapse: 'collapse', marginRight: 'auto'}}>
//               <div style={{display: 'table-row'}}>
//                 <div style={Object.assign({}, cellCheatStyle, {textDecoration: 'underline', fontWeight: 'bold'})}>
//                   Measurement
//                 </div>
//                 <div style={Object.assign({}, cellCheatStyle, {textDecoration: 'underline', fontWeight: 'bold'})}>
//                   SI to US Standard
//                 </div>
//                 <div style={Object.assign({}, cellCheatStyle, {textDecoration: 'underline', fontWeight: 'bold'})}>
//                   US Standard to SI
//                 </div>
//               </div>
//               <div style={{display: 'table-row'}}>
//                 <div style={cellCheatStyle}>
//                   Distance
//                 </div>
//                 <div style={cellCheatStyle}>
//                   1 cm = 0.3937 in <br />
//                   1 m = 100 cm = 3.28 ft <br />
//                   1 km = 0.621 mi
//                 </div>
//                 <div style={cellCheatStyle}>
//                   1 in = 2.54 cm  <br />
//                   1 ft = 0.3048 m  <br />
//                   1 mi = 5280 ft = 1.609 km
//                 </div>
//               </div>
//               <div style={{display: 'table-row'}}>
//                 <div style={cellCheatStyle}>
//                   Mass
//                 </div>
//                 <div style={cellCheatStyle}>
//                   1 kg = 1000 g = 2.2 lb <br />
//                   1 g = 0.035 oz
//                 </div>
//                 <div style={cellCheatStyle}>
//                   1 lb = 16 oz = 0.454 kg   <br />
//                   1 oz = 28.35 g = 0.02835 kg
//                 </div>
//               </div>
//               <div style={{display: 'table-row'}}>
//                 <div style={cellCheatStyle}>
//                   Time
//                 </div>
//                 <div style={cellCheatStyle}>
//                   1 s = 1000 ms = 0.0166 min
//                 </div>
//                 <div style={cellCheatStyle}>
//                   1 min = 60 s <br />   <br />
//                   Other useful non-SI conversions:   <br />
//                   1 hr = 60 min   <br />
//                   1 day = 24 hr   <br />
//                   1 week = 7 days
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }
// UnitConversionQuestionBoard.propTypes = {
//   question: PropTypes.any,
//   number: PropTypes.any,
//   gameOver: PropTypes.func,
//   unit: PropTypes.string,
//   gameState: PropTypes.string,
//   nextQuestion: PropTypes.func,
//   level: PropTypes.number
// }
