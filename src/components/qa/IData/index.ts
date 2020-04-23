import { Question } from './question';
import { Choice } from './choices';

export interface QAData {
  question: Question;
  choices: Choice[];
}
