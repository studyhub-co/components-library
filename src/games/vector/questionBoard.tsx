import React from 'react';

import { GameState } from '../constants';

import { VectorCanvas } from '../../components/vector/vectorCanvas';

interface QuestionBoardProps {
  // props
  // SQLSchemaJson: string;
  arrowComplete: (arrow: any) => void;
  clear: boolean;
  answerVector: any;
  answerText: string;
  question: string;
  gameState: string;
}

const QuestionBoard: React.FC<QuestionBoardProps> = props => {
  const {
    // direct props
    arrowComplete,
    clear,
    answerVector,
    answerText,
    question,
    gameState,
  } = props;

  const objects = [];
  let fade = false;
  if (answerVector) {
    fade = true;
    objects.push(answerVector);
  }
  if (answerText) {
    objects.push(answerText);
  }
  const disabled = !([GameState.GAME_OVER, GameState.WON].indexOf(gameState) > -1);

  return (
    <div>
      <div>
        <h4>{question}</h4>
      </div>
      <VectorCanvas
        allowNull
        canvasId={'vector-game'}
        onComplete={arrowComplete}
        clear={clear}
        objects={objects}
        allowInput={disabled}
        fade={fade}
      />
    </div>
  );
};

export default QuestionBoard;

// class QuestionBoard extends React.Component {
//   render() {
//     const objects = [];
//     let fade = false;
//     if (this.props.answerVector) {
//       fade = true;
//       objects.push(this.props.answerVector);
//     }
//     if (this.props.answerText) {
//       objects.push(this.props.answerText);
//     }
//     const disabled = !([GameState.GAME_OVER, GameState.WON].indexOf(this.props.state) > -1);
//
//     return (
//       <div className="text-center">
//         <MediaQuery minDeviceWidth={736}>
//           <RMathJax.Provider>
//             <h2>{this.props.question}</h2>
//           </RMathJax.Provider>
//         </MediaQuery>
//         <MediaQuery maxDeviceWidth={736}>
//           <RMathJax.Provider>
//             <h4>{this.props.question}</h4>
//           </RMathJax.Provider>
//         </MediaQuery>
//         <VectorCanvas
//           allowNull
//           onComplete={this.props.arrowComplete}
//           clear={this.props.clear}
//           objects={objects}
//           allowInput={disabled}
//           fade={fade}
//         />
//       </div>
//     );
//   }
// }
