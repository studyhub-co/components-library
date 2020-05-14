import React, { useState } from 'react';
import * as materialActionCreators from '../../redux/modules/material';
import { VectorData as IVectorData } from './IData/index';

const VECTOR_COLORS = ['red', 'blue', 'green', 'yellow'];

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IVectorDrawingProps {}

const Vector: React.FC<IVectorDrawingProps> = props => {
  // const { question, onChange, editMode } = props;
  const [selectedChoiceUuid, setSelectedChoiceUuid] = useState('');

  return <React.Fragment>I am vector</React.Fragment>;
};

export default Vector;
