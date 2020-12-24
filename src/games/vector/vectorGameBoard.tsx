import React from 'react';

import { GameState } from '../constants';

interface VectorGameBoardProps {
  // props
  state: string;
  level: number;
}

const VectorGameBoard: React.FC<VectorGameBoardProps> = props => {
  const {
    // direct props
    state,
    level,
  } = props;

  const levelColorMap = {
    1: '#ffffff',
    2: '#fee',
    3: '#eef',
    4: '#ffa',
  };

  const style = { backgroundColor: levelColorMap[level] };
  switch (state) {
    case GameState.NEW:
      return (
        <div className="container game-sheet" style={style}>
          <div className="row">
            <div className="col-md-4" />
            <div className="col-md-4 text-center">
              <span>
                <h1 className="game-title">Vector Game</h1>
              </span>
              <p>
                <span>Beat a score of 1600 to unlock the next lesson. Wrong answers end the game.</span>
              </p>
              <button className="hover-button" onClick={this.props.start}>
                Start
              </button>
            </div>
          </div>
        </div>
      );
    case GameState.PAUSED:
      return (
        <div className="container game-sheet" style={style}>
          <Prompt when={this.props.state == GameState.QUESTION} message="Changes you made may not be saved." />
          <ScoreBoard
            state={this.props.state}
            score={this.props.score}
            level={this.props.level}
            timesUp={this.props.timesUp}
            pause={this.props.pause}
            restart={this.props.restart}
          />
          <div className="col-md-4" />
          <div className="col-md-4 text-center">
            <span>
              <h1>Vector Game</h1>
            </span>
            <span>
              <h1>PAUSED</h1>
            </span>
          </div>
        </div>
      );
  }
  return (
    <div className="container game-sheet" style={style}>
      <Prompt when={this.props.state == GameState.QUESTION} message="Changes you made may not be saved." />
      <ScoreBoard
        state={this.props.state}
        score={this.props.score}
        level={this.props.level}
        timesUp={this.props.timesUp}
        pause={this.props.pause}
        restart={this.props.restart}
      />
      {this.props.state !== GameState.WON ? (
        <QuestionBoard
          question={this.props.question}
          arrowComplete={this.props.arrowComplete}
          clear={[GameState.NEW, GameState.QUESTION].indexOf(this.props.state) >= 0}
          state={this.props.state}
          answerVector={this.props.answerVector}
          answerText={this.props.answerText}
        />
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
              {this.props.scoreList
                ? this.props.scoreList.map(function(score, i) {
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
    </div>
  );
};

export default VectorGameBoard;

// class VectorGameBoard extends React.Component {
//   constructor () {
//     super()
//     this.levelColorMap = {
//       1: '#ffffff',
//       2: '#fee',
//       3: '#eef',
//       4: '#ffa'
//     }
//   }
//
//   render () {
//     var style = {backgroundColor: this.levelColorMap[this.props.level]}
//     switch (this.props.state) {
//       case GameState.NEW:
//         return (
//           <div className='container game-sheet' style={style}>
//             <div className='row'>
//               <div className='col-md-4' />
//               <div className='col-md-4 text-center'>
//                 <span><h1 className='game-title'>Vector Game</h1></span>
//                 <p><span>Beat a score of 1600 to unlock the next lesson. Wrong answers end the game.</span></p>
//                 <button className='hover-button' onClick={this.props.start}>Start</button>
//               </div>
//             </div>
//           </div>
//         )
//       case GameState.PAUSED:
//         return (
//           <div className='container game-sheet' style={style}>
//             <Prompt when={this.props.state == GameState.QUESTION} message='Changes you made may not be saved.' />
//             <ScoreBoard
//               state={this.props.state}
//               score={this.props.score}
//               level={this.props.level}
//               timesUp={this.props.timesUp}
//               pause={this.props.pause}
//               restart={this.props.restart}
//             />
//             <div className='col-md-4' />
//             <div className='col-md-4 text-center'>
//               <span><h1>Vector Game</h1></span>
//               <span><h1>PAUSED</h1></span>
//             </div>
//           </div>
//         )
//     }
//     return (
//       <div className='container game-sheet' style={style}>
//         <Prompt when={this.props.state == GameState.QUESTION} message='Changes you made may not be saved.' />
//         <ScoreBoard
//           state={this.props.state}
//           score={this.props.score}
//           level={this.props.level}
//           timesUp={this.props.timesUp}
//           pause={this.props.pause}
//           restart={this.props.restart}
//         />
//         { this.props.state !== GameState.WON
//           ? <QuestionBoard
//             question={this.props.question}
//             arrowComplete={this.props.arrowComplete}
//             clear={[GameState.NEW, GameState.QUESTION].indexOf(this.props.state) >= 0}
//             state={this.props.state}
//             answerVector={this.props.answerVector}
//             answerText={this.props.answerText}
//           />
//           : <div className='text-center'>
//             <h4>High Score List</h4>
//             <table style={{marginLeft: 'auto', marginRight: 'auto'}}>
//               <tbody>
//               <tr>
//                 <th style={{'padding': 5}} />
//                 <th style={{'padding': 5}}>Name</th>
//                 <th style={{'padding': 5}}>Completion Time</th>
//               </tr>
//               {this.props.scoreList ? this.props.scoreList.map(function (score, i) {
//                 return <tr key={i}>
//                   <td style={{'padding': 5}}>{score.row_num}</td>
//                   <td style={{'padding': 5}}>{score.profile ? score.profile : 'Anonymous'}</td>
//                   <td style={{'padding': 5}}>{score.duration}</td>
//                 </tr>
//               }) : null}
//               </tbody>
//             </table>
//           </div>
//         }
//       </div>
//     )
//   }
// }
