import React, { useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addStyles } from 'react-mathquill';

// this will add jQuery to window
import '../../components/unitConversion/components/mathquill-loader';
// this will add MathQuill to window
// import * as MathQuill from '@edtr-io/mathquill/build/mathquill.js';
import * as MathQuill from '@edtr-io/mathquill';

import { GameState } from '../constants';
import UnitConversionGameBoard from './unitConversionGameBoard';

import apiFactory, { Api } from '../../redux/modules/apiFactory';

import { UNITS, getInputUnits } from '../../components/unitConversion/components/useUnitConversionBase';

import {
  stopBackgroundAudio,
  pauseBackgroundAudio,
  unpauseBackgroundAudio,
  playBackgroundAudio,
} from '../../utils/sounds';

import * as materialActionCreators from '../../redux/modules/material';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

addStyles(); // react-mathquill styles

const BACKEND_SERVER_API_URL = process.env['NODE_ENV'] === 'development' ? 'http://127.0.0.1:8000/api/v1/' : '/api/v1/';

const api: Api = apiFactory(BACKEND_SERVER_API_URL);

// TODO create function in  ../../components/unitConversion/components/base to get this value
// let INPUT_UNITS = ['s', 'm', 'kg', 'm/s'];
// Object.getOwnPropertyNames(UNITS)
//   .map(key => [key, Object.getOwnPropertyDescriptor(UNITS, key)])
//   .filter(([key, descriptor]) => typeof descriptor.get === 'function')
//   .map(([key]) => key)
//   .forEach(function(key) {
//     INPUT_UNITS = INPUT_UNITS.concat(Object.keys(UNITS[key]));
//   });

// const INPUT_UNITS = getInputUnits();

// TODO replace :any with correct types
// TODO create React hook for counter + HOC base game component
// TODO replace cross app variables with useReducer

interface UnitConversionGameProps {
  // props
  materialUuid: string;
  moveToNextComponent(nextMaterialUuid: string | undefined): void;
  lessonUuid: string | undefined;
  // redux store
  currentMaterial: materialActionCreators.MaterialRedux;
  // redux actions
  fetchMaterialStudentView(lessonUuid: string | undefined, materialUuid: string | undefined): void;
}

// number of levels
export type ILevel = 1 | 2 | 3 | 4 | 5 | 6;

const UnitConversionGame: React.FC<UnitConversionGameProps> = props => {
  const {
    // direct props
    materialUuid,
    moveToNextComponent,
    lessonUuid,
    // redux store
    currentMaterial,
    // actions
    fetchMaterialStudentView,
  } = props;

  // counter
  // const [seconds, setSeconds] = useState(0);
  const centiSeconds = useRef(0);
  // const setSeconds = useCallback((value: number) => {
  //   seconds = value as number;
  // }, []);

  const [clockKey, setClockKey] = useState(1);

  const [isActiveCounter, setIsActiveCounter] = useState(false); // it seem we don't use this

  const [gameState, setGameState] = useState(GameState.NEW);
  const [pausedOnState, setPausedOnState] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<ILevel>(1);
  const [question, setQuestion] = useState('');
  // const [lastQuestion, setLastQuestion] = useState(''); // Do we need this?
  const [nextMaterialUuid, setNextMaterialUuid] = useState('');
  const [unit, setUnit] = useState('');
  const [number, setNumber] = useState('');
  const [scoreList, setScoreList] = useState([]);

  const reactionStart = useRef(new Date());

  // hash that uses in conversion table html ids, to allow reuse this hook on the same web page several times
  const conversionSessionHash = useRef(Math.floor(Math.random() * (9999999999 - 1111111111) + 1111111111));
  const csh = conversionSessionHash.current.toString();

  // do not use useCallback here
  const tickCentiSeconds = (value: number) => {
    centiSeconds.current = value as number;
  };

  useEffect(() => {
    // replace with useFetchMaterial if wi will have edit mode in the future: src/components/hooks/fetchMaterial.tsx
    // get new material
    fetchMaterialStudentView(lessonUuid, materialUuid);
  }, [materialUuid]);

  // send current material to parent window
  useEffect(() => {
    if (currentMaterial.isFetching === false && currentMaterial.uuid) {
      // send message to parent with loaded material
      window.parent.postMessage(
        {
          type: 'current_material',
          data: currentMaterial,
        },
        '*',
      );
    }
  }, [currentMaterial, lessonUuid]);

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
    setClockKey(clockKey + 1); // redraw count down clock with default clock seconds value
    setIsActiveCounter(false);
  };

  const nextQuestion = (adScore: number) => {
    questionToState(score + adScore, (level + 1) as ILevel);
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

  const gameOver = (number: any, unit: any) => {
    setGameState(GameState.GAME_OVER);
    // setNumber(number);
    // setUnit(unit);
    stopBackgroundAudio();
    resetCounter();
    // window.onbeforeunload = null
  };

  const getRandomFromArray = (myArray: any) => {
    return myArray[Math.floor(Math.random() * myArray.length)];
  };

  const getRandomNumber = () => {
    const arrayRandoms = [(Math.random() * 10000).toFixed(2), Math.random().toFixed(3)];
    const toReturn = getRandomFromArray(arrayRandoms); // return random 1-9999 or 0.0000-0.9999
    return Number(toReturn) === 0 ? 1 : toReturn; // if number is 0, return 1
  };

  // TODO why we do not have checkAnswer?
  const generateQuestion = (newScore: number, newLevel: 1 | 2 | 3 | 4 | 5 | 6) => {
    const number = getRandomNumber();
    let unit = '',
      unitLong = '';

    // newScore = newScore || score; // we can't reset score here, fixme: remove?
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
      const INPUT_UNITS_WO_SI = getInputUnits(true);
      unit = getRandomFromArray(INPUT_UNITS_WO_SI) as string;
      unitLong = '';
      for (const unitTypeKey in UNITS) {
        const unitType = UNITS[unitTypeKey];
        for (const unitKey in unitType) {
          if (unit === unitKey) {
            unitLong = unitType[unitKey];
          }
        }
      }
    }

    if (newLevel > 5) {
      // fixme not so good when we have 6 level as scoreboard
      stopBackgroundAudio();
      // TODO add more secure, i.e. server token when game starts, etc
      // clearInterval(this.timer);

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
          setScoreList(response.material_scoreboard);
          setNextMaterialUuid(response.next_material_uuid);
        });
      resetCounter();
      // window.onbeforeunload = null;
      return { score: newScore, gameState: GameState.WON };
    }

    const question = <span>{'Convert ' + number.toString() + ' ' + unitLong + ' to SI units.'}</span>;
    //   // Let's make sure we don't get the same question twice in a row.
    // } while (this.state.unit === unit && this.state.number === number)
    // this.lastQuestion = question; TODO what is this?
    return {
      score: newScore,
      level: newLevel,
      question: question,
      number: number,
      unit: unit,
      gameState: GameState.QUESTION,
    };
  };

  const timesUp = () => {
    gameOver(null, null);
  };

  const questionToState = (newScore: number, newLevel: 1 | 2 | 3 | 4 | 5 | 6) => {
    const state = Object.assign(
      {
        score: 0,
        level: 1,
        question: '',
        unit: '',
        number: '',
        gameState: GameState.NEW,
      },
      generateQuestion(newScore, newLevel),
    );

    setScore(state.score);
    setLevel(state.level as 1 | 2 | 3 | 4 | 5 | 6);
    setQuestion(state.question);
    setUnit(state.unit);
    setNumber(state.number);
    setGameState(state.gameState);
  };

  const restart = () => {
    resetCounter();
    setGameState(GameState.NEW);
    setIsActiveCounter(true);
    playBackgroundAudio('rainbow', 0.2);
    questionToState(0, 1);
    // setLevel(1);
    // setIsActiveCounter(true);
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
    // questionToState(2000, 5); // start from last level
    // setGameState() // set in questionToState
  };

  return (
    <UnitConversionGameBoard
      number={number}
      unit={unit}
      gameOver={gameOver}
      nextQuestion={nextQuestion}
      gameState={gameState}
      start={start}
      score={score}
      level={level}
      question={question}
      clockKey={clockKey}
      timesUp={timesUp}
      pause={pauseToggle}
      restart={restart}
      conversionSessionHash={csh}
      scoreList={scoreList}
      moveToNextComponent={() => moveToNextComponent(nextMaterialUuid)}
    />
  );
};

// export default UnitConversionGame;

// connect redux
export default connect(
  (state: any) => {
    return { currentMaterial: state.material, userMaterialReactionResult: state.userMaterialReactionResult };
  },
  dispatch => bindActionCreators({ ...materialActionCreators, ...userMaterialReactionCreators }, dispatch),
)(UnitConversionGame);
