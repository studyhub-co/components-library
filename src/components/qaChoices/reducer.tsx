import produce from 'immer';
import { QAData } from './IData/index';
import { Choice as IChoice } from './IData/choices';

import { uuidV4 } from '../../utils/index';

// import { ReducerObject as IReducerObject, ComponentsData as IComponentsData } from '../hooks/IData';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: QAData | null };

// TODO add action typings
export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  return produce(state, (draft: { reducerData: QAData }) => {
    if (action.type === 'ADD_CHOICE') {
      const newChoice = {
        content: {
          image: '',
          text: 'new answer',
        },
        type: 'base',
        uuid: uuidV4(),
        position: draft.reducerData.choices.length,
      } as IChoice;
      draft.reducerData.choices.push(newChoice);
    }
    if (action.type === 'DELETE_CHOICE') {
      const choiceUUid = action.payload;
      draft.reducerData.choices = draft.reducerData.choices.filter(choice => {
        return choice.uuid !== choiceUUid;
      });
    }
    if (action.type === 'CHOICE_TEXT_CHANGE') {
      const { uuid, text } = action.payload;
      const choice = draft.reducerData.choices.find(x => x.uuid === uuid);
      if (choice) {
        choice.content.text = text;
      }
    }
    if (action.type === 'CHOICE_IMAGE_CHANGE') {
      const { uuid, image } = action.payload;
      const choice = draft.reducerData.choices.find(x => x.uuid === uuid);
      if (choice) {
        choice.content.image = image;
      }
    }
    if (action.type === 'QUESTION_TEXT_CHANGE') {
      draft.reducerData.question.content.text = action.payload;
    }
    if (action.type === 'QUESTION_HINT_CHANGE') {
      draft.reducerData.question.content.hint = action.payload;
    }
    if (action.type === 'QUESTION_IMAGE_CHANGE') {
      draft.reducerData.question.content.image = action.payload;
    }
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
  });
};
