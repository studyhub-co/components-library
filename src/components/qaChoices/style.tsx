import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
// import { base } from '../../style';

export const useStyles = makeStyles({
  choiceButtonWrong: {
    boxShadow: 'rgb(255, 0, 0) 0px 0px 10px',
  },
  choiceButtonCorrect: {
    boxShadow: 'green 0px 0px 15px',
    border: '2px solid rgb(79, 212, 24)',
  },
});

// export const useRadioStyle = makeStyles({
//   root: {
//     '&:hover': {
//       backgroundColor: 'transparent',
//     },
//   },
// });

export const StyledChoiceButton = styled.div`
  border-radius: 12rem;
  border: 0.2rem solid gray;
  padding: 1vh 1vw;
  margin: 2vh 1vw;
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

// export const checkSaveButtonStyle = {
//   borderRadius: '12rem',
//   border: '.2rem solid #1caff6',
//   background: '#1caff6',
//   color: '#fff',
//   transition: 'color .5s,border .5s',
//   outline: 'none',
//   width: '60%',
//   margin: '2rem 0 2rem 0',
// };
//
// export const checkSaveButtonStyleDisabled = {
//   ...checkSaveButtonStyle,
//   background: 'gray',
//   border: '.2rem solid gray;',
// };
