interface ChoiceContent {
    text: string;
    image: string;
}
interface Choice {
    uuid: string;
    type: 'base';
    content: ChoiceContent;
}
export interface ChoicesData {
    question: string;
    choices: Choice[];
}
export {};
