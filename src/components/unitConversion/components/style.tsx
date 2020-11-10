import styled from 'styled-components';

export const StyledButton = styled.div`
  border-radius: 12rem;
  border: 0.2rem solid gray;
  padding: 0.5rem;
  margin: 1rem;
  background: rgba(255, 255, 255, 0);
  position: relative;
  color: gray;
  flex-grow: 1;
  transition: color 0.3s, border 0.3s;
  text-align: justify;
  cursor: pointer;
  &:hover {
    color: #1caff6;
    border: 0.2rem solid #1caff6;
  }
`;
