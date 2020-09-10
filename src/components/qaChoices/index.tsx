import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';
import { Material } from '../../models/';
// , UserReactionResult as IUserReactionResult

import { QAData } from '../qaChoices/IData/index';

import Question from '../common/question';
import Choice from './choice';

import { Choice as IChoice } from './IData/choices';
import { QAData as IQAData } from './IData/index';

// hook to work with componentData
import { useComponentData } from './componentData';

import { theme } from '../style';
import { StyledChoiceButton } from './style';
// import CheckContinueButton from '../common/checkContinueButton';
import Footer from '../common/footer';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQAProps {
  // props
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  previousMaterialUuid: string | undefined;
  editMode: boolean;
  showFooter: boolean | undefined;
  componentData: IQAData;
  // redux actions
  fetchMaterial(uuid: string): void;
  // fetchMaterialStudentView(lessonUuid: string | undefined, previousMaterialUuid: string | undefined): void;
  fetchMaterialStudentView(lessonUuid: string | undefined, materialUuid: string | undefined): void;
  updateMaterial(material: Material): void;
  checkUserMaterialReaction(material: Material): void;
  // redux store
  currentMaterial: materialActionCreators.MaterialRedux;
  userMaterialReactionResult: userMaterialReactionCreators.UserReactionResultRedux;
  moveToNextComponent(
    // lessonUuid: string | undefined,
    // previousMaterialUuid: string | undefined,
    nextMaterialUuid: string | undefined,
  ): void;
}

const Index: React.FC<IQAProps> = props => {
  const {
    // direct props
    moveToNextComponent,
    componentData: componentDataProp,
    materialUuid,
    showFooter,
    lessonUuid,
    editMode: editModeProp,
    // redux store
    userMaterialReactionResult,
    currentMaterial,
    // actions
    fetchMaterial,
    fetchMaterialStudentView,
    checkUserMaterialReaction,
    updateMaterial,
    previousMaterialUuid,
  } = props;

  const [editMode, setEditMode] = useState(editModeProp);
  const [cardMode, setCardMode] = useState(false);
  const [disabledCheck, setDisabledCheckS] = useState(true);

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

  // todo userReactionStateHook
  const [userReactionState, setUserReactionState] = useState('start'); // 'start', 'checked', etc

  useEffect(() => {
    // console.log(userReactionState);
    // console.log(userMaterialReactionResult);

    if (userMaterialReactionResult) {
      setUserReactionState('checked');
    }

    window.parent.postMessage(
      {
        type: 'user_reaction_state',
        data: {
          state: userReactionState,
          userLessonScore: userMaterialReactionResult?.score,
          wasCorrect: userMaterialReactionResult?.was_correct,
        },
      },
      '*',
    );
  }, [userReactionState, userMaterialReactionResult]);

  const { data: componentData, operateDataFunctions } = useComponentData(componentDataProp, currentMaterial);
  // const { data: componentData, dispatch } = useComponentData(reducer, componentDataProp, currentMaterial);

  useEffect(() => {
    // catch parent event inside iframe
    const messageListener = ({ data }: { data: any }): any => {
      if (data.hasOwnProperty('type')) {
        // got edit_mode from parent window
        if (data.type === 'edit_mode') {
          if (data.data === 'edit') {
            setEditMode(true);
          } else {
            setEditMode(false);
          }
        }
        if (data.type === 'check_user_reaction') {
          if (!currentMaterial.isFetching && currentMaterial.uuid && componentData) {
            const reactionMaterial: Material = { uuid: currentMaterial.uuid, data: componentData };
            checkUserMaterialReaction(reactionMaterial);
          }
        }
        if (data.type === 'continue') {
          if (currentMaterial.uuid) {
            setUserReactionState('start');
            moveToNextComponent(userMaterialReactionResult.next_material_uuid);
            // send redirect url tp parent
            window.parent.postMessage(
              {
                type: 'redirect_to_material',
                data: { lessonUuid, nextMaterialUuid: userMaterialReactionResult.next_material_uuid },
              },
              '*',
            );
          }
        }
      }
    };

    // TODO check that we have only the one Listener
    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, [
    checkUserMaterialReaction,
    currentMaterial,
    componentData,
    userMaterialReactionResult,
    moveToNextComponent,
    lessonUuid,
  ]);

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
    // window.parent.postMessage(
    //   {
    //     type: 'redirect_to_material',
    //     data: { lessonUuid, nextMaterialUuid },
    //   },
    //   '*',
    // );
  }, [checkUserMaterialReaction, currentMaterial, lessonUuid]);

  useEffect(() => {
    setEditMode(editModeProp);
    setUserReactionState('start');
    if (editModeProp === true) {
      // load as data edit
      if (materialUuid) {
        fetchMaterial(materialUuid);
      }
    } else if (lessonUuid) {
      // load as student view (with hidden fields)
      fetchMaterialStudentView(lessonUuid, materialUuid);
    }
  }, [editModeProp, fetchMaterial, fetchMaterialStudentView, lessonUuid, materialUuid]);

  useEffect(() => {
    if (componentData) {
      // if we have at least one image in choice enable cardMode
      const newCardMode = componentData.choices.some(choice => choice.content.image);
      if (cardMode !== newCardMode) {
        setCardMode(cardMode);
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
      const correctData = userMaterialReactionResult.correct_data as QAData;

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
          const correctChoice: IChoice = correctData?.choices.find(({ uuid }) => uuid === componentDataChoice.uuid)!;

          // status of reaction of choice - 'none', 'correct', 'wrong'.
          if (correctChoice.selected) {
            // mark correct answer as was wrong (red)
            operateDataFunctions.onChoiceReactionResultChange(componentDataChoice.uuid, 'wrong');
          }
        }
      });
    }
  }, [componentData, materialUuid, operateDataFunctions, userMaterialReactionResult]);

  // disable Check / Continue button while user result reaction is fetching
  useEffect(() => {
    if (userMaterialReactionResult?.isFetching) {
      setDisabledCheck(true);
    } else {
      setDisabledCheck(false);
    }
  }, [userMaterialReactionResult]);

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
                  onImageChange={operateDataFunctions.onQuestionImageChange}
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
                            operateDataFunctions.onChoiceImageChange(choice.uuid, image);
                          }}
                          onTextChange={text => {
                            operateDataFunctions.onChoiceTextChange(choice.uuid, text);
                          }}
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
                      control={<Checkbox checked={false} onChange={() => {}} name="checkedB" color="primary" />}
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
