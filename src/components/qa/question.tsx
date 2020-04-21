import React from 'react';
import * as materialActionCreators from '../../redux/modules/material';
import EditableLabel from '../editable/label';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQuestionProps {
  material: materialActionCreators.MaterialRedux;
  editMode: boolean;
}

const Question: React.FC<IQuestionProps> = props => {
  const { material, editMode } = props;

  return (
    <React.Fragment>
      {material && material.data && material.data.question && (
        <EditableLabel value={material.data.question} editMode={editMode} cursorPointer={true} />
      )}
    </React.Fragment>
  );

  // return <React.Fragment>{material && material.data && material.data.question}</React.Fragment>;
};

export default Question;
