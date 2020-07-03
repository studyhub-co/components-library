import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Paper } from '@material-ui/core';

import * as materialActionCreators from '../src/redux/modules/material';

// import GenericComponent from './generic';
import QAChoices from '../src/components/qaChoices';
import QABase from '../src/components/qaBase';
import Vector from '../src/components/vector';

const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/';

const lessonUuid = '4dc51da2-c325-4b52-8003-4efe2be23821';

// we need to set Material component type, because we don't use sandbox code (we use Component directly)
const materialsUuids = {
  '2364969a-1516-493a-a5c8-1af2dd16a99f': QAChoices,
  '0b012143-de14-46bd-9692-b52696951b42': Vector,
  '5fb38617-c0d3-4f4e-9c8b-e13e74570ca5': QABase,
};

const Student: React.FC = () => {
  // TODO
  // we need data only from selected materials

  const [state, setState] = useState({
    contentEditMode: false,
    // currentMaterialUuid: materialsUuids[0],
    currentMaterialUuid: Object.keys(materialsUuids)[0],
  });

  useEffect(() => {
    materialActionCreators.fetchMaterial(state.currentMaterialUuid);
  }, [state.currentMaterialUuid]);

  const handleContentEditModeChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, contentEditMode: event.target.checked });
  };

  const GenericComponent = materialsUuids[state.currentMaterialUuid];

  return (
    <div>
      <Paper style={{ padding: '1rem' }}>
        BACKEND SERVER API URL: {BACKEND_SERVER_API_URL}
        <br />
        Materials uuids: {Object.keys(materialsUuids).join(', ')}
        <br />
        <FormControlLabel
          control={
            <Switch checked={state.contentEditMode} color="primary" onChange={handleContentEditModeChange()} value="" />
          }
          label="Content Edit Mode"
        />
      </Paper>
      <GenericComponent
        lessonUuid={lessonUuid}
        editMode={state.contentEditMode}
        materialUuid={state.currentMaterialUuid}
      />
    </div>
  );
};

export default connect(
  (state: any) => {
    // console.log(state);
    return { currentMaterial: state.material };
  },
  dispatch => bindActionCreators(materialActionCreators, dispatch),
)(Student);
