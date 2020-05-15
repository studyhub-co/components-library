interface ChoiceContent {
    text: string;
    image: string;
}
export interface Choice {
    uuid: string;
    position: number;
    type: 'base';
    content: ChoiceContent;
}
export {};
