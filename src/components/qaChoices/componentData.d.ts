import React from 'react';
import { QAData as IQAData } from './IData/index';
export declare function useComponentData(componentData: IQAData, currentMaterial: any): {
    data: IQAData | null;
    dispatch: React.Dispatch<{
        type: string;
        payload: any;
    }>;
};
