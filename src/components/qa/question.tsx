import React from 'react';
import * as materialActionCreators from '../../redux/modules/material';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQuestionProps {
  material: materialActionCreators.MaterialRedux;
}

const Question: React.FC<IQuestionProps> = props => {
  const { material } = props;

  return <React.Fragment>{material && material.data && material.data.question}</React.Fragment>;
};

export default Question;
