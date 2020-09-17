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

// import ValidateVector from '../src/components/vector/validate';

// README:
// You need to set "SameSite: None" of "sessionid" Django cookies to use this API
// You need to create csrftoken cookie with the same value as http://127.0.0.1:8000 for domain http://127.0.0.1:3000 (to able to set axios xsrfHeader from xsrfCookie)
// const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/';

// TODO make it configurable
const lessonUuid = '3a484714-dc4a-4f30-bae3-7ba0c6ad7a72';

// we need to set Material component type, because we don't use sandbox code (we use Component directly)
const materialsUuids = {
  // 'a8970b5b-22b8-4792-ac37-8109244e3a75': QAChoices,
  // 'd60ddf14-f4b6-4188-b5de-54fc3a16311c': QAChoices,
  'ad589acf-9d01-40fe-a2ef-253cd6cee48a': Vector,
  // '5fb38617-c0d3-4f4e-9c8b-e13e74570ca5': QABase,
};

// const componentOptions = {
//   BACKEND_SERVER_API_URL: BACKEND_SERVER_API_URL,
// };

const Student: React.FC = ({ currentMaterial, fetchMaterialStudentView }) => {
  // we need data only from selected materials

  const [state, setState] = useState({
    contentEditMode: false,
    currentMaterialUuid: Object.keys(materialsUuids)[0],
    // previousMaterialUuid: null,
    // genericComponent: null,
  });

  // useEffect(() => {
  //   materialActionCreators.fetchMaterial(state.currentMaterialUuid);
  // }, [state.currentMaterialUuid]);

  const handleContentEditModeChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, contentEditMode: event.target.checked });
  };

  const moveToNextComponent = nextMaterialUuid => {
    // in the sandbox it will be iframe reloading with new /evaluation/<uuid:pt_uuid>/<uuid:material_uuid>/ ?
    // setState({ ...state, currentMaterialUuid: null, previousMaterialUuid: previousMaterialUuid });
    // setState({ ...state, previousMaterialUuid: previousMaterialUuid });
    setState({ ...state, currentMaterialUuid: nextMaterialUuid });
  };

  // useEffect(() => {
  //   fetchMaterialStudentView(lessonUuid, state.previousMaterialUuid);
  // }, [state.currentMaterialUuid]);

  const GenericComponent = materialsUuids[state.currentMaterialUuid];

  useEffect(() => {
    if (!currentMaterial?.isFetching) {
      if (currentMaterial.uuid) {
        setState({ ...state, currentMaterialUuid: currentMaterial.uuid });
      }
    }
  }, [currentMaterial]);

  return (
    <div>
      <Paper style={{ padding: '1rem' }}>
        {/*BACKEND SERVER API URL: {BACKEND_SERVER_API_URL}*/}
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
      {GenericComponent && (
        <GenericComponent
          // previousMaterialUuid={state.previousMaterialUuid}
          showFooter={true}
          lessonUuid={lessonUuid}
          editMode={state.contentEditMode}
          materialUuid={state.currentMaterialUuid}
          moveToNextComponent={moveToNextComponent}
          checkUserMaterialReaction={material => {
            // material.data userReactionData
            if (GenericComponent === Vector) {
              // we have full json data only in edit mode: todo use studio data to implement front end validation
              // ValidateVector(currentMaterial.data, material.data)
            }
          }}
        />
      )}
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
