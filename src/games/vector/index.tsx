import React, { useState, useEffect, useRef } from 'react';

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

interface VectorGameProps {
  // props
  materialUuid: string;
  moveToNextComponent(nextMaterialUuid: string | undefined): void;
}

const VectorGame: React.FC<VectorGameProps> = props => {
  const {
    // direct props
    materialUuid,
    moveToNextComponent,
  } = props;

  // counter
  const centiSeconds = useRef(0);
  // const setSeconds = useCallback((value: number) => {
  //   seconds = value as number;
  // }, []);

  const reactionStart = useRef(new Date());

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

  const tickCentiSeconds = (value: number) => {
    centiSeconds.current = value as number;
  };

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
    tickCentiSeconds(0);
    setIsActiveCounter(false);
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

  const checkAnswer = (arrow: any) => {
    if (currentX === (arrow.getXComponent() || 0) && currentY === (arrow.getYComponent() || 0)) {
      playAudio('correct', 1);
      const newScore = score + 100;
      const newLevel = Math.floor(newScore / 400) + 1;
      if (newLevel > 4) {
        const newState = GameState.WON;
        stopBackgroundAudio();
        // clearInterval(this.timer);

        // set game state is won
        setGameState(newState);
        setScore(newScore);
        // this.setState({ state: newState, score: newScore });

        // axios
        api
          .post('courses/materials/' + materialUuid + '/reaction/?materialScoreboard=true', {
            /* eslint-disable @typescript-eslint/camelcase */
            reaction_start_on: reactionStart.current.toISOString(),
            /* eslint-disable @typescript-eslint/camelcase */
            reacted_on: new Date().toISOString(),
            duration: centiSeconds.current,
            score: newScore,
            data: {}, // TODO do we need to save data of a game process?
          })
          .then(function(response: any) {
            // console.log(response);
            // window.onbeforeunload = null;
            setScoreList(response.material_scoreboard);
            // setLevel(4); // todo we need this?
            // this.setState({
            //   scoreList: response.data,
            //   level: newLevel,
            // });
          });
        resetCounter();
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
    // questionToState(1500, 4); // start last level
    // setGameState() // set in questionToState
  };

  console.log(scoreList);

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
      clockSeconds={120}
      moveToNextComponent={() => moveToNextComponent(materialUuid)}
    />
  );
};

export default VectorGame;
