import React from 'react';
import * as materialActionCreators from '../../redux/modules/material';
interface IChoicesProps {
    component: any;
    currentMaterial: materialActionCreators.MaterialRedux;
    fetchMaterial(uuid: string | undefined): void;
}
declare const _default: import("react-redux").ConnectedComponent<React.FC<IChoicesProps>, Pick<IChoicesProps, "component">>;
export default _default;
