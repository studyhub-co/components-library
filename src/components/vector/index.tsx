import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { FaTimes } from 'react-icons/fa';
import IconButton from '@material-ui/core/IconButton';

import { theme } from '../style';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

import { Material } from '../../models/';

import { VectorData as IVectorData } from './IData/index';

import { VectorCanvas, CanvasVector } from './vectorCanvas';

import Question from '../common/question';
import Footer from '../common/footer';

import { useComponentData } from './componentData';
import { useSpaEventsHook } from '../hooks/spaEvents';
import { Vector as IVector } from './IData/vector';
import { useUserMaterialReactionResult } from '../hooks/userMaterialReactionResult';
import { useFetchMaterial } from '../hooks/fetchMaterial';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IVectorProps {
  // direct props
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  editMode?: boolean;
  componentData?: IVectorData;
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

const VECTOR_COLORS = ['red', 'blue', 'green', 'yellow'];

const Index: React.FC<IVectorProps> = props => {
  const {
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
  const [userReactionState, setUserReactionState] = useState('start'); // 'start', 'checked', etc
  const { data: componentData, operateDataFunctions } = useComponentData(componentDataProp, currentMaterial);
  const [showFooter, setShowFooter] = useState(showFooterProp || false);
  const [disabledCheck, setDisabledCheckS] = useState(true);

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

  const vectorCanvases = (vectorsList: Array<any>) => {
    const objects = [];
    for (const i in vectorsList) {
      const pointer = {
        x: VectorCanvas.calcVectorXStart(vectorsList[i].xComponent),
        y: VectorCanvas.calcVectorYStart(vectorsList[i].yComponent),
      };
      const endPointer = {
        x: pointer['x'] + VectorCanvas.calcCanvasMagnitude(vectorsList[i].xComponent),
        y: pointer['y'] - VectorCanvas.calcCanvasMagnitude(vectorsList[i].yComponent),
      };

      const v = new CanvasVector(null, pointer, VECTOR_COLORS[i]);
      v.complete(endPointer);
      objects.push(v);
    }
    return objects;
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {componentData && ( // need to wait componentData
          <Container>
            <ContainerItem>
              <Paper>
                <Question
                  onHintChange={operateDataFunctions.onQuestionHintChange}
                  editMode={editMode}
                  question={componentData.question}
                  onTextChange={operateDataFunctions.onQuestionTextChange}
                  onImageChange={image => operateDataFunctions.onQuestionImageChange(image, materialUuid || '')}
                  mathMode={false}
                />
                <br />
                {!componentData.questionTextOnly && (
                  <VectorCanvas
                    clear={true}
                    canvasId={'question'}
                    objects={vectorCanvases(componentData.questionVectors)}
                    // objects={objects}
                    allowInput={true}
                    updateAnswer={(ans: any) => {
                      operateDataFunctions.onQuestionVectorAdd(ans.vector as IVector);
                    }}
                  />
                )}
                {editMode && (
                  <React.Fragment>
                    <IconButton color="primary" onClick={operateDataFunctions.onQuestionClearVector} component="div">
                      <FaTimes /> clear
                    </IconButton>
                    <br />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={componentData.questionTextOnly}
                          onChange={(e, checked) => {
                            operateDataFunctions.onQuestionTextOnly(checked);
                          }}
                          name="checkedQTextOnly"
                          color="primary"
                        />
                      }
                      label="Question text only"
                    />
                    <br />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={componentData.questionVectorIsNull}
                          onChange={(e, checked) => {
                            operateDataFunctions.onQuestionIsNullVector(checked);
                          }}
                          name="checkedQNUlll"
                          color="primary"
                        />
                      }
                      label="Null vector"
                    />
                  </React.Fragment>
                )}
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                {/* show always */}
                {componentData.answerTextOnly || (editMode && componentData.answerVectors.length === 0) ? (
                  <Question
                    editMode={true}
                    // editTextMode={!editMode} // TODO do we need answer image support?
                    editTextMode={true}
                    question={componentData.answer}
                    onTextChange={operateDataFunctions.onAnswerTextChange}
                    onImageChange={operateDataFunctions.onAnswerImageChange}
                    mathButtons={['\\hat{x}', '\\hat{y}', '1', '2', '3', '4', '+', '-']}
                    mathMode={true}
                  />
                ) : null}
                <br />
                {!componentData.answerTextOnly &&
                  !componentData.answer.content.text &&
                  !componentData.answer.content.image && (
                    <VectorCanvas
                      clear={true}
                      canvasId={'answer'}
                      // objects={objects} // objects -> objects that we need to draw on Canvas
                      objects={vectorCanvases(componentData?.answerVectors)}
                      allowInput={componentData?.answerVectors?.length < 4}
                      updateAnswer={(ans: any) => {
                        operateDataFunctions.onAnswerVectorAdd(ans.vector as IVector);
                      }}
                      // updateAnswer={ans => this.props.onVectorChanged(ans[1].vector.x_component, ans[1].vector.y_component)}
                      // question={{ uuid: this.props.question }}
                    />
                  )}
                <br />
                {editMode || componentData.answerNullableVector ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={componentData.answerVectorIsNull}
                        onChange={(e, checked) => {
                          operateDataFunctions.onAnswerIsNullVector(checked);
                        }}
                        name="checkedANull"
                        color="primary"
                      />
                    }
                    label="Null vector"
                  />
                ) : null}
                <br />
                {editMode && (
                  <React.Fragment>
                    <IconButton color="primary" onClick={operateDataFunctions.onAnswerClearVector} component="div">
                      <FaTimes /> clear
                    </IconButton>
                    <br />
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled
                          checked={componentData.answerTextOnly}
                          onChange={(e, checked) => {
                            operateDataFunctions.onAnswerTextOnly(checked);
                          }}
                          name="checkedATextOnly"
                          color="primary"
                        />
                      }
                      label="Answer text only"
                    />
                    <br />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={componentData.answerNullableVector}
                          onChange={(e, checked) => {
                            operateDataFunctions.onAnswerNullableVector(checked);
                          }}
                          name="checkedANullable"
                          color="primary"
                        />
                      }
                      label="Nullable vector (Show 'Null vector' checkbox for student)"
                    />
                    <br />
                    <FormControl>
                      <InputLabel id="demo-simple-select-label">To check:</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={componentData.answerToCheck}
                        onChange={event => {
                          const value: number = event.target.value as number;
                          operateDataFunctions.onAnswerToCheck(value);
                        }}
                      >
                        <MenuItem value={10}>Full vector match</MenuItem>
                        <MenuItem value={20}>Magnitude only</MenuItem>
                        <MenuItem value={30}>Angle only</MenuItem>
                      </Select>
                    </FormControl>
                  </React.Fragment>
                )}
              </Paper>
            </ContainerItem>
          </Container>
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
            setUserReactionState('checked');
            /* eslint-disable @typescript-eslint/camelcase */
            material.reaction_start_on = reactionStart.current.toISOString();
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
