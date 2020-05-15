import produce from 'immer';
import { QAData } from './IData/index';

// import { ReducerObject as IReducerObject, ComponentsData as IComponentsData } from '../hooks/IData';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: QAData | null };

// TODO add action typings
export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  console.log(action.payload);
  return produce(state, (draft: { reducerData: QAData }) => {
    // if (action.type === 'ADD_CHOICE') {
    //   // draft.numbers.push(Math.round(Math.random() * 1000));
    // }
    if (action.type === 'DELETE_CHOICE') {
      const choiceUUid = action.payload;
      // draft.reducerData
      draft.reducerData.choices = draft.reducerData.choices.filter(choice => {
        return choice.uuid !== choiceUUid;
      });
    }
    if (action.type === 'QUESTION_TEXT_CHANGE') {
      const text = action.payload;
      draft.reducerData.question.content.text = text;
    }
    if (action.type === 'REPLACE_DATA') {
      draft.reducerData = action.payload;
    }
  });
};
