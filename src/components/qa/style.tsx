import styled from 'styled-components';
// import { makeStyles } from '@material-ui/core/styles';
// import { base } from '../../style';

// export const useStyles = makeStyles({
//     root: {
//         // padding: 0,
//         // marginTop: '1%',
//         borderRadius: '1vw',
//         minHeight: '50vh',
//         backgroundColor: 'white',
//         boxShadow: '0 0 1vw #d8d8d8',
//     },
// });

// styled plain react with @emotion/styled
export const StyledChoiceButton = styled.div`
  border-radius: 12rem;
  border: 0.2rem solid gray;
  padding: 1rem 2rem;
  margin: 1rem;
  background: rgba(255, 255, 255, 0);
  position: relative;
  color: gray;
  transition: color 0.3s, border 0.3s;
  text-align: justify;
  cursor: pointer;
  &:hover {
    color: #1caff6;
    border: 0.2rem solid #1caff6;
  }
`;

export const ChoiceIndex = styled.span`
  position: 'absolute';
  top: '50%';
  transform: 'translate(-50%,-50%)';
`;
