import React, { useState, useEffect } from 'react';

interface QuestionBoardProps {
  // props
  // SQLSchemaJson: string;
}

const VectorGame: React.FC<QuestionBoardProps> = props => {
  const {
    // direct props
  } = props;

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const toggle = () => {
    setIsActive(!isActive);
  }

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return <div></div>;
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
