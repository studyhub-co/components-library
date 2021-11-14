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

import VectorGame from '../src/games/vector';

import { validate as unitConversionValidate } from '../src/components/unitConversion/validate.js';

// import ValidateVector from '../src/components/vector/validate';

// README:
// You need to set "SameSite: None" of "sessionid" Django cookies to use this API
// You need to create csrftoken cookie with the same value as http://127.0.0.1:8000 for domain http://127.0.0.1:3000 (to able to set axios xsrfHeader from xsrfCookie)
// const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/';

// TODO make it configurable
const lessonUuid = '547f5412-557e-43a8-bcfe-ac297c123df3';

// we need to set Material component type, because we don't use sandbox code (we use Component directly)
const materialsUuids = {
  /* order is important */
  'c2a54475-bba4-4cbf-9480-3a3028a962c8': QAChoices,
  // 'f6685f7a-3764-4d1e-806c-171ecdc9eaad': Vector,
  // '9e8fefaf-1c59-4892-bc17-1239b994feed': Vector,
  // '8b85058d-a22b-4615-a7a8-92e9dbbc5f86': MySQL,
  // '3d35337f-e805-4126-9c91-dd35a7e01892': UnitConversion,
  // '1cdee680-d5db-4f0c-b140-17067e45b98b': QABase,
  // '7285e728-ca15-4bce-89e0-e7ccd83f78ba': VectorGame,
};

// const componentOptions = {
//   BACKEND_SERVER_API_URL: BACKEND_SERVER_API_URL,
// };

const Student: ({
  currentMaterial,
  fetchMaterialStudentView,
}: {
  currentMaterial: any;
  fetchMaterialStudentView: any;
}) => JSX.Element = ({ currentMaterial, fetchMaterialStudentView }) => {
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
  }, [currentMaterial]); // do not use state here!

  return (
    <div>
      <Paper style={{ padding: '1rem', margin: '1rem' }}>
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
