import React, { createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';

import Question from './question';
import Choice from './choice';

import { theme } from '../style';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IChoicesProps {
  component: any;
  currentMaterial: materialActionCreators.MaterialRedux;
  fetchMaterial(uuid: string | undefined): void;
  editMode: boolean;
}

const Index: React.FC<IChoicesProps> = props => {
  const { currentMaterial, editMode, fetchMaterial } = props;
  // const textInput = createRef<HTMLInputElement>();
  // function addTodo(e: React.KeyboardEvent<HTMLInputElement>): void {
  // }

  useEffect(() => {
    fetchMaterial(undefined);
  }, []);

  const [state, setState] = React.useState({
    selectedChoiceUuid: '',
  });

  const selectChoiceUuid = (uuid: string) => {
    setState({ selectedChoiceUuid: uuid });
  };

  const deleteChoice = (uuid: string) => {
    // TODO delete choice from Data and reload Material
    console.log(uuid);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        <Container>
          <ContainerItem>
            <Paper>
              <Question material={currentMaterial} />
            </Paper>
          </ContainerItem>
          <ContainerItem>
            <Paper>
              editMode: {editMode.toString()}
              {currentMaterial && currentMaterial.data && currentMaterial.data.choices ? (
                <React.Fragment>
                  {currentMaterial.data.choices.map((choice, index) => {
                    return (
                      <Choice
                        selected={state.selectedChoiceUuid === choice.uuid}
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
            </Paper>
          </ContainerItem>
        </Container>
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
