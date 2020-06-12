import React, { createRef, useEffect, useState } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
//
// import * as materialActionCreators from '../src/redux/modules/material';
//
// /* this component works directly with material type data */
//
// interface Generic {
//   materialUuid: string;
//   fetchMaterial(uuid: string | undefined): void;
//   component: any;
//   currentMaterial: any;
// }
//
// const GenericComponent: React.FC<Generic> = props => {
//   const { materialUuid, fetchMaterial, component } = props;
//
//   useEffect(() => {
//     fetchMaterial(materialUuid);
//   }, [fetchMaterial, materialUuid]);
//
//   const Component = component;
//
//   return <Component>generic component with uuid {materialUuid}</Component>;
// };
//
// export default connect(
//   (state: any) => {
//     console.log(state);
//     return { currentMaterial: state.material };
//   },
//   dispatch => bindActionCreators(materialActionCreators, dispatch),
// )(GenericComponent);
