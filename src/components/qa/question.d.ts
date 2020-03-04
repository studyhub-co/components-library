import React from 'react';
import * as materialActionCreators from '../../redux/modules/material';
interface IQuestionProps {
    material: materialActionCreators.MaterialRedux;
}
declare const Question: React.FC<IQuestionProps>;
export default Question;
