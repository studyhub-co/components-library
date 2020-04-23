import React from 'react';
import * as materialActionCreators from '../../redux/modules/material';
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
    question.content.text = text;
    onChange(question);
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
