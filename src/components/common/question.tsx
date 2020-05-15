import React from 'react';
import EditableLabel from '../editable/label';

import { Question as IQuestion } from './IData/question';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQuestionProps {
  // material: materialActionCreators.MaterialRedux;
  editMode: boolean;
  question: IQuestion;
  // onChange: (question: IQuestion) => void;
  onTextChange: (text: string) => void;
}

const Question: React.FC<IQuestionProps> = props => {
  const { question, onTextChange, editMode } = props;

  // const onTextChange = (text: string) => {
  //       // can't change question.content is immutable
  //   // const newQuestion: IQuestion = { ...question };
  //   // newQuestion.content.text = text;
  //   // onChange(newQuestion);
  // };

  return (
    <React.Fragment>
      {question.content.text && (
        <EditableLabel onChange={onTextChange} value={question.content.text} editMode={editMode} cursorPointer={true} />
      )}
      {/* TODO image, hint */}
    </React.Fragment>
  );
};

export default Question;
