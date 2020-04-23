import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';

import Question from './question';
import Choice from './choice';

import { Question as IQuestion } from './IData/question';
import { Choice as IChoice } from './IData/choices';

// hook to work with componentData across any components
import { useComponentData } from '../hooks/componentData';
import { ComponentsData as IComponentsData } from '../hooks/IData';

import { theme } from '../style';
import { StyledChoiceButton } from './style';
// import { on } from 'cluster';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IChoicesProps {
  component: any;
  currentMaterial: materialActionCreators.MaterialRedux;
  editMode: boolean;
  componentData: IComponentsData;
  // redux actions
  fetchMaterial(uuid: string | undefined): void;
}

const Index: React.FC<IChoicesProps> = props => {
  const { currentMaterial, editMode: editModeProp, fetchMaterial, componentData: componentDataProp } = props;
  // const textInput = createRef<HTMLInputElement>();

  // const [state, setState] = React.useState({
  //   selectedChoiceUuid: '',
  //   editMode: editMode,
  // });
  const [selectedChoiceUuid, setSelectedChoiceUuid] = useState('');
  const [editMode, setEditMode] = useState(editModeProp);

  const { data: componentData, setComponentData } = useComponentData(componentDataProp, currentMaterial);
  // const [componentData, setComponentData] = useComponentData(componentDataProp, currentMaterial);

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

  const selectChoiceUuid = (uuid: string) => {
    setSelectedChoiceUuid(uuid);
  };

  const deleteChoice = (uuid: string) => {
    // TODO delete choice from Data and reload Material
    console.log(uuid);
  };

  const onQuestionChange = (question: IQuestion) => {
    if (componentData) {
      componentData.question = question;
      setComponentData(componentData);
    }
  };

  const onChoiceChange = (newChoice: IChoice) => {
    if (componentData) {
      const choiceIndex = componentData.choices.findIndex(el => el.uuid === newChoice.uuid);
      // componentData[choiceIndex] = newChoice;
      // setComponentData(componentData);
    }
  };

  const onChoiceAdd = () => {
    // Add choice to data
  };

  // if (componentData) {
  //   console.log(componentData);
  // }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {componentData && ( // need to wait componentData
          <Container>
            <ContainerItem>
              <Paper>
                <Question editMode={editMode} question={componentData.question} onChange={onQuestionChange} />
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                {componentData.choices ? (
                  <React.Fragment>
                    {componentData.choices.map((choice, index) => {
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
                  <StyledChoiceButton onClick={onChoiceAdd} style={{ textAlign: 'center' }}>
                    + Add answer
                  </StyledChoiceButton>
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
