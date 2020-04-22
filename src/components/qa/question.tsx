import React from 'react';
import * as materialActionCreators from '../../redux/modules/material';
import EditableLabel from '../editable/label';

import { Question as IQuestion } from './IData/question';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQuestionProps {
  // material: materialActionCreators.MaterialRedux;
  editMode: boolean;
  question: IQuestion;
}

const Question: React.FC<IQuestionProps> = props => {
  const { question, editMode } = props;

  return (
    <React.Fragment>
      {question.text && <EditableLabel value={question.text} editMode={editMode} cursorPointer={true} />}
      {/* TODO image, hint */}
    </React.Fragment>
  );
};

export default Question;
