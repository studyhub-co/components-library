import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import ScoreBoard from '../scoreBoard';
import { GameState } from '../constants';
import UnitConversionQuestionBoard from './unitConversionQuestionBoard';

import '../style.css';
import Button from '@material-ui/core/Button';

import { ILevel } from './index';

interface UnitConversionGameBoardProps {
  // props
  number: string;
  unit: string;
  nextQuestion: (adScore: number) => void;
  gameState: string;
  start: () => void;
  gameOver: (number: any, unit: any) => void;
  conversionSessionHash: string;
  score: number;
  level: ILevel;
  question: string;
  timesUp: () => void;
  pause: () => void;
  restart: () => void;
  scoreList: any;
  moveToNextComponent(): void;
  clockKey: number;
}

const UnitConversionGameBoard: React.FC<UnitConversionGameBoardProps> = props => {
  const {
    // direct props
    gameState,
    gameOver,
    level,
    score,
    question,
    nextQuestion,
    number,
    unit,
    scoreList,
    start,
    restart,
    timesUp,
    clockKey,
    pause,
    moveToNextComponent,
    conversionSessionHash: csh,
  } = props;

  const levelColorMap = {
    1: '#ffffff',
    2: '#c9bfff',
    3: '#caffe5',
    4: '#ffffaa',
    5: '#ffd8b2',
    6: '#ffffff', // scoreboard
  };

  useEffect(() => {
    if (gameState === GameState.NEW) {
      document?.getElementById('start')?.focus();
    }
  }, [gameState]);

  const clockSeconds = 600;
  const style = { backgroundColor: levelColorMap[level] };

  switch (
    gameState // TODO this is ugly - we need to move 'switch' into Grid container at least to exclude unnecessary rerendering
  ) {
    case GameState.NEW:
      return (
        <Grid container justifyContent="center" className="game-sheet" style={style}>
          <Grid item md={4} className={'text-center'}>
            <span>
              <h2 className="game-title">Unit Conversion Game</h2>
            </span>
            <p>
              <span>Beat a score of 2500 to unlock the next lesson. Wrong answers end the game.</span>
            </p>
            <Button className="hover-button" color="primary" variant="contained" onClick={start}>
              Start
            </Button>
          </Grid>
        </Grid>
      );
    case GameState.PAUSED:
      return (
        <Grid container justifyContent="center" className="game-sheet" style={style}>
          {/*<Prompt when={state === GameState.QUESTION} message="Changes you made may not be saved." />*/}
          <ScoreBoard
            gameState={gameState}
            score={score}
            clockKey={clockKey}
            level={level}
            timesUp={timesUp}
            pause={pause}
            restart={restart}
            clockSeconds={clockSeconds}
            moveToNextComponent={moveToNextComponent}
          />
          <div>
            <div>
              <h2>Unit Conversion Game</h2>
            </div>
            <div>
              <h1>PAUSED</h1>
            </div>
          </div>
        </Grid>
      );
  }
  return (
    <Grid container justifyContent="center" className="game-sheet" style={style}>
      {/*<Prompt when={state === GameState.QUESTION} message="Changes you made may not be saved." />*/}
      <ScoreBoard
        gameState={gameState}
        score={score}
        level={level}
        timesUp={timesUp}
        pause={pause}
        restart={restart}
        clockKey={clockKey}
        clockSeconds={clockSeconds}
        moveToNextComponent={moveToNextComponent}
      />
      {gameState !== GameState.WON ? (
        <Grid item xs={12}>
          <UnitConversionQuestionBoard
            number={number}
            unit={unit}
            question={question}
            clear={[GameState.NEW, GameState.QUESTION].indexOf(gameState) >= 0}
            gameState={gameState}
            gameOver={gameOver}
            level={level}
            conversionSessionHash={csh}
            nextQuestion={nextQuestion}
          />
        </Grid>
      ) : (
        <div className="text-center">
          <h4>High Score List</h4>
          <table style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <tbody>
              <tr>
                <th style={{ padding: 5 }} />
                <th style={{ padding: 5 }}>Name</th>
                <th style={{ padding: 5 }}>Completion Time</th>
              </tr>
              {scoreList
                ? scoreList.map(function(score: any, i: number) {
                    return (
                      <tr key={i}>
                        <td style={{ padding: 5 }}>{score.row_num}</td>
                        <td style={{ padding: 5 }}>{score.profile ? score.profile : 'Anonymous'}</td>
                        <td style={{ padding: 5 }}>{score.duration}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      )}
    </Grid>
  );
};

export default UnitConversionGameBoard;
