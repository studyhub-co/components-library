import React, { useEffect, useState } from 'react';

import ReactCountdownClock from 'react-countdown-clock';
// import MediaQuery from 'react-responsive';
import Grid from '@material-ui/core/Grid';

import { GameState } from './constants';
import Button from '@material-ui/core/Button';

interface ScoreBoardProps {
  // props
  gameState: string;
  // level: 1 | 2 | 3 | 4;
  level: number; // we want have any number of levels
  score: number;
  restart: () => void;
  timesUp: () => void;
  pause: () => void;
  moveToNextComponent(): void;
  clockSeconds?: number;
  clockKey: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = props => {
  const {
    // direct props
    gameState,
    restart,
    score,
    level,
    timesUp,
    pause,
    moveToNextComponent,
    clockSeconds,
    clockKey, // refresh key to recreate countdown clock
  } = props;

  let seconds;

  if (!clockSeconds) {
    seconds = 120;
  } else {
    seconds = clockSeconds;
  }

  let scorePanel;
  let paused;

  // const [clockKey, setClockKey] = useState(clockKey);
  // const [didReset, setDidReset] = useState(false);

  // useEffect(() => {
  //   if (gameState === GameState.NEW && !didReset) {
  //     setClockKey(clockKey + 1);
  //     setDidReset(true);
  //   }
  //   if (gameState !== GameState.NEW && didReset) {
  //     setDidReset(false);
  //   }
  // }, [clockKey, didReset, gameState]); // what we need to catch? TODO

  // TODO too much duplicate code!

  switch (gameState) {
    case GameState.GAME_OVER:
      paused = true;
      scorePanel = (
        <Grid item md={4}>
          <h1 className="TwCenMT">Game Over!</h1>
          <Button color="primary" variant="contained" onClick={restart} style={{ margin: '1rem' }}>
            Try Again
          </Button>
          <Button
            style={{ margin: '1rem' }}
            color="primary"
            variant="contained"
            onClick={() => {
              // TODO! we do not have next material uuid here!
              /* handleContinueClick see src/components/common/checkContinueButton.tsx for details */
              moveToNextComponent();
            }}
          >
            Skip
          </Button>
        </Grid>
      );
      break;
    case GameState.WON:
      paused = true;
      scorePanel = (
        <Grid item md={5}>
          <h2 className="TwCenMT">Score: {score}</h2>
          <h1 className="TwCenMT">You Won!</h1>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              /* handleContinueClick see src/components/common/checkContinueButton.tsx for details */
              moveToNextComponent();
            }}
          >
            Continue
          </Button>
        </Grid>
      );
      break;
    case GameState.PAUSED:
      paused = true;
      scorePanel = (
        <Grid container item md={2} sm={2} xs={5} lg={1}>
          {/*<Grid container>*/}
          {/*<Grid container>*/}
          {/*<MediaQuery minDeviceWidth={736}>*/}
          <Grid item xs={12}>
            <h3 className="TwCenMT">Score: {score}</h3>
          </Grid>
          <Grid item xs={12}>
            <h3 className="TwCenMT">Level: {level}</h3>
          </Grid>
          {/*</MediaQuery>*/}
          {/*<MediaQuery maxDeviceWidth={736}>*/}
          {/*  <Grid item md={6}>*/}
          {/*    <h4 className="TwCenMT text-center">Score: {score}</h4>*/}
          {/*    <h4 className="TwCenMT text-center">Level: {level}</h4>*/}
          {/*  </Grid>*/}
          {/*</MediaQuery>*/}
          {/*</Grid>*/}
        </Grid>
      );
      break;
    default:
      paused = false;
      scorePanel = (
        <Grid container item md={2} sm={2} xs={5} lg={1}>
          {/*<MediaQuery minDeviceWidth={736}>*/}
          {/*<Grid container>*/}
          <Grid item xs={12}>
            {/* fixme TwCenMT font family. */}
            <h3 className="TwCenMT">Score: {score}</h3>
          </Grid>
          <Grid item xs={12}>
            <h3 className="TwCenMT">Level: {level}</h3>
          </Grid>
          {/*</Grid>*/}
        </Grid>
      );
  }
  const clockStyle = {
    // height: 100,
    // width: 100,
    // top: '50%',
    // left: '50%',
    // display: 'block',
    // marginLeft: -100,
    // position: 'relative' as 'relative',
    cursor: 'pointer',
  } as React.CSSProperties;
  // const smallClockStyle = {
  //   height: 50,
  //   width: 50,
  //   top: '50%',
  //   left: '50%',
  //   display: 'block',
  //   marginLeft: -50,
  //   position: 'relative',
  // } as React.CSSProperties;
  return (
    <Grid container item justify="center">
      <Grid item md={2} sm={2} xs={5} lg={1}>
        {/*<MediaQuery minDeviceWidth={736}>*/}
        <div style={clockStyle} onClick={pause}>
          <ReactCountdownClock
            key={clockKey}
            seconds={seconds}
            color="#1baff6"
            alpha={0.9}
            size={100}
            weight={10}
            paused={paused}
            onComplete={timesUp}
          />
        </div>
        {/*</MediaQuery>*/}
        {/*<MediaQuery maxDeviceWidth={736}>*/}
        {/*<div style={smallClockStyle} onClick={pause}>*/}
        {/*  <ReactCountdownClock*/}
        {/*    key={clockKey}*/}
        {/*    seconds={seconds}*/}
        {/*    color="#1baff6"*/}
        {/*    alpha={0.9}*/}
        {/*    size={50}*/}
        {/*    weight={10}*/}
        {/*    paused={paused}*/}
        {/*    onComplete={timesUp}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*</MediaQuery>*/}
      </Grid>
      {scorePanel}
    </Grid>
  );
};

export default ScoreBoard;

// export class ScoreBoard extends React.Component {
//   constructor () {
//     super()
//     this.state = {
//       clockKey: 1,
//       didReset: false
//     }
//   }
//
//   componentDidUpdate () {
//     // This is some hackery that I'm not too happy about. I don't seem to
//     // have access to the underlying clock to tell it to reset when I
//     // want...so I have to force it by giving it a new `key`. But to know
//     // when to reset, there is additional juggling that has to be done
//     // here.
//
//     if (this.props.state == GameState.NEW && !this.state.didReset) {
//       this.setState({clockKey: this.state.clockKey + 1, didReset: true})
//     }
//     if (this.props.state != GameState.NEW && this.state.didReset) {
//       this.setState({didReset: false})
//     }
//   }
//
//   render () {
//     var score
//     var paused
//     switch (this.props.state) {
//       case GameState.GAME_OVER:
//         paused = true
//         score = (
//           <div className='col-md-4'>
//             <h1 className='TwCenMT'>Game Over!</h1>
//             <button id='tryAgain' className='hover-button' onClick={this.props.restart}>Try Again</button>
//             <button className='hover-button'><Link to={'/'}>Exit</Link></button>
//           </div>
//         )
//         break
//       case GameState.WON:
//         paused = true
//         score = (
//           <div className='col-md-4'>
//             <h2 className='TwCenMT'>Score: {this.props.score}</h2>
//             <h1 className='TwCenMT'>You Won!</h1>
//             <button className='hover-button'><Link to={'/'}>Continue</Link></button>
//           </div>
//         )
//         break
//       case GameState.PAUSED:
//         paused = true
//         score = (
//           <div>
//             <MediaQuery minDeviceWidth={736}>
//               <div className='col-md-3 align-left'>
//                 <h2 className='TwCenMT'>Score: {this.props.score}</h2>
//               </div>
//               <div className='col-md-3 align-left'>
//                 <h2 className='TwCenMT'>Level: {this.props.level}</h2>
//               </div>
//             </MediaQuery>
//             <MediaQuery maxDeviceWidth={736}>
//               <div className='col-md-3'>
//                 <h4 className='TwCenMT text-center'>Score: {this.props.score}</h4>
//                 <h4 className='TwCenMT text-center'>Level: {this.props.level}</h4>
//               </div>
//             </MediaQuery>
//           </div>
//         )
//         break
//       default:
//         paused = false
//         score = (
//           <div className='col-md-8'>
//             <div className='row'>
//               {/*<MediaQuery minDeviceWidth={736}>*/}
//               {/* no MediaQuery need to work with bootram sizes*/}
//               {/*!!!!!!!!!! In a grid layout, content must be placed
//             within columns and only columns may be immediate children of rows. !!!!!!!!!!!*/}
//               <div className='col-md-6 col-xs-12 align-left'>
//                 <h2 className='TwCenMT'>Score: {this.props.score}</h2>
//               </div>
//               <div className='col-md-6 col-xs-12 align-left'>
//                 <h2 className='TwCenMT'>Level: {this.props.level}</h2>
//               </div>
//             </div>
//             {/*</MediaQuery>*/}
//             {/*<MediaQuery maxDeviceWidth={736}>*/}
//             {/*<div className='col-md-3 text-center'>*/}
//             {/*<h4 className='TwCenMT'>Score: {this.props.score} Level: {this.props.level}</h4>*/}
//             {/*</div>*/}
//             {/*</MediaQuery>*/}
//           </div>
//         )
//     }
//     var clockStyle = {
//       height: 100,
//       width: 100,
//       top: '50%',
//       left: '50%',
//       display: 'block',
//       marginLeft: -100,
//       position: 'relative',
//       cursor: 'pointer'
//     }
//     var smallClockStyle = {
//       height: 50,
//       width: 50,
//       top: '50%',
//       left: '50%',
//       display: 'block',
//       marginLeft: -50,
//       position: 'relative'
//     }
//     return (
//       <div className='row text-center'>
//         <div className='col-md-2' />
//         <div className='col-md-2 text-center'>
//           <MediaQuery minDeviceWidth={736}>
//             <div style={clockStyle}>
//               <ReactCountdownClock
//                 key={this.state.clockKey}
//                 seconds={this.props.clockSeconds}
//                 color='#1baff6'
//                 alpha={0.9}
//                 size={100}
//                 weight={10}
//                 paused={paused}
//                 onComplete={this.props.timesUp}
//                 onClick={this.props.pause}
//               />
//             </div>
//           </MediaQuery>
//           <MediaQuery maxDeviceWidth={736}>
//             <div style={smallClockStyle}>
//               <ReactCountdownClock
//                 key={this.state.clockKey}
//                 seconds={this.props.clockSeconds}
//                 color='#1baff6'
//                 alpha={0.9}
//                 size={50}
//                 weight={10}
//                 paused={paused}
//                 onComplete={this.props.timesUp}
//                 onClick={this.props.pause}
//               />
//             </div>
//           </MediaQuery>
//         </div>
//         {score}
//       </div>
//     )
//   }
// }
// ScoreBoard.defaultProps = {
//   clockSeconds: 120
// }
