import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Paper } from '@material-ui/core';

import * as materialActionCreators from '../src/redux/modules/material';

import QAChoices from '../src/components/qaChoices';
import QABase from '../src/components/qaBase';
import Vector from '../src/components/vector';
import MySQL from '../src/components/mysql';
import UnitConversion from '../src/components/unitConversion';

import { validate as unitConversionValidate } from '../src/components/unitConversion/validate.js';

// import ValidateVector from '../src/components/vector/validate';

// README:
// You need to set "SameSite: None" of "sessionid" Django cookies to use this API
// You need to create csrftoken cookie with the same value as http://127.0.0.1:8000 for domain http://127.0.0.1:3000 (to able to set axios xsrfHeader from xsrfCookie)
// const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/';

// TODO make it configurable
const lessonUuid = '3a484714-dc4a-4f30-bae3-7ba0c6ad7a72';

// we need to set Material component type, because we don't use sandbox code (we use Component directly)
const materialsUuids = {
  /* order is important?! */
  // 'a8970b5b-22b8-4792-ac37-8109244e3a75': QAChoices,
  // 'aef3e51c-e0af-4426-be8b-7984ef68bc49': Vector,
  'fed7dac1-4412-4a70-9070-bb1e691b16fd': MySQL,
  '941b2426-f0bf-45c3-b850-4b0ce03300a1': UnitConversion,
  '44c8daca-5f13-4a9d-9a70-a1eb5389f65a': QABase,
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
          checkFrontendUserMaterialReaction={material => {
            // material.data == userReactionData
            // TODO add another component front validation
            if (GenericComponent === UnitConversion) {
              // front end validation
              const isValid = unitConversionValidate(currentMaterial.data, material.data);
              alert(isValid);
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
