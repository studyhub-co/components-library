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

import Question from '../common/question';
import Choice from './choice';

import { Choice as IChoice } from './IData/choices';
import { QAData as IQAData } from './IData/index';

// hook to work with componentData
// import { useComponentData } from '../hooks/componentData';
// import { reducer } from './reducer';
import { useComponentData } from './componentData';

import { theme } from '../style';
import { StyledChoiceButton } from './style';
import CheckContinueButton from '../common/checkContinueButton';
// import { checkSaveButtonStyle, checkSaveButtonStyleDisabled } from './style';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQAProps {
  // component: any;
  // props
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  editMode: boolean;
  componentData: IQAData;
  // redux actions
  fetchMaterial(uuid: string): void;
  fetchMaterialStudentView(uuid: string): void;
  updateMaterial(material: Material): void;
  checkUserMaterialReaction(material: Material): void;
  // redux store
  currentMaterial: materialActionCreators.MaterialRedux;
  // userMaterialReactionResult: IUserReactionResult;
  userMaterialReactionResult: userMaterialReactionCreators.UserReactionResultRedux;
}

const Index: React.FC<IQAProps> = props => {
  const {
    currentMaterial,
    userMaterialReactionResult,
    editMode: editModeProp,
    fetchMaterial,
    fetchMaterialStudentView,
    updateMaterial,
    checkUserMaterialReaction,
    componentData: componentDataProp,
    materialUuid,
    lessonUuid,
  } = props;
  // const textInput = createRef<HTMLInputElement>();

  // const [state, setState] = React.useState({
  //   selectedChoiceUuid: '',
  //   editMode: editMode,
  // });
  // const [selectedChoiceUuid, setSelectedChoiceUuid] = useState('');
  const [editMode, setEditMode] = useState(editModeProp);
  const [cardMode, setCardMode] = useState(false);
  const [disabledCheck, setSetDisabledCheck] = useState(true);

  const { data: componentData, operateDataFunctions } = useComponentData(componentDataProp, currentMaterial);
  // const { data: componentData, dispatch } = useComponentData(reducer, componentDataProp, currentMaterial);

  useEffect(() => {
    // catch parent event inside iframe
    window.addEventListener('message', ({ data }) => {
      if (data.hasOwnProperty('type')) {
        if (data.type === 'pib_edit_mode') {
          if (data.data === 'edit') {
            setEditMode(true);
          } else {
            setEditMode(false);
          }
        }
      }
      return window.removeEventListener('message', () => {});
    });
  }, []);

  useEffect(() => {
    setEditMode(editModeProp);
    if (materialUuid) {
      // if (componentData) operateDataFunctions.resetComponentData();
      if (editModeProp === true) {
        // load as data edit
        fetchMaterial(materialUuid);
      } else if (lessonUuid) {
        // load as student edit (with hidden fields)
        fetchMaterialStudentView(lessonUuid);
      }
    }
  }, [editModeProp, fetchMaterial, fetchMaterialStudentView, lessonUuid, materialUuid]);
  // }, [editModeProp, fetchMaterial, fetchMaterialStudentView, materialUuid]);

  useEffect(() => {
    if (componentData) {
      // if we have at least one image in choice enable cardMode
      const cardMode = componentData.choices.some(choice => choice.content.image);
      setCardMode(cardMode);
      // if we have selected choices
      const hasSelected = componentData.choices.some(choice => choice.selected);
      setSetDisabledCheck(!hasSelected);
    }
  }, [componentData]);

  const handleSaveDataClick = () => {
    const material: Material = { uuid: currentMaterial.uuid, data: componentData };
    updateMaterial(material);
  };

  const handleCheckClick = () => {
    const material: Material = { uuid: currentMaterial.uuid, data: componentData };
    checkUserMaterialReaction(material);
  };

  // const selectAnswerChoiceUuid = (uuid: string): void => {
  //   console.log(`answer with ${uuid} selected`);
  // };

  if (userMaterialReactionResult && userMaterialReactionResult.isFetching == false) {
    // TODO show correct / wrong answer to the user
  }

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
                          // selected={selectedChoiceUuid === choice.uuid}
                          selected={choice.selected}
                          // onSelect={editMode ? operateDataFunctions.selectChoiceUuid : selectAnswerChoiceUuid}
                          onSelect={operateDataFunctions.selectChoiceUuid}
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
          <CheckContinueButton
            editMode={editMode}
            componentData={componentData}
            checkUserMaterialReaction={checkUserMaterialReaction}
            currentMaterial={currentMaterial}
            disabledCheck={disabledCheck}
            updateMaterial={updateMaterial}
          />
          {/*<div style={{ textAlign: 'center' }}>*/}
          {/*  /!*<div style={{ position: 'fixed', bottom: theme.spacing(2), right: theme.spacing(2) }}>*!/*/}
          {/*  {currentMaterial && editMode ? (*/}
          {/*    <Button style={checkSaveButtonStyle} variant="contained" color="primary" onClick={handleSaveDataClick}>*/}
          {/*      Save*/}
          {/*    </Button>*/}
          {/*  ) : (*/}
          {/*    <Button*/}
          {/*      disabled={disabledCheck}*/}
          {/*      style={disabledCheck ? checkSaveButtonStyleDisabled : checkSaveButtonStyle}*/}
          {/*      variant="contained"*/}
          {/*      color="primary"*/}
          {/*      onClick={handleCheckClick}*/}
          {/*    >*/}
          {/*      Check*/}
          {/*    </Button>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>
      ) : (
        <div>Loading...</div>
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
