import React from 'react';
import { Question as IQuestion } from './IData/question';
interface IQuestionProps {
    editMode: boolean;
    question: IQuestion;
    onChange: (question: IQuestion) => void;
}
declare const Question: React.FC<IQuestionProps>;
export default Question;
