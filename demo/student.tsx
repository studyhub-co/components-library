import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Paper } from '@material-ui/core';

import * as materialActionCreators from '../src/redux/modules/material';

import GenericComponent from '../src/components/generic';

const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/studio/';
// const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/studio/materials/'
// const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/studio/material-problem-type/'
const materialsUuids = [
  '2364969a-1516-493a-a5c8-1af2dd16a99f',
  '0b012143-de14-46bd-9692-b52696951b42',
  '5fb38617-c0d3-4f4e-9c8b-e13e74570ca5',
];

const Student: React.FC = () => {
  // TODO
  // load 1st material, get mat type and switch to related component?
  // we need data only from selected materials

  const [state, setState] = useState({
    contentEditMode: false,
    currentMaterialUuid: materialsUuids[0],
  });

  useEffect(() => {
    materialActionCreators.fetchMaterial(state.currentMaterialUuid);
  }, []);

  const handleContentEditModeChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, contentEditMode: event.target.checked });
  };

  return (
    <div>
      <Paper style={{ padding: '1rem' }}>
        BACKEND SERVER API URL: {BACKEND_SERVER_API_URL}
        <br />
        Materials uuids: {materialsUuids.join(', ')}
        <br />
        <FormControlLabel
          control={
            <Switch checked={state.contentEditMode} color="primary" onChange={handleContentEditModeChange()} value="" />
          }
          label="Content Edit Mode"
        />
      </Paper>
      <GenericComponent materialUuid={state.currentMaterialUuid} />
    </div>
  );
};

export default connect(
  (state: any) => {
    return { currentMaterial: state.material };
  },
  dispatch => bindActionCreators(materialActionCreators, dispatch),
)(Student);
