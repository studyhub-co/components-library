interface ChoiceContent {
  text: string;
  image: string;
}

interface Choice {
  uuid: string;
  type: 'base'; // FIXME what types of choices do we need here? (was imagewtext)
  content: ChoiceContent;
}

export interface ChoicesData {
  question: string;
  choices: Choice[];
}
