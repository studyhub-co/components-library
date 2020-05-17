import React, { useState } from 'react';
import EditableLabel from '../editable/label';

import { Question as IQuestion } from './IData/question';

import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { FaFileImage } from 'react-icons/fa';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQuestionProps {
  // material: materialActionCreators.MaterialRedux;
  editMode: boolean;
  question: IQuestion;
  // onChange: (question: IQuestion) => void;
  onTextChange: (text: string) => void;
  onHintChange?: (text: string) => void;
}

const Question: React.FC<IQuestionProps> = props => {
  const { question, onTextChange, editMode, onHintChange } = props;

  const [showHint, setShowHint] = useState(false);

  const handleShowHintChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowHint(event.target.checked);
  };

  return (
    <React.Fragment>
      {question.content.text && (
        <React.Fragment>
          <EditableLabel
            onChange={onTextChange}
            value={question.content.text}
            editMode={editMode}
            cursorPointer={true}
          />
        </React.Fragment>
      )}
      <br />
      {editMode && question.content.image && <img />}
      {editMode && !question.content.image && <FaFileImage size={'5rem'} />}
      {editMode && onHintChange && (
        <EditableLabel onChange={onHintChange} value={question.content.hint} editMode={editMode} cursorPointer={true} />
      )}
      {!editMode && question.content.hint && (
        <React.Fragment>
          <FormControlLabel
            control={<Switch checked={showHint} onChange={handleShowHintChange} name="showHint" color="primary" />}
            label="Show hint"
          />
          <Box display={showHint ? 'block' : 'none'} m={1}>
            {question.content.hint}
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Question;
