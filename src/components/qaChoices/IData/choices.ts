import { Question } from '../../common/IData/question';

interface ChoiceContent {
  text: string;
  image: string;
}

export interface Choice {
  uuid: string;
  position: number;
  type: 'base'; // FIXME what types of choices do we need here? (was imagewtext)
  content: ChoiceContent;
}
