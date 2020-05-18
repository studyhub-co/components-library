import { Question } from '../../common/IData/question';
import { Vector } from './vector';

export interface VectorData {
  question: Question;
  questionVector: Vector;
  questionTextOnly: boolean;
  answer: Question;
}
