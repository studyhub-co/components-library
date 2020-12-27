import React, { useState, useEffect } from 'react';

import { addStyles, StaticMathField } from 'react-mathquill';

import { GameState } from '../constants';
import VectorGameBoard from './vectorGameBoard';

import apiFactory, { Api } from '../../redux/modules/apiFactory';

import { VectorCanvas, CanvasVector, CanvasText } from '../../components/vector/vectorCanvas';

import {
  stopBackgroundAudio,
  pauseBackgroundAudio,
  unpauseBackgroundAudio,
  playBackgroundAudio,
  playAudio,
} from '../../utils/sounds';

addStyles(); // react-mathquill styles

const BACKEND_SERVER_API_URL = process.env['NODE_ENV'] === 'development' ? 'http://127.0.0.1:8000/api/v1/' : '/api/v1/';

const api: Api = apiFactory(BACKEND_SERVER_API_URL);

// TODO replace :any with correct types

interface QuestionBoardProps {
  // props
  materialUuid: string;
}

const VectorGame: React.FC<QuestionBoardProps> = props => {
  const {
    // direct props
    materialUuid,
  } = props;

  // counter
  const [seconds, setSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActiveCounter, setIsActiveCounter] = useState(false);

  const [gameState, setGameState] = useState(GameState.NEW);
  const [pausedOnState, setPausedOnState] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [question, setQuestion] = useState('');
  const [lastQuestion, setLastQuestion] = useState(''); // Do we need this?
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [answerVector, setAnswerVector] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [scoreList, setScoreList] = useState([]);

  // const [paused, setPaused] = useState(null);

  // const toggle = () => {
  //   setIsActive(!isActive);
  // };

  const pauseToggle = () => {
    if ([GameState.PAUSED, GameState.QUESTION].indexOf(gameState) > -1) {
      if (gameState !== GameState.PAUSED) {
        pauseBackgroundAudio();
        setIsActiveCounter(!isActiveCounter);
        setPausedOnState(gameState);
        setGameState(GameState.PAUSED);
      } else {
        setIsActiveCounter(!isActiveCounter);
        unpauseBackgroundAudio();
        setGameState(pausedOnState as string);
        setPausedOnState('');
      }
    }
  };

  const xHat = <StaticMathField>{'\\hat{x}'}</StaticMathField>;
  const yHat = <StaticMathField>{'\\hat{y}'}</StaticMathField>;
  const iHat = <StaticMathField>{'\\hat{i}'}</StaticMathField>;
  const jHat = <StaticMathField>{'\\hat{j}'}</StaticMathField>;
  const vectorA = <StaticMathField>{'\\vec{A}'}</StaticMathField>;
  const vectorB = <StaticMathField>{'\\vec{B}'}</StaticMathField>;

  // const xHat = <RMathJax.Node inline formula={'\\hat{x}'} />
  // const yHat = <RMathJax.Node inline formula={'\\hat{y}'} />
  // const iHat = <RMathJax.Node inline formula={'\\hat{i}'} />
  // const jHat = <RMathJax.Node inline formula={'\\hat{j}'} />
  // const vectorA = <RMathJax.Node inline formula={'\\vec{A}'} />
  // const vectorB = <RMathJax.Node inline formula={'\\vec{B}'} />

  const resetCounter = () => {
    setSeconds(0);
    setIsActiveCounter(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isActiveCounter) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActiveCounter && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActiveCounter, seconds]);

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const gameOver = (vector: any, text: any) => {
    setGameState(GameState.GAME_OVER);
    setAnswerVector(vector);
    setAnswerText(text);
    stopBackgroundAudio();
    resetCounter();
    // window.onbeforeunload = null
  };

  const checkAnswer = (arrow: any) => {
    if (currentX === (arrow.getXComponent() || 0) && currentY === (arrow.getYComponent() || 0)) {
      playAudio('correct', 1);
      const newScore = score + 100;
      const newLevel = Math.floor(newScore / 400) + 1;
      if (newLevel > 4) {
        const newState = GameState.WON;
        stopBackgroundAudio();
        // clearInterval(this.timer);
        resetCounter();

        // set game state is won
        setGameState(newState);
        setScore(newScore);
        // this.setState({ state: newState, score: newScore });

        // axios
        api
          .post('/api/v1/courses/games/' + materialUuid + '/success', {
            duration: seconds,
            score: newScore,
          })
          .then(function(response) {
            console.log(response);
            console.log('TODO: setScoreList');
            // window.onbeforeunload = null;
            // setScoreList(response.data);
            setLevel(4);
            // this.setState({
            //   scoreList: response.data,
            //   level: newLevel,
            // });
          });
      } else {
        // this.setState(generateQuestion(newScore, newLevel));
        if (newLevel in [1, 2, 3, 4]) {
          questionToState(newScore, newLevel as 1 | 2 | 3 | 4);
        }
      }
    } else {
      playAudio('incorrect', 1);
      const pointer = {
        x: VectorCanvas.calcVectorXStart(currentX),
        y: VectorCanvas.calcVectorYStart(currentY),
      };
      const endPointer = {
        x: pointer['x'] + VectorCanvas.calcCanvasMagnitude(currentX),
        y: pointer['y'] - VectorCanvas.calcCanvasMagnitude(currentY),
      };
      const vector = new CanvasVector(null, pointer, 'green');
      vector.complete(endPointer);
      const textPoint = {
        left: endPointer.x - VectorCanvas.calcCanvasMagnitude(0.65) + currentX,
        top: endPointer.y - currentY - VectorCanvas.calcCanvasMagnitude(1),
      };
      const text = new CanvasText(null, textPoint, 'correct\nsolution');
      gameOver(vector, text);
    }
  };

  const generateQuestion = (newScore: number, newLevel: 1 | 2 | 3 | 4) => {
    let question;
    let x = 0,
      y = 0;
    newScore = newScore || score;
    newLevel = newLevel || level;
    do {
      x = y = 0;
      switch (newLevel) {
        case 1: {
          const char = [xHat, yHat, iHat, jHat][getRandomInt(0, 3)];
          const sign = ['', '-'][getRandomInt(0, 1)];
          if ([xHat, iHat].indexOf(char) >= 0) {
            x = sign == '' ? 1 : -1;
          } else {
            y = sign == '' ? 1 : -1;
          }
          question = (
            <span>
              {'Draw ' + sign}
              {char}
            </span>
          );
          break;
        }
        case 2: {
          const char = [xHat, yHat, iHat, jHat][getRandomInt(0, 3)];
          if ([xHat, iHat].indexOf(char) >= 0) {
            x = getRandomInt(-4, 4);
            question = (
              <span>
                {'Draw ' + x}
                {char}
              </span>
            );
          } else {
            y = getRandomInt(-4, 4);
            question = (
              <span>
                {'Draw ' + y}
                {char}
              </span>
            );
          }
          break;
        }
        case 3: {
          const chars = [
            [xHat, yHat],
            [iHat, jHat],
          ][getRandomInt(0, 1)];
          x = getRandomInt(-4, 4);
          y = getRandomInt(-4, 4);
          question = (
            <span>
              {'Draw ' + x}
              {chars[0]}
              {' + ' + y}
              {chars[1]}
            </span>
          );
          break;
        }
        case 4: {
          const chars = [
            [xHat, yHat],
            [iHat, jHat],
          ][getRandomInt(0, 1)];
          const sign = [' + ', ' - '][getRandomInt(0, 1)];
          const x1 = getRandomInt(-2, 2);
          const y1 = getRandomInt(-2, 2);
          const x2 = getRandomInt(-2, 2);
          const y2 = getRandomInt(-2, 2);
          x = sign == ' + ' ? x1 + x2 : x1 - x2;
          y = sign == ' + ' ? y1 + y2 : y1 - y2;
          const draw = (
            <span>
              {'Draw '}
              {vectorA}
              {sign}
              {vectorB}
            </span>
          );
          const vA = (
            <span>
              {vectorA}
              {' = ' + x1}
              {chars[0]}
              {' + ' + y1}
              {chars[1]}
            </span>
          );
          const vB = (
            <span>
              {vectorB}
              {' = ' + x2}
              {chars[0]}
              {' + ' + y2}
              {chars[1]}
            </span>
          );

          question = (
            <div>
              {draw}
              <br />
              {vA}
              <br />
              {vB}
            </div>
          );
          break;
        }
        default: {
          const char = ['x', 'y', 'i', 'j'][getRandomInt(0, 3)];
          if (['x', 'i'].indexOf(char) >= 0) {
            x = getRandomInt(-4, 4);
            question = 'Draw ' + x + char;
          } else {
            y = getRandomInt(-4, 4);
            question = 'Draw ' + y + char;
          }
          break;
        }
      }
      // Let's make sure we don't get the same question twice in a row.
    } while (currentX === x && currentY === y);
    // setLastQuestion(question);
    return {
      score: newScore,
      level: newLevel,
      question: question,
      currentX: x,
      currentY: y,
      gameState: GameState.QUESTION,
    };
  };

  const timesUp = () => {
    gameOver(null, null);
  };

  const questionToState = (newScore: number, newLevel: 1 | 2 | 3 | 4) => {
    const state = Object.assign(generateQuestion(newScore, newLevel), {
      currentX: 0,
      currentY: 0,
      score: 0,
      level: 1,
      question: '',
      answerVector: '',
      answerText: '',
      gameState: GameState.NEW,
    });
    setCurrentX(state.currentX);
    setCurrentY(state.currentY);
    setScore(state.score);
    setLevel(state.level);
    setQuestion(state.question);
    setAnswerVector(state.answerVector);
    setAnswerText(state.answerText);
    setGameState(state.gameState);
  };

  const restart = () => {
    resetCounter();
    setIsActiveCounter(true);
    questionToState(0, 1);
    // this.setState(state);
  };

  const start = () => {
    // if (!window.IS_MOBILE_APP) {
    //   window.onbeforeunload = function () {
    //     return 'Changes you made may not be saved.'
    //   }
    // }
    resetCounter();
    setIsActiveCounter(true);
    playBackgroundAudio('rainbow', 0.2);
    questionToState(0, 1);
    // setGameState()
    // this.setState(generateQuestion(null, null));
    // this.elapsed = 0;
    // this.timer = setInterval(this.tick.bind(this), 10);
  };

  return (
    <VectorGameBoard
      gameState={gameState}
      start={start}
      score={score}
      level={level}
      question={question}
      answerVector={answerVector}
      answerText={answerText}
      timesUp={timesUp}
      pause={pauseToggle}
      arrowComplete={checkAnswer}
      restart={restart}
      scoreList={scoreList}
    />
  );
};

export default VectorGame;

// export class VectorGame extends React.Component {
//   constructor () {
//     super()
//     this.elapsed = 0
//     this.timer = null
//     this.state = {
//       state: GameState.NEW,
//       pausedOnState: null,
//       score: 0,
//       level: 1,
//       // score: 1200, // start from a last level
//       // level: 4,
//       question: null,
//       x: null,
//       y: null,
//       answerVector: null,
//       paused: true
//     }
//   }
//
//   componentWillUnmount () {
//     window.onbeforeunload = null
//     clearInterval(this.timer)
//   }
//
//   // due https://github.com/pughpugh/react-countdown-clock/issues/28 create own timer
//   tick () {
//     if (this.state.state !== GameState.PAUSED) {
//       this.elapsed = this.elapsed + 10
//     }
//   }
//
//   getRandomInt (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min
//   }
//
//   timesUp (obj) {
//     this.gameOver()
//   }
//
//   pauseToggle () {
//     if ([GameState.PAUSED, GameState.QUESTION].indexOf(this.state.state) > -1) {
//       if (this.state.state !== GameState.PAUSED) {
//         pauseBackgroundAudio()
//         this.setState({state: GameState.PAUSED, pausedOnState: this.state.state})
//       } else {
//         unpauseBackgroundAudio()
//         this.setState({state: this.state.pausedOnState, pausedOnState: null})
//       }
//     }
//   }
//
//   checkAnswer (arrow) {
//     if (this.state.x === (arrow.getXComponent() || 0) &&
//       this.state.y === (arrow.getYComponent() || 0)) {
//       playAudio('correct')
//       var newScore = this.state.score + 100
//       var newLevel = Math.floor(newScore / 400) + 1
//       if (newLevel > 4) {
//         var newState = GameState.WON
//         stopBackgroundAudio()
//         clearInterval(this.timer)
//         // this.props.gameWon();
//         // axios.post('/api/v1/curricula/games/vector-game/success', {
//
//         // set game state is won
//         this.setState({state: newState,
//           score: newScore})
//         axios.post('/api/v1/curricula/games/' + this.props.uuid + '/success', {
//           duration: this.elapsed,
//           score: newScore
//         }).then(function (response) {
//           newLevel = 4
//           window.onbeforeunload = null
//           this.setState({
//             scoreList: response.data,
//             level: newLevel
//           })
//         }.bind(this))
//         // newLevel = 4;
//         // window.onbeforeunload = null;
//         // this.setState({score: newScore, level: newLevel, state: newState});
//       } else {
//         this.setState(this.generateQuestion(newScore, newLevel))
//       }
//     } else {
//       playAudio('incorrect')
//       var pointer = {
//         x: VectorCanvas.calcVectorXStart(this.state.x),
//         y: VectorCanvas.calcVectorYStart(this.state.y)
//       }
//       var endPointer = {
//         x: pointer['x'] + VectorCanvas.calcCanvasMagnitude(this.state.x),
//         y: pointer['y'] - VectorCanvas.calcCanvasMagnitude(this.state.y)
//       }
//       var vector = new CanvasVector(null, pointer, 'green')
//       vector.complete(endPointer)
//       var textPoint = {
//         left: endPointer.x - VectorCanvas.calcCanvasMagnitude(0.65) + this.state.x,
//         top: endPointer.y - this.state.y - VectorCanvas.calcCanvasMagnitude(1)
//       }
//       var text = new CanvasText(null, textPoint, 'correct\nsolution')
//       this.gameOver(vector, text)
//     }
//   }
//
//   generateQuestion (newScore, newLevel) {
//     var question
//     var x = 0, y = 0
//     newScore = newScore || this.state.score
//     newLevel = newLevel || this.state.level
//     do {
//       x = y = 0
//       switch (newLevel) {
//         case 1:
//           var char = [xHat, yHat, iHat, jHat][this.getRandomInt(0, 3)]
//           var sign = ['', '-'][this.getRandomInt(0, 1)]
//           if ([xHat, iHat].indexOf(char) >= 0) {
//             x = (sign == '') ? 1 : -1
//           } else {
//             y = (sign == '') ? 1 : -1
//           }
//           question = <span>{'Draw ' + sign}{char}</span>
//           break
//         case 2:
//           var char = [xHat, yHat, iHat, jHat][this.getRandomInt(0, 3)]
//           if ([xHat, iHat].indexOf(char) >= 0) {
//             x = this.getRandomInt(-4, 4)
//             question = <span>{'Draw ' + x}{char}</span>
//           } else {
//             y = this.getRandomInt(-4, 4)
//             question = <span>{'Draw ' + y}{char}</span>
//           }
//           break
//         case 3:
//           var chars = [[xHat, yHat], [iHat, jHat]][this.getRandomInt(0, 1)]
//           x = this.getRandomInt(-4, 4)
//           y = this.getRandomInt(-4, 4)
//           question = <span>{'Draw ' + x}{chars[0]}{' + ' + y}{chars[1]}</span>
//           break
//         case 4:
//           var chars = [[xHat, yHat], [iHat, jHat]][this.getRandomInt(0, 1)]
//           var sign = [' + ', ' - '][this.getRandomInt(0, 1)]
//           var x1 = this.getRandomInt(-2, 2)
//           var y1 = this.getRandomInt(-2, 2)
//           var x2 = this.getRandomInt(-2, 2)
//           var y2 = this.getRandomInt(-2, 2)
//           x = (sign == ' + ') ? x1 + x2 : x1 - x2
//           y = (sign == ' + ') ? y1 + y2 : y1 - y2
//           var draw = <span>{'Draw '}{vectorA}{sign}{vectorB}</span>
//           var vA = <span>{vectorA}{' = ' + x1}{chars[0]}{' + ' + y1}{chars[1]}</span>
//           var vB = <span>{vectorB}{' = ' + x2}{chars[0]}{' + ' + y2}{chars[1]}</span>
//
//           question = <div>{draw}<br />{vA}<br />{vB}</div>
//           break
//         default:
//           var char = ['x', 'y', 'i', 'j'][this.getRandomInt(0, 3)]
//           if (['x', 'i'].indexOf(char) >= 0) {
//             x = this.getRandomInt(-4, 4)
//             question = 'Draw ' + x + char
//           } else {
//             y = this.getRandomInt(-4, 4)
//             question = 'Draw ' + y + char
//           }
//           break
//       }
//       // Let's make sure we don't get the same question twice in a row.
//     } while (this.state.x === x && this.state.y === y)
//     this.lastQuestion = question
//     return {
//       score: newScore,
//       level: newLevel,
//       question: question,
//       x: x,
//       y: y,
//       state: GameState.QUESTION
//     }
//   }
//
//   gameOver (vector, text) {
//     this.setState({state: GameState.GAME_OVER, answerVector: vector, answerText: text})
//     stopBackgroundAudio()
//     clearInterval(this.timer)
//     window.onbeforeunload = null
//   }
//
//   restart () {
//     clearInterval(this.timer)
//
//     var state = Object.assign(
//       this.generateQuestion(),
//       {
//         score: 0,
//         level: 1,
//         answerVector: null,
//         answerText: null,
//         state: GameState.NEW
//       }
//     )
//     this.setState(state)
//   }
//
//   start () {
//     if (!window.IS_MOBILE_APP) {
//       window.onbeforeunload = function () {
//         return 'Changes you made may not be saved.'
//       }
//     }
//     playBackgroundAudio('rainbow', 0.2)
//     this.setState(this.generateQuestion())
//     this.elapsed = 0
//     this.timer = setInterval(this.tick.bind(this), 10)
//   }
//
//   render () {
//     return (
//       <VectorGameBoard
//         state={this.state.state}
//         start={this.start.bind(this)}
//         score={this.state.score}
//         level={this.state.level}
//         question={this.state.question}
//         answerVector={this.state.answerVector}
//         answerText={this.state.answerText}
//         timesUp={this.timesUp.bind(this)}
//         pause={this.pauseToggle.bind(this)}
//         arrowComplete={this.checkAnswer.bind(this)}
//         restart={this.restart.bind(this)}
//         scoreList={this.state.scoreList}
//       />
//     )
//   }
// }
