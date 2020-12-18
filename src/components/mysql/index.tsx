import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';

import { theme } from '../style';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

import { Material } from '../../models/';

import { MySQLData as IMySQLData } from './IData/index';

import Question from '../common/question';

import SchemaTable from './components/studentQuestionSchemaTable';
import EditModeComponent from './components/editMode';
import StudentViewComponent from './components/studentView';

import { useComponentData } from './componentData';

import { useSpaEventsHook } from '../hooks/spaEvents';
import { useUserMaterialReactionResult } from '../hooks/userMaterialReactionResult';
import { useFetchMaterial } from '../hooks/fetchMaterial';
import Footer from '../common/footer';
import { makeServiceRequest } from './serviceRequests';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IMySQLProps {
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  editMode?: boolean;
  componentData?: IMySQLData;
  showFooter?: boolean | undefined;
  // redux actions
  fetchMaterial(uuid: string): void;
  fetchMaterialStudentView(lessonUuid: string | undefined, materialUuid: string | undefined): void;
  updateMaterial(material: Material): void;
  checkUserMaterialReaction(material: Material): void;
  moveToNextComponent(nextMaterialUuid: string | undefined): void;
  // redux store
  currentMaterial: materialActionCreators.MaterialRedux;
  userMaterialReactionResult: userMaterialReactionCreators.UserReactionResultRedux;
}

const Index: React.FC<IMySQLProps> = props => {
  const {
    // direct props
    moveToNextComponent,
    editMode: editModeProp,
    componentData: componentDataProp,
    materialUuid,
    showFooter: showFooterProp,
    lessonUuid,
    // redux store
    userMaterialReactionResult,
    currentMaterial,
    // actions
    fetchMaterial,
    fetchMaterialStudentView,
    checkUserMaterialReaction,
    updateMaterial,
  } = props;

  const [editMode, setEditMode] = useState(editModeProp);
  const [showFooter, setShowFooter] = useState(showFooterProp || false);
  const [disabledCheck, setDisabledCheckS] = useState(true);
  const { data: componentData, operateDataFunctions } = useComponentData(componentDataProp, currentMaterial);
  // todo userReactionStateHook
  const [userReactionState, setUserReactionState] = useState('start'); // 'start', 'checked', etc

  // console.log(componentData);

  useSpaEventsHook(
    updateMaterial,
    checkUserMaterialReaction,
    currentMaterial,
    componentData,
    userMaterialReactionResult,
    moveToNextComponent,
    lessonUuid,
    setShowFooter,
    setEditMode,
    setUserReactionState,
  );

  useUserMaterialReactionResult(userMaterialReactionResult, setUserReactionState, userReactionState);
  useFetchMaterial(editMode, fetchMaterial, fetchMaterialStudentView, setUserReactionState, lessonUuid, materialUuid);

  // !--- common component code started TODO create hooks
  useEffect(() => {
    setEditMode(editModeProp);
  }, [editModeProp]);

  const onStudentResponseChange = (SQLQuery: string, expectedOutput: string, expectedOutputJson: string) => {
    operateDataFunctions.onStudentMySQLDataChange(SQLQuery, expectedOutput, expectedOutputJson);
  };

  const setDisabledCheck = (value: boolean) => {
    setDisabledCheckS(value);
    // send disabled check the SPA
    window.parent.postMessage(
      {
        type: 'disabled_check_button',
        data: value,
      },
      '*',
    );
  };

  // disable Check / Continue button while user result reaction is fetching
  useEffect(() => {
    if (userMaterialReactionResult?.isFetching) {
      setDisabledCheck(true);
    } else {
      setDisabledCheck(false);
    }
  }, [userMaterialReactionResult]);

  useEffect(() => {
    if (currentMaterial.isFetching === false && currentMaterial.uuid) {
      // send message to parent with loaded material
      window.parent.postMessage(
        {
          type: 'current_material',
          data: currentMaterial,
        },
        '*',
      );
    }
  }, [checkUserMaterialReaction, currentMaterial, lessonUuid]);
  // !--- common component code ended

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {componentData ? ( // need to wait componentData
          <Container>
            <ContainerItem>
              <Paper>
                <Question
                  editMode={editMode}
                  mathMode={true}
                  question={componentData.question}
                  onTextChange={operateDataFunctions.onQuestionTextChange}
                  onHintChange={operateDataFunctions.onQuestionHintChange}
                  onImageChange={operateDataFunctions.onQuestionImageChange}
                />
                {!editMode && <SchemaTable SQLSchemaJson={componentData.SQLSchemaResultJson} />}
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                {editMode ? (
                  <EditModeComponent
                    SQLQuery={componentData.answer.SQLQuery}
                    SQLSchema={componentData.answer.SQLSchema}
                    expectedOutput={componentData.answer.expectedOutput}
                    schemaIsValid={componentData.SQLSchemaResultJson ? true : false}
                    onChangeMySQL={(SQLSchema, SQLQuery) => {
                      // validate my schema with the backend API
                      // if all ok then save schema in component data reducer
                      makeServiceRequest({ SQLSchema, SQLQuery }, 'validate_mysql_schema_query')
                        .then((response: any) => {
                          // TODO add spinner, due it could be long query
                          if (response.SQLSchemaResultJson) {
                            // schema was build successfully
                            operateDataFunctions.onAnswerMySQLDataChange(
                              SQLSchema,
                              SQLQuery,
                              response.SQLSchemaResultJson,
                              response.expectedOutput ? response.expectedOutput : '',
                            );
                          } else {
                            alert('Invalid SQL schema');
                          }
                        })
                        .catch(e => {
                          // if not ok - send error to the user
                          if (e.response?.status === 400) {
                            //  validation error TODO - move to API
                            let validationErrorMessage = 'Validation error: \n';
                            for (const [key, value] of Object.entries(e.response.data)) {
                              validationErrorMessage += `${key} : ${value} \n`;
                              alert(validationErrorMessage);
                            }
                          }
                          if (e.response?.status === 503) {
                            alert(e.response.data.detail);
                          }
                        });
                    }}
                    // editMode={editMode}
                  />
                ) : (
                  <StudentViewComponent
                    onStudentResponseChange={onStudentResponseChange}
                    SQLSchema={componentData.answer.SQLSchema}
                    executedJsonSQL={componentData.answer.expectedOutputJson}
                  />
                )}
              </Paper>
            </ContainerItem>
          </Container>
        ) : (
          <div>Loading...</div> // TODO replace with spinner
        )}
      </div>
      {showFooter && (
        <Footer
          moveToNextComponent={() => {
            setUserReactionState('start');
            moveToNextComponent(userMaterialReactionResult.next_material_uuid);
          }}
          editMode={editMode}
          componentData={componentData}
          checkUserMaterialReaction={material => {
            setUserReactionState('checked');
            checkUserMaterialReaction(material);
          }}
          currentMaterial={currentMaterial}
          disabledCheck={disabledCheck}
          updateMaterial={updateMaterial}
          userReactionState={userReactionState}
        />
      )}
    </ThemeProvider>
  );
};

export default connect(
  (state: any) => {
    return { currentMaterial: state.material, userMaterialReactionResult: state.userMaterialReactionResult };
  },
  dispatch => bindActionCreators({ ...materialActionCreators, ...userMaterialReactionCreators }, dispatch),
)(Index);
