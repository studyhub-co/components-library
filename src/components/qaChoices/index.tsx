import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { theme } from '../style';
import { StyledChoiceButton } from './style';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

import { Material } from '../../models/';
// , UserReactionResult as IUserReactionResult

import Question from '../common/question';
import Choice from './choice';
import Footer from '../common/footer';

import { Choice as IChoice } from './IData/choices';
import { QAData as IQAData } from './IData/index';

// hook to work with componentData
import { useComponentData } from './componentData';

import { useSpaEventsHook } from '../hooks/spaEvents';
import { useUserMaterialReactionResult } from '../hooks/userMaterialReactionResult';
import { useFetchMaterial } from '../hooks/fetchMaterial';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQAProps {
  // direct props
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  editMode?: boolean;
  componentData?: IQAData;
  showFooter?: boolean | undefined;
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
  const [cardMode, setCardMode] = useState(false);
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

  useEffect(() => {
    if (componentData) {
      // if we have at least one image in choice enable cardMode
      const newCardMode = componentData.choices.some(choice => choice.content.image);
      if (cardMode !== newCardMode) {
        setCardMode(newCardMode);
      }
      // if we have selected choices
      const hasSelected = componentData.choices.some(choice => choice.selected);
      // if (hasSelected !== disabledCheck) {
      setDisabledCheck(!hasSelected);
      // } disabledCheck
    }
  }, [cardMode, componentData]); // calculate only if componentData changed

  useEffect(() => {
    if (
      componentData &&
      userMaterialReactionResult &&
      userMaterialReactionResult.isFetching === false &&
      userMaterialReactionResult.next_material_uuid !== materialUuid
    ) {
      // show correct / wrong answer to the user
      // result statuses of choices list: 'none', 'correct', 'wrong'
      const correctData = userMaterialReactionResult.correct_data as IQAData;

      componentData.choices.forEach(function(componentDataChoice) {
        // we have no correctData?.choices if was correct = true
        if (userMaterialReactionResult.was_correct) {
          if (componentDataChoice.selected) {
            // mark correct choice only if it was correct.
            operateDataFunctions.onChoiceReactionResultChange(componentDataChoice.uuid, 'correct');
          }
        }
        if (correctData?.choices && !userMaterialReactionResult.was_correct) {
          // find correct choice
          const correctChoice: IChoice = correctData?.choices.find(
            ({ uuid }: { uuid: string }) => uuid === componentDataChoice.uuid,
          )!;

          // status of reaction of choice - 'none', 'correct', 'wrong'.
          if (correctChoice.selected) {
            // mark correct answer as was wrong (red)
            operateDataFunctions.onChoiceReactionResultChange(componentDataChoice.uuid, 'wrong');
          }
        }
      });
    }
  }, [componentData, materialUuid, operateDataFunctions, userMaterialReactionResult]);

  return (
    <ThemeProvider theme={theme}>
      {componentData ? ( // need to wait componentData
        <div style={{ flexGrow: 1, padding: '1rem' }}>
          <Container>
            <ContainerItem>
              <Paper>
                <Question
                  onHintChange={operateDataFunctions.onQuestionHintChange}
                  editMode={editMode}
                  question={componentData.question}
                  onTextChange={operateDataFunctions.onQuestionTextChange}
                  onImageChange={image => operateDataFunctions.onQuestionImageChange(image, materialUuid || '')}
                />
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                {componentData.choices ? (
                  <React.Fragment>
                    {componentData.choices.map((choice: IChoice, index: number) => {
                      return (
                        <Choice
                          // student mode params
                          selected={choice.selected}
                          onSelect={operateDataFunctions.selectChoiceUuid}
                          // edit mode
                          editMode={editMode}
                          deleteChoice={operateDataFunctions.deleteChoice}
                          onImageChange={image => {
                            operateDataFunctions.onChoiceImageChange(choice.uuid, image, materialUuid || '');
                          }}
                          onTextChange={text => {
                            operateDataFunctions.onChoiceTextChange(choice.uuid, text);
                          }}
                          multiSelectMode={componentData.multiSelectMode}
                          cardMode={cardMode}
                          key={choice.uuid}
                          index={index + 1}
                          choice={choice}
                          userReactionState={userReactionState}
                        />
                      );
                    })}
                  </React.Fragment>
                ) : null}
                {editMode && (
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={componentData.multiSelectMode}
                          onChange={operateDataFunctions.onMultiSelectModeChange}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label="Multi-select mode"
                    />
                    <br />
                    <StyledChoiceButton onClick={operateDataFunctions.onAddChoice} style={{ textAlign: 'center' }}>
                      + Add answer
                    </StyledChoiceButton>
                  </div>
                )}
              </Paper>
            </ContainerItem>
          </Container>
        </div>
      ) : (
        <div>Loading...</div> // TODO replace with spinner
      )}
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
            setUserReactionState('checked');
            /* eslint-disable @typescript-eslint/camelcase */
            material.reaction_start_on = reactionStart.current.toISOString();
            console.log(material.reaction_start_on);
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
