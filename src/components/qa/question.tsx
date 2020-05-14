import React from 'react';
import EditableLabel from '../editable/label';

import { Question as IQuestion } from './IData/question';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQuestionProps {
  // material: materialActionCreators.MaterialRedux;
  editMode: boolean;
  question: IQuestion;
  onChange: (question: IQuestion) => void;
}

const Question: React.FC<IQuestionProps> = props => {
  const { question, onChange, editMode } = props;

  const onTextChange = (text: string) => {
    // question.content.text is read only via immer now
    const newQuestion: IQuestion = Object.assign({}, question);
    newQuestion.content.text = text;
    onChange(newQuestion);
  };

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
