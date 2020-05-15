import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';

import { uuidV4 } from '../../utils/index';

import Question from '../common/question';
import Choice from './choice';

// import { Question as IQuestion } from '../common/IData/question';
import { Choice as IChoice } from './IData/choices';
import { QAData as IQAData } from './IData/index';

// hook to work with componentData
// import { useComponentData } from '../hooks/componentData';
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

  const { data: componentData, dispatch } = useComponentData(componentDataProp, currentMaterial);

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

  const selectChoiceUuid = (uuid: string): void => {
    setSelectedChoiceUuid(uuid);
  };

  const deleteChoice = (uuid: string): void => {
    // TODO delete choice from Data and reload Material
    dispatch({ type: 'DELETE_CHOICE', payload: uuid });
  };

  const onQuestionTextChange = (text: string): void => {
    if (componentData) {
      dispatch({ type: 'QUESTION_TEXT_CHANGE', payload: text });
    }
  };

  const onChoiceChange = (newChoice: IChoice): void => {
    // if (componentData) {
    //   dispatch({ type: 'REPLACE_DATA', payload: newChoice });
    //   // const choiceIndex = componentData.choices.findIndex(el => el.uuid === newChoice.uuid);
    //   // componentData.choices[choiceIndex] = newChoice;
    //   // setComponentData(componentData);
    // }
  };

  const onAddChoice = (): void => {
    // Add choice to data
    // if (componentData) {
    //   // TODO move to redux
    //   componentData.choices.push({
    //     uuid: uuidV4(),
    //     content: { text: '' },
    //     position: componentData.choices.length,
    //     type: 'base',
    //   } as IChoice);
    //   // setComponentData(componentData);
    // }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {componentData && ( // need to wait componentData
          <Container>
            <ContainerItem>
              <Paper>
                <Question editMode={editMode} question={componentData.question} onTextChange={onQuestionTextChange} />
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
                          onChange={onChoiceChange}
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
