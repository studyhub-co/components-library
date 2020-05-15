import React from 'react';
import * as materialActionCreators from '../../redux/modules/material';
import { QAData as IQAData } from './IData/index';
interface IChoicesProps {
    component: any;
    currentMaterial: materialActionCreators.MaterialRedux;
    editMode: boolean;
    componentData: IQAData;
    fetchMaterial(uuid: string | undefined): void;
}
declare const _default: import("react-redux").ConnectedComponent<React.FC<IChoicesProps>, Pick<IChoicesProps, "component" | "editMode" | "componentData">>;
export default _default;
