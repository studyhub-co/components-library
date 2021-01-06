// class UnitConversionGameBoard extends React.Component {
//   constructor () {
//     super()
//     this.levelColorMap = {
//       1: '#ffffff',
//       2: '#c9bfff',
//       3: '#caffe5',
//       4: '#ffffaa',
//       5: '#ffd8b2'
//     }
//     this.state = {clockSeconds: 600}
//   }
//   componentDidMount () {
//     if (this.props.state === GameState.NEW) {
//       document.getElementById('start').focus()
//     }
//   }
//   render () {
//     var style = {backgroundColor: this.levelColorMap[this.props.level]}
//
//     switch (this.props.state) { // TODO this is ugly
//       case GameState.NEW:
//         return (
//           <div className='container game-sheet' style={style}>
//             <div className='row'>
//               <div className='col-md-4' />
//               <div className='col-md-4 text-center'>
//                 <span><h1 className='game-title'>Unit Conversion Game</h1></span>
//                 <p><span>Beat a score of 2500 to unlock the next lesson. Wrong answers end the game.</span></p>
//                 <button id='start' className='hover-button' onClick={this.props.start}>Start</button>
//               </div>
//             </div>
//           </div>
//         )
//       case GameState.PAUSED:
//         return (
//           <div className='container game-sheet' style={style}>
//             <Prompt when={this.props.state === GameState.QUESTION} message='Changes you made may not be saved.' />
//             <ScoreBoard
//               state={this.props.state}
//               score={this.props.score}
//               level={this.props.level}
//               timesUp={this.props.timesUp}
//               pause={this.props.pause}
//               restart={this.props.restart}
//               clockSeconds={this.state.clockSeconds}
//             />
//             <div className='col-md-4' />
//             <div className='col-md-4 text-center'>
//               <span><h1>Unit Conversion Game</h1></span>
//               <span><h1>PAUSED</h1></span>
//             </div>
//           </div>
//         )
//     }
//     return (
//       <div className='container game-sheet' style={style}>
//         <Prompt when={this.props.state === GameState.QUESTION} message='Changes you made may not be saved.' />
//         <ScoreBoard
//           state={this.props.state}
//           score={this.props.score}
//           level={this.props.level}
//           timesUp={this.props.timesUp}
//           pause={this.props.pause}
//           restart={this.props.restart}
//           clockSeconds={this.state.clockSeconds}
//         />
//         { this.props.state !== GameState.WON
//           ? <UnitConversionQuestionBoard
//             number={this.props.number}
//             unit={this.props.unit}
//             question={this.props.question}
//             clear={[GameState.NEW, GameState.QUESTION].indexOf(this.props.state) >= 0}
//             gameState={this.props.state}
//             gameOver={this.props.gameOver}
//             level={this.props.level}
//             nextQuestion={this.props.nextQuestion}
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
// UnitConversionGameBoard.propTypes = {
//   number: PropTypes.any,
//   unit: PropTypes.string,
//   level: PropTypes.number,
//   state: PropTypes.string, // TODO don't use 'state' name for anything, but react component state. rename to gameState
//   start: PropTypes.func,
//   score: PropTypes.number,
//   timesUp: PropTypes.func,
//   pause: PropTypes.func,
//   restart: PropTypes.func,
//   question: PropTypes.any,
//   nextQuestion: PropTypes.func,
//   gameOver: PropTypes.func,
//   scoreList: PropTypes.array
// }
