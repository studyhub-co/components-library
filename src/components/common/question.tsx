import React, { useState, useEffect } from 'react';
import EditableLabel from '../editable/label';

import { Question as IQuestion } from './IData/question';

import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { FaFileImage } from 'react-icons/fa';
import EditableThumbnail from '../editable/thumbnail';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQuestionProps {
  editMode: boolean;
  question: IQuestion;
  mathButtons?: undefined | string[];
  mathMode?: boolean;
  onTextChange: (text: string) => void;
  onImageChange: (image: any) => void;
  onHintChange?: (text: string) => void;
}

const Question: React.FC<IQuestionProps> = props => {
  const { question, onTextChange, editMode, onHintChange, onImageChange, mathButtons, mathMode } = props;

  const [showHint, setShowHint] = useState(false);

  const handleShowHintChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowHint(event.target.checked);
  };

  return (
    <React.Fragment>
      <React.Fragment>
        <EditableLabel
          mathButtons={mathButtons}
          onChange={onTextChange}
          value={question.content.text}
          editMode={editMode}
          mathMode={mathMode}
          cursorPointer={true}
        />
      </React.Fragment>
      <br />
      <EditableThumbnail editMode={editMode} image={question.content.image} onImageChange={onImageChange} />
      {editMode && onHintChange && (
        <EditableLabel
          placeholder="Hint text"
          onChange={onHintChange}
          value={question.content.hint}
          editMode={editMode}
          cursorPointer={true}
        />
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
