import { QAData } from './IData/index';
export declare type IReducerObject = {
    reducerData: QAData | null;
};
export declare const reducer: (state: IReducerObject, action: {
    type: string;
    payload: any;
}) => IReducerObject;
