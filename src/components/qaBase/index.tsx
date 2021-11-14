import React, { useEffect, useRef, useState } from 'react';
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

import { QABaseData as IQABaseData } from './IData/index';

import Question from '../common/question';

import { useComponentData } from './componentData';

import { useSpaEventsHook } from '../hooks/spaEvents';
import { useUserMaterialReactionResult } from '../hooks/userMaterialReactionResult';
import { useFetchMaterial } from '../hooks/fetchMaterial';
import Footer from '../common/footer';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQAProps {
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  editMode?: boolean;
  componentData?: IQABaseData;
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

const Index: React.FC<IQAProps> = props => {
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

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1 }}>
        {componentData ? ( // need to wait componentData
          <Container>
            <ContainerItem>
              {/*<div>{`Proper value ${componentData.question.content.text}`}</div>*/}
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
                <Question
                  editMode={true}
                  mathMode={true}
                  editTextMode={true} // TODO do we need an image in answer?
                  question={componentData.answer}
                  onTextChange={operateDataFunctions.onAnswerTextChange}
                  onImageChange={image => operateDataFunctions.onAnswerImageChange(image, materialUuid || '')}
                />
              </Paper>
            </ContainerItem>
          </Container>
        ) : (
          <div></div> // TODO replace with spinner
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
            // This function is used only for current library Footer
            // For check reaction from studyhub.io see src/components/hooks/spaEvents.tsx
            /* eslint-disable @typescript-eslint/camelcase */
            material.reaction_start_on = reactionStart.current.toISOString();
            checkUserMaterialReaction(material);
            setUserReactionState('checked');
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
