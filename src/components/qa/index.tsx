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

// hook to work with jsonData across any components
import { useJsonData } from '../hooks/jsonData';

import { theme } from '../style';
import { StyledChoiceButton } from './style';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IChoicesProps {
  component: any;
  currentMaterial: materialActionCreators.MaterialRedux;
  fetchMaterial(uuid: string | undefined): void;
  editMode: boolean;
  jsonData: any; // JSON DATA
}

const Index: React.FC<IChoicesProps> = props => {
  const { currentMaterial, editMode: editModeProp, fetchMaterial, jsonData: jsonDataProp } = props;
  // const textInput = createRef<HTMLInputElement>();
  // function addTodo(e: React.KeyboardEvent<HTMLInputElement>): void {
  // }

  // const [state, setState] = React.useState({
  //   selectedChoiceUuid: '',
  //   editMode: editMode,
  // });
  const [selectedChoiceUuid, setSelectedChoiceUuid] = useState('');
  const [editMode, setEditMode] = useState(editModeProp);

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

  const jsonData = useJsonData(jsonDataProp, currentMaterial);

  useEffect(() => {
    setEditMode(editModeProp);
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

  console.log(jsonData);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {jsonData && ( // need to wait jsonData
          <Container>
            <ContainerItem>
              <Paper>
                <Question editMode={editMode} question={jsonData.question} />
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                {/*editMode: {editMode.toString()}*/}
                {currentMaterial && currentMaterial.data && currentMaterial.data.choices ? (
                  <React.Fragment>
                    {currentMaterial.data.choices.map((choice, index) => {
                      return (
                        <Choice
                          selected={selectedChoiceUuid === choice.uuid}
                          onChange={uuid => selectChoiceUuid(uuid)}
                          editMode={editMode}
                          deleteChoice={deleteChoice}
                          key={choice.uuid}
                          index={index + 1}
                          choice={choice}
                        />
                      );
                    })}
                  </React.Fragment>
                ) : null}
                {editMode && <StyledChoiceButton style={{ textAlign: 'center' }}>+ Add answer</StyledChoiceButton>}
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
