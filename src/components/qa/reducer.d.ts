import { QAData } from './IData/index';
export declare type ReducerObject = {
    data: QAData;
};
export declare const reducer: (state: QAData, action: {
    type: string;
    payload: any;
}) => QAData;
