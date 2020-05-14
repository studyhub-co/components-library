import produce from 'immer';
import { VectorData } from './IData/index';

// we can have reducerData null while ajax request
export type IReducerObject = { reducerData: VectorData | null };

// TODO add action typings
export const reducer = (state: IReducerObject, action: { type: string; payload: any }) => {
  return produce(state, (draft: { reducerData: VectorData }) => {
    // if (action.type === 'ADD_CHOICE') {
    //   // draft.numbers.push(Math.round(Math.random() * 1000));
    // }
    // if (action.type === 'DELETE_CHOICE') {
    //   // draft.numbers = [];
    // }
    // if (action.type === 'REPLACE_DATA') {
    //   draft.reducerData = action.payload;
    // }
  });
};
