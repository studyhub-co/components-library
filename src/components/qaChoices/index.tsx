import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';

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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQAProps {
  component: any;
  currentMaterial: materialActionCreators.MaterialRedux;
  editMode: boolean;
  componentData: IQAData;
  // redux actions
  fetchMaterial(uuid: string | undefined): void;
}

const Index: React.FC<IQAProps> = props => {
  const { currentMaterial, editMode: editModeProp, fetchMaterial, componentData: componentDataProp } = props;
  // const textInput = createRef<HTMLInputElement>();

  // const [state, setState] = React.useState({
  //   selectedChoiceUuid: '',
  //   editMode: editMode,
  // });
  const [selectedChoiceUuid, setSelectedChoiceUuid] = useState('');
  const [editMode, setEditMode] = useState(editModeProp);
  const [cardMode, setCardMode] = useState(false);

  const { data: componentData, dispatch } = useComponentData(componentDataProp, currentMaterial);
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
    if (editModeProp === false) {
      // TODO update componentData redux state
    }
  }, [editModeProp]);

  useEffect(() => {
    fetchMaterial(undefined);
  }, [fetchMaterial]);

  useEffect(() => {
    // if we have at least one image in choice enable cardMode
    if (componentData) {
      let cardMode = false;
      cardMode = componentData.choices.some(choice => choice.content.image);
      setCardMode(cardMode);
    }
  }, [componentData]);

  const selectChoiceUuid = (uuid: string): void => {
    setSelectedChoiceUuid(uuid);
  };

  const deleteChoice = (uuid: string): void => {
    if (componentData) {
      dispatch({ type: 'DELETE_CHOICE', payload: uuid });
    }
  };

  const onQuestionTextChange = (text: string): void => {
    if (componentData) {
      dispatch({ type: 'QUESTION_TEXT_CHANGE', payload: text });
    }
  };

  const onQuestionHintChange = (image: string): void => {
    if (componentData) {
      dispatch({ type: 'QUESTION_HINT_CHANGE', payload: image });
    }
  };

  const onQuestionImageChange = (image: string): void => {
    if (componentData) {
      dispatch({ type: 'QUESTION_IMAGE_CHANGE', payload: image });
    }
  };

  const onChoiceImageChange = (uuid: string, image: File): void => {
    if (componentData) {
      const newChoice = { uuid, image };
      dispatch({ type: 'CHOICE_IMAGE_CHANGE', payload: newChoice });
    }
  };

  const onChoiceTextChange = (uuid: string, text: string): void => {
    if (componentData) {
      const newChoice = { uuid, text };
      dispatch({ type: 'CHOICE_TEXT_CHANGE', payload: newChoice });
    }
  };

  const onAddChoice = (): void => {
    // Add choice to data
    if (componentData) {
      dispatch({ type: 'ADD_CHOICE', payload: {} });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {componentData && ( // need to wait componentData
          <Container>
            <ContainerItem>
              <Paper>
                <Question
                  onHintChange={onQuestionHintChange}
                  editMode={editMode}
                  question={componentData.question}
                  onTextChange={onQuestionTextChange}
                  onImageChange={onQuestionImageChange}
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
                          selected={selectedChoiceUuid === choice.uuid}
                          onSelect={uuid => selectChoiceUuid(uuid)}
                          editMode={editMode}
                          deleteChoice={deleteChoice}
                          onImageChange={image => {
                            onChoiceImageChange(choice.uuid, image);
                          }}
                          onTextChange={text => {
                            onChoiceTextChange(choice.uuid, text);
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
                    <StyledChoiceButton onClick={onAddChoice} style={{ textAlign: 'center' }}>
                      + Add answer
                    </StyledChoiceButton>
                  </div>
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
