import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import Draggable from 'react-draggable';

import { ThemeProvider } from '@material-ui/core/styles';

import { theme } from '../style';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

import { Material } from '../../models/';

import { UnitConversionData as IUnitConversionData } from './IData/index';

import Question from '../common/question';
import Footer from '../common/footer';

import { useSpaEventsHook } from '../hooks/spaEvents';
import { useUserMaterialReactionResult } from '../hooks/userMaterialReactionResult';
import { useFetchMaterial } from '../hooks/fetchMaterial';

import { useComponentData } from './componentData';

// TODO migrate to TS version!
import { UnitConversion } from './components/index';

import './style.css';

// import jquery from 'jquery';
//
// declare global {
//   interface Window {
//     jQuery: any;
//   }
// }
//
// window.jQuery = jquery;

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IUnitConversionProps {
  // direct props
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  editMode?: boolean;
  componentData?: IUnitConversionData;
  showFooter?: boolean | undefined;
  checkFrontendUserMaterialReaction(material: Material): void;
  moveToNextComponent(nextMaterialUuid: string | undefined): void;
  // redux actions
  fetchMaterial(uuid: string): void;
  fetchMaterialStudentView(lessonUuid: string | undefined, materialUuid: string | undefined): void;
  updateMaterial(material: Material): void;
  checkUserMaterialReaction(material: Material): void;
  // redux store
  currentMaterial: materialActionCreators.MaterialRedux;
  userMaterialReactionResult: userMaterialReactionCreators.UserReactionResultRedux;
}

const Index: React.FC<IUnitConversionProps> = props => {
  const {
    // direct props
    moveToNextComponent,
    editMode: editModeProp,
    componentData: componentDataProp,
    materialUuid,
    showFooter: showFooterProp,
    lessonUuid,
    checkFrontendUserMaterialReaction,
    // redux store
    userMaterialReactionResult,
    currentMaterial,
    // redux actions
    fetchMaterial,
    fetchMaterialStudentView,
    checkUserMaterialReaction,
    updateMaterial,
  } = props;

  const reactionStart = useRef(new Date());

  const [editMode, setEditMode] = useState(editModeProp);
  const [showFooter, setShowFooter] = useState(showFooterProp || false);
  const [disabledCheck, setDisabledCheckS] = useState(true);
  const { data: componentData, operateDataFunctions } = useComponentData(componentDataProp, currentMaterial);
  // todo userReactionStateHook
  const [userReactionState, setUserReactionState] = useState('start'); // 'start', 'checked', etc

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
    reactionStart,
  );

  useUserMaterialReactionResult(userMaterialReactionResult, setUserReactionState, userReactionState);
  useFetchMaterial(editMode, fetchMaterial, fetchMaterialStudentView, setUserReactionState, lessonUuid, materialUuid);

  // !--- common component code started TODO create hooks
  useEffect(() => {
    setEditMode(editModeProp);
  }, [editModeProp]);

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

  // console.log(componentData);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1 }}>
        {componentData ? ( // need to wait componentData
          <Container>
            <ContainerItem>
              <Paper>
                <Question
                  editMode={editMode}
                  mathMode={false}
                  question={componentData.question}
                  onTextChange={operateDataFunctions.onQuestionTextChange}
                  onHintChange={operateDataFunctions.onQuestionHintChange}
                  onImageChange={image => operateDataFunctions.onQuestionImageChange(image, materialUuid || '')}
                />
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                {/*<Draggable*/}
                {/*  disabled={window.screen.width > 736}*/}
                {/*  axis="x"*/}
                {/*  bounds={{ left: -window.screen.width + 100, top: 0, right: 0, bottom: 0 }}*/}
                {/*  cancel=".mq-root-block"*/}
                {/*>*/}
                <UnitConversion
                  answerNumber={componentData.answerStepNumber}
                  answerUnit={componentData.answerStepUnit}
                  number={componentData.questionStepNumber}
                  unit={componentData.questionStepUnit}
                  unitConversionType={componentData.conversionType}
                  onUnitConversionTypeChange={(event: any) => {
                    operateDataFunctions.onUnitConversionTypeChange(event.target.value);
                  }}
                  onQuestionStepChange={operateDataFunctions.onQuestionStepChange}
                  conversionSteps={componentData.conversionSteps}
                  // onConversionStepsChange={operateDataFunctions.onConversionStepsChange}
                  updateAnswer={(answer: any) => {
                    // update all steps + answer
                    if (answer) {
                      // const answer = answerArray[1]['unitConversion'];
                      operateDataFunctions.onConversionStepsChange(answer.conversionSteps);
                      operateDataFunctions.onAnswerStepChange(answer.answerNumber, answer.answerUnit);
                    }
                  }}
                  editMode={editMode}
                  // uuid={this.props.question.uuid}
                  // is_correct_answer={this.props.correct}
                />
                {/*</Draggable>*/}
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
            // material combine componentData and material uuid, see checkContinueButton for details
            if (checkFrontendUserMaterialReaction) {
              // direct front end validation (mostly for demo purposes): don't send checkUserReaction request to the backend
              checkFrontendUserMaterialReaction(material);
            } else {
              // This function is used only for current library Footer
              // For check reaction from studyhub.io see src/components/hooks/spaEvents.tsx
              setUserReactionState('checked');
              /* eslint-disable @typescript-eslint/camelcase */
              material.reaction_start_on = reactionStart.current.toISOString();
              // back end validation (see redux action for details)
              checkUserMaterialReaction(material);
            }
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
