import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as materialActionCreators from '../redux/modules/material';

interface Generic {
  materialUuid: string;
  fetchMaterial(uuid: string | undefined): void;
}

const GenericComponent: React.FC<Generic> = props => {
  const { materialUuid, fetchMaterial } = props;

  useEffect(() => {
    fetchMaterial(materialUuid);
  }, [fetchMaterial]);

  return <div>generic component with uuid {materialUuid}</div>;
};

export default connect(
  (state: any) => {
    return { currentMaterial: state.material };
  },
  dispatch => bindActionCreators(materialActionCreators, dispatch),
)(GenericComponent);
