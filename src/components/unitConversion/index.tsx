import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Draggable from 'react-draggable';

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

import { UnitConversion } from './components/index';

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
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  editMode?: boolean;
  componentData?: IUnitConversionData;
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

const Index: React.FC<IUnitConversionProps> = props => {
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
                  question={componentData.question}
                  onTextChange={operateDataFunctions.onQuestionTextChange}
                  onHintChange={operateDataFunctions.onQuestionHintChange}
                  onImageChange={operateDataFunctions.onQuestionImageChange}
                />
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                <Draggable
                  disabled={window.screen.width > 736}
                  axis="x"
                  bounds={{ left: -window.screen.width + 100, top: 0, right: 0, bottom: 0 }}
                  cancel=".mq-root-block"
                >
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
                    updateAnswer={(answer: any) => {
                      console.log(answer);
                    }}
                    editMode={editMode}
                    // uuid={this.props.question.uuid}
                    // is_correct_answer={this.props.correct}
                  />
                </Draggable>
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
