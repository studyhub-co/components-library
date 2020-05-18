import React, { useState, useEffect } from 'react';
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
  onImageChange: (image: any) => void;
  onHintChange?: (text: string) => void;
}

const Question: React.FC<IQuestionProps> = props => {
  const { question, onTextChange, editMode, onHintChange, onImageChange } = props;

  const [showHint, setShowHint] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  const handleShowHintChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowHint(event.target.checked);
  };

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      onImageChange(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (
      question.content.image &&
      question.content.image instanceof File &&
      question.content.image.type.startsWith('image/')
    ) {
      const objectUrl = URL.createObjectURL(question.content.image);
      setImageSrc(objectUrl);
    }
  }, [question.content.image]);

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
      {editMode && question.content.image && imageSrc && <img src={imageSrc} />}
      {editMode && !question.content.image && (
        <React.Fragment>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="select-img"
            multiple
            type="file"
            onChange={selectImage}
          />
          <label htmlFor="select-img">
            <FaFileImage style={{ cursor: 'pointer' }} size={'5rem'} />
          </label>
        </React.Fragment>
      )}
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
