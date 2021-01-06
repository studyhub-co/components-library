import React, { useState, useEffect, useRef } from 'react';

import { addStyles, StaticMathField } from 'react-mathquill';

import { GameState } from '../constants';

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
// TODO create React hook for counter + HOC base game component

interface UnitConversionGameProps {
  // props
  materialUuid: string;
  moveToNextComponent(nextMaterialUuid: string | undefined): void;
}

const UnitConversionGame: React.FC<UnitConversionGameProps> = props => {
  const {
    // direct props
    materialUuid,
    moveToNextComponent,
  } = props;

  // counter
  // const [seconds, setSeconds] = useState(0);
  const centiSeconds = useRef(0);
  // const setSeconds = useCallback((value: number) => {
  //   seconds = value as number;
  // }, []);

  const [isActiveCounter, setIsActiveCounter] = useState(false); // it seem we don't use this

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

  const tickCentiSeconds = useCallback((value: number) => {
    centiSeconds.current = value as number;
  });

  const pauseToggle = () => {
    if ([GameState.PAUSED, GameState.QUESTION].indexOf(gameState) > -1) {
      if (gameState !== GameState.PAUSED) {
        pauseBackgroundAudio();
        setIsActiveCounter(false);
        setPausedOnState(gameState);
        setGameState(GameState.PAUSED);
      } else {
        // unpause
        setIsActiveCounter(true);
        unpauseBackgroundAudio();
        setGameState(pausedOnState as string);
        setPausedOnState('');
      }
    }
  };

  const resetCounter = () => {
    tickCentiSeconds(0);
    setIsActiveCounter(false);
  };

  const nextQuestion = adScore => {
    questionToState(score + adScore, level + 1);
  };

  useEffect(() => {
    let interval: any = null;
    if (isActiveCounter) {
      interval = setInterval(() => {
        if (gameState !== GameState.PAUSED) {
          tickCentiSeconds(centiSeconds.current + 1);
        }
      }, 10);
    } else if (!isActiveCounter && centiSeconds.current !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState, isActiveCounter, centiSeconds, tickCentiSeconds]);

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

  // const checkAnswer = (arrow: any) => {
  //   if (currentX === (arrow.getXComponent() || 0) && currentY === (arrow.getYComponent() || 0)) {
  //     playAudio('correct', 1);
  //     const newScore = score + 100;
  //     const newLevel = Math.floor(newScore / 400) + 1;
  //     if (newLevel > 4) {
  //       const newState = GameState.WON;
  //       stopBackgroundAudio();
  //       // clearInterval(this.timer);
  //       resetCounter();
  //
  //       // set game state is won
  //       setGameState(newState);
  //       setScore(newScore);
  //       // this.setState({ state: newState, score: newScore });
  //
  //       // axios
  //       api
  //         .post('courses/games/' + materialUuid + '/success', {
  //           duration: centiSeconds.current,
  //           score: newScore,
  //         })
  //         .then(function(response) {
  //           console.log(response);
  //           console.log('TODO: setScoreList');
  //           // window.onbeforeunload = null;
  //           // setScoreList(response.data);
  //           setLevel(4);
  //           // this.setState({
  //           //   scoreList: response.data,
  //           //   level: newLevel,
  //           // });
  //         });
  //     } else {
  //       // this.setState(generateQuestion(newScore, newLevel));
  //       if (newLevel in [1, 2, 3, 4]) {
  //         questionToState(newScore, newLevel as 1 | 2 | 3 | 4);
  //       }
  //     }
  //   } else {
  //     playAudio('incorrect', 1);
  //     const pointer = {
  //       x: VectorCanvas.calcVectorXStart(currentX),
  //       y: VectorCanvas.calcVectorYStart(currentY),
  //     };
  //     const endPointer = {
  //       x: pointer['x'] + VectorCanvas.calcCanvasMagnitude(currentX),
  //       y: pointer['y'] - VectorCanvas.calcCanvasMagnitude(currentY),
  //     };
  //     const vector = new CanvasVector(null, pointer, 'green');
  //     vector.complete(endPointer);
  //     const textPoint = {
  //       left: endPointer.x - VectorCanvas.calcCanvasMagnitude(0.65) + currentX,
  //       top: endPointer.y - currentY - VectorCanvas.calcCanvasMagnitude(1),
  //     };
  //     const text = new CanvasText(null, textPoint, 'correct\nsolution');
  //     gameOver(vector, text);
  //   }
  // };

  const getRandomFromArray = myArray => {
    return myArray[Math.floor(Math.random() * myArray.length)];
  };

  const getRandomNumber = () => {
    const arrayRandoms = [(Math.random() * 10000).toFixed(2), Math.random().toFixed(3)];
    const toReturn = getRandomFromArray(arrayRandoms); // return random 1-9999 or 0.0000-0.9999
    return Number(toReturn) === 0 ? 1 : toReturn; // if number is 0, return 1
  };

  // TODO why we do not have checkAnswer?
  const generateQuestion = (newScore: number, newLevel: 1 | 2 | 3 | 4) => {
    const number = getRandomNumber();
    let unit, unitLong;

    newScore = newScore || score;
    newLevel = newLevel || level;

    if (newLevel === 1) {
      unit = getRandomFromArray(Object.keys(UNITS.DISTANCE));
      unitLong = UNITS.DISTANCE[unit];
    } else if (newLevel === 2) {
      unit = getRandomFromArray(Object.keys(UNITS.TIME));
      unitLong = UNITS.TIME[unit];
    } else if (newLevel === 3) {
      unit = getRandomFromArray(Object.keys(UNITS.MASS));
      unitLong = UNITS.MASS[unit];
    } else if (newLevel === 4) {
      unit = getRandomFromArray(Object.keys(UNITS.SPEED));
      unitLong = UNITS.SPEED[unit];
    } else if (newLevel === 5) {
      let INPUT_UNITS = [];

      Object.getOwnPropertyNames(UNITS)
        .map(key => [key, Object.getOwnPropertyDescriptor(UNITS, key)])
        .filter(([key, descriptor]) => typeof descriptor.get === 'function')
        .map(([key]) => key)
        .forEach(function(key) {
          INPUT_UNITS = INPUT_UNITS.concat(key);
        });

      const unitType = this.getRandomFromArray(INPUT_UNITS);
      unit = this.getRandomFromArray(Object.keys(UNITS[unitType]));
      unitLong = UNITS[unitType][unit];
    }

    if (newLevel > 5) {
      stopBackgroundAudio();
      // TODO add more secure, i.e. server token when game starts, etc
      clearInterval(this.timer);
      api
        .post(`/api/v1/curricula/games/${materialUuid}/success`, {
          duration: centiSeconds.current,
          score: newScore,
        })
        .then(function(response) {
          console.log(response);
          console.log('TODO: setScoreList');
          //   this.setState({
          //     scoreList: response.data,
          //   });
          // }.bind(this),
        });
      // window.onbeforeunload = null;
      return { score: newScore, state: GameState.WON };
    }

    const question = <span>{'Convert ' + number.toString() + ' ' + unitLong + ' to SI units.'}</span>;
    //   // Let's make sure we don't get the same question twice in a row.
    // } while (this.state.unit === unit && this.state.number === number)
    this.lastQuestion = question;
    return {
      score: newScore,
      level: newLevel,
      question: question,
      number: number,
      unit: unit,
      state: GameState.QUESTION,
    };
  };

  const timesUp = () => {
    gameOver(null, null);
  };

  const questionToState = (newScore: number, newLevel: 1 | 2 | 3 | 4) => {
    const state = Object.assign(
      {
        currentX: 0,
        currentY: 0,
        score: 0,
        level: 1,
        question: '',
        answerVector: '',
        answerText: '',
        gameState: GameState.NEW,
      },
      generateQuestion(newScore, newLevel),
    );

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
    // questionToState(1500, 4);
    // setGameState() // set in questionToState
  };

  return (
    <UnitConversionGameBoard
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
      clockSeconds={120}
      moveToNextComponent={() => moveToNextComponent(materialUuid)}
    />
  );
};

export default UnitConversionGame;

// export class UnitConversionGame extends React.Component {
//   constructor () {
//     super()
//     this.elapsed = 0
//     this.timer = null
//     this.timesUp = this.timesUp.bind(this)
//     this.start = this.start.bind(this)
//     this.pauseToggle = this.pauseToggle.bind(this)
//     this.generateQuestion = this.generateQuestion.bind(this)
//     this.nextQuestion = this.nextQuestion.bind(this)
//     this.restart = this.restart.bind(this)
//     this.gameOver = this.gameOver.bind(this)
//     this.state = {
//       state: GameState.NEW,
//       pausedOnState: null,
//       score: 0,
//       // level: 4,
//       level: 1,
//       question: null,
//       unit: null,
//       number: null,
//       answer: null,
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
//   getRandomFromArray (myArray) {
//     return myArray[Math.floor(Math.random() * myArray.length)]
//   }
//
//   getRandomNumber () {
//     var arrayRandoms = [(Math.random() * 10000).toFixed(2), (Math.random()).toFixed(3)]
//     var toReturn = this.getRandomFromArray(arrayRandoms) // return random 1-9999 or 0.0000-0.9999
//     return Number(toReturn) === 0 ? 1 : toReturn // if number is 0, return 1
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
//   nextQuestion (adScore) {
//     this.setState(this.generateQuestion(this.state.score + adScore, this.state.level + 1))
//   }
//
//   generateQuestion (newScore, newLevel) {
//     var number = this.getRandomNumber()
//     var unit, unitLong
//
//     newScore = newScore || this.state.score
//     newLevel = newLevel || this.state.level
//
//     if (newLevel === 1) {
//       unit = this.getRandomFromArray(Object.keys(UNITS.DISTANCE))
//       unitLong = UNITS.DISTANCE[unit]
//     } else if (newLevel === 2) {
//       unit = this.getRandomFromArray(Object.keys(UNITS.TIME))
//       unitLong = UNITS.TIME[unit]
//     } else if (newLevel === 3) {
//       unit = this.getRandomFromArray(Object.keys(UNITS.MASS))
//       unitLong = UNITS.MASS[unit]
//     } else if (newLevel === 4) {
//       unit = this.getRandomFromArray(Object.keys(UNITS.SPEED))
//       unitLong = UNITS.SPEED[unit]
//     } else if (newLevel === 5) {
//       var INPUT_UNITS = []
//
//       Object.getOwnPropertyNames(UNITS)
//         .map(key => [key, Object.getOwnPropertyDescriptor(UNITS, key)])
//         .filter(([key, descriptor]) => typeof descriptor.get === 'function')
//         .map(([key]) => key).forEach(function (key) {
//         INPUT_UNITS = INPUT_UNITS.concat(key)
//       })
//
//       var unitType = this.getRandomFromArray(INPUT_UNITS)
//       unit = this.getRandomFromArray(Object.keys(UNITS[unitType]))
//       unitLong = UNITS[unitType][unit]
//     }
//
//     if (newLevel > 5) {
//       stopBackgroundAudio()
//       // TODO add more secure, i.e. server token when game starts, etc
//       // TODO move it to games.jsx (replace jQuery), remove ajaxSetup from main page
//       clearInterval(this.timer)
//       // axios.post('/api/v1/curricula/games/unit-conversion/success', {
//       axios.post('/api/v1/curricula/games/' + this.props.uuid + '/success', {
//         duration: this.elapsed,
//         score: newScore
//       }).then(function (response) {
//         this.setState({
//           scoreList: response.data
//         })
//       }.bind(this))
//       window.onbeforeunload = null
//       return {score: newScore, state: GameState.WON}
//     }
//
//     var question = <span>{'Convert ' + number.toString() + ' ' + unitLong + ' to SI units.'}</span>
//     //   // Let's make sure we don't get the same question twice in a row.
//     // } while (this.state.unit === unit && this.state.number === number)
//     this.lastQuestion = question
//     return {
//       score: newScore,
//       level: newLevel,
//       question: question,
//       number: number,
//       unit: unit,
//       state: GameState.QUESTION
//     }
//   }
//
//   gameOver () {
//     this.setState({state: GameState.GAME_OVER})
//     stopBackgroundAudio()
//     clearInterval(this.timer)
//     window.onbeforeunload = null
//   }
//
//   restart () {
//     clearInterval(this.timer)
//     this.timer = setInterval(this.tick.bind(this), 10)
//
//     var state = Object.assign(
//       this.generateQuestion(),
//       {
//         score: 0,
//         level: 1,
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
//       <UnitConversionGameBoard
//         state={this.state.state}
//         start={this.start}
//         score={this.state.score}
//         level={this.state.level}
//         number={this.state.number}
//         unit={this.state.unit}
//         question={this.state.question}
//         timesUp={this.timesUp}
//         pause={this.pauseToggle}
//         gameOver={this.gameOver}
//         nextQuestion={this.nextQuestion}
//         restart={this.restart}
//         scoreList={this.state.scoreList}
//       />
//     )
//   }
// }