import React, { createRef } from 'react';
import Container from '../layout/Container';
import ContainerItem from '../layout/ContainerItem';
import Paper from '../layout/Paper';

// import Container from '../layout/Container';
// import { Container } from './style';

const Choices: React.FC = () => {
  // const textInput = createRef<HTMLInputElement>();
  // function addTodo(e: React.KeyboardEvent<HTMLInputElement>): void {
  //
  // }
  // TODO create layout for QA type (left-hand question, etc)
  return (
    <div style={{ flexGrow: 1, padding: '1rem' }}>
      <Container>
        <ContainerItem>
          <Paper>Question</Paper>
        </ContainerItem>
        <ContainerItem>
          <Paper>Answer</Paper>
        </ContainerItem>
      </Container>
    </div>
  );
};

export default Choices;
