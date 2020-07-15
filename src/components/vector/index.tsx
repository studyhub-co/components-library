import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';

import { VectorData as IVectorData } from './IData/index';

import { VectorCanvas } from './vectorCanvas';

import { theme } from '../style';
import EditableLabel from '../editable/label';
import Question from '../common/question';

import { Material } from '../../models/';

import { useComponentData } from './componentData';

// import { StyledChoiceButton } from './style';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IVectorProps {
  // direct props
  materialUuid: string | undefined;
  lessonUuid: string | undefined;
  previousMaterialUuid: string | undefined;
  currentMaterial: materialActionCreators.MaterialRedux;
  editMode: boolean;
  componentData: IVectorData;
  // redux actions
  fetchMaterial(uuid: string | undefined): void;
  fetchMaterialStudentView(lessonUuid: string | undefined, previousMaterialUuid: string | undefined): void;
  updateMaterial(material: Material): void;
  checkUserMaterialReaction(material: Material): void;
}

const Index: React.FC<IVectorProps> = props => {
  const {
    editMode: editModeProp,
    componentData: componentDataProp,
    materialUuid,
    lessonUuid,
    previousMaterialUuid,
    currentMaterial,
    // actions
    fetchMaterial,
    fetchMaterialStudentView,
    checkUserMaterialReaction,
    updateMaterial,
  } = props;

  const [editMode, setEditMode] = useState(editModeProp);

  const { data: componentData, operateDataFunctions } = useComponentData(componentDataProp, currentMaterial);

  // TODO move to common hooks
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
    // console.log(currentMaterial);

    if (editModeProp === true) {
      // load as data edit
      if (materialUuid) {
        fetchMaterial(materialUuid);
      }
    } else if (lessonUuid) {
      // load as student view (with hidden fields)
      fetchMaterialStudentView(lessonUuid, previousMaterialUuid);
    }
  }, [editModeProp, fetchMaterial, fetchMaterialStudentView, lessonUuid, materialUuid, previousMaterialUuid]);

  // const onQuestionTextChange = (text: string): void => {
  //   if (componentData) {
  //     dispatch({ type: 'QUESTION_TEXT_CHANGE', payload: text });
  //   }
  // };
  //
  // const onQuestionTextOnly = (checked: boolean): void => {
  //   if (componentData) {
  //     dispatch({ type: 'QUESTION_TEXT_ONLY', payload: checked });
  //   }
  // };
  //
  // const onQuestionImageChange = (image: string): void => {
  //   if (componentData) {
  //     dispatch({ type: 'QUESTION_IMAGE_CHANGE', payload: image });
  //   }
  // };
  //
  // const onAnswerImageChange = (image: string): void => {
  //   if (componentData) {
  //     dispatch({ type: 'ANSWER_IMAGE_CHANGE', payload: image });
  //   }
  // };
  //
  // const onAnswerTextChange = (text: string): void => {
  //   if (componentData) {
  //     dispatch({ type: 'ANSWER_TEXT_CHANGE', payload: text });
  //   }
  // };
  //
  // const onQuestionHintChange = (text: string): void => {
  //   if (componentData) {
  //     dispatch({ type: 'QUESTION_HINT_CHANGE', payload: text });
  //   }
  // };

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
                  onImageChange={operateDataFunctions.onQuestionImageChange}
                />
                <br />
                <VectorCanvas
                  clear={true}
                  canvasId={'question'}
                  // objects={objects}
                  allowInput={true}
                  // updateAnswer={ans => this.props.onVectorChanged(ans[1].vector.x_component, ans[1].vector.y_component)}
                  // question={{ uuid: this.props.question }}
                />
                {editMode && (
                  <React.Fragment>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={componentData.questionTextOnly}
                          onChange={(e, checked) => {
                            operateDataFunctions.onQuestionTextOnly(checked);
                          }}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label="Question text only"
                    />
                    <br />
                    <FormControlLabel
                      control={<Checkbox checked={false} onChange={() => {}} name="checkedB" color="primary" />}
                      label="Null vector"
                    />
                  </React.Fragment>
                )}
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                <Question
                  editMode={editMode}
                  question={componentData.answer}
                  onTextChange={operateDataFunctions.onAnswerTextChange}
                  onImageChange={operateDataFunctions.onAnswerImageChange}
                />
                <br />
                <VectorCanvas
                  clear={true}
                  canvasId={'answer'}
                  // objects={objects}
                  allowInput={true}
                  // updateAnswer={ans => this.props.onVectorChanged(ans[1].vector.x_component, ans[1].vector.y_component)}
                  // question={{ uuid: this.props.question }}
                />
                <br />
                {editMode && (
                  <React.Fragment>
                    <FormControlLabel
                      control={<Checkbox checked={false} onChange={() => {}} name="checkedB" color="primary" />}
                      label="Answer text only"
                    />
                    <br />
                    <FormControlLabel
                      control={<Checkbox checked={false} onChange={() => {}} name="checkedB" color="primary" />}
                      label="Null vector"
                    />
                    <br />
                    <FormControl>
                      <InputLabel id="demo-simple-select-label">To check:</InputLabel>
                      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={10} onChange={() => {}}>
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
    </ThemeProvider>
  );
};

export default connect(
  (state: any) => {
    return { currentMaterial: state.material };
  },
  dispatch => bindActionCreators(materialActionCreators, dispatch),
)(Index);
