import { Question } from '../../common/IData/question';
import { Choice } from './choices';

export interface QAData {
  question: Question;
  choices: Choice[];
}
