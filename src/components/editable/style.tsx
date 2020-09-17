import styled from 'styled-components';

export const StyledMathButton = styled.span`
  border: 0.1rem solid black;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin: 0.3rem;
  font-weight: 400;
  font-size: 150%;
  line-height: 2;
  cursor: pointer !important;
  & > .mq-math-mode {
    cursor: pointer !important;
  }
`;
