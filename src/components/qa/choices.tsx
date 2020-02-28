import React, { createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Container from '../layout/Container';
import ContainerItem from '../layout/ContainerItem';
import Paper from '../layout/Paper';

import * as materialActionCreators from '../../redux/modules/material';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IChoicesProps {
  component: any;
  currentMaterial: materialActionCreators.MaterialRedux;
  fetchMaterial(uuid: string | undefined): void;
}

const Choices: React.FC<IChoicesProps> = props => {
  const { currentMaterial, fetchMaterial } = props;
  // const textInput = createRef<HTMLInputElement>();
  // function addTodo(e: React.KeyboardEvent<HTMLInputElement>): void {
  //
  // }

  useEffect(() => {
    fetchMaterial(undefined);
  }, []);

  console.log(currentMaterial.uuid);

  return (
    <div style={{ flexGrow: 1, padding: '1rem' }}>
      <Container>
        <ContainerItem>
          <Paper>
            {currentMaterial.uuid === ''
              ? 'This is question text!' // question loaded from server (material.data)
              : currentMaterial.uuid}
          </Paper>
        </ContainerItem>
        <ContainerItem>
          <Paper>
            {currentMaterial.uuid === ''
              ? 'This is answers text!' // question loaded from server (material.data)
              : currentMaterial.uuid}
          </Paper>
        </ContainerItem>
      </Container>
    </div>
  );
};

export default connect(
  (state: any) => {
    return { currentMaterial: state.material };
  },
  dispatch => bindActionCreators(materialActionCreators, dispatch),
)(Choices);
