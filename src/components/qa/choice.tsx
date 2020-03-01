import React from 'react';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';

import { StyledChoiceButton, ChoiceIndex } from './style';
import EditableLabel from '../editable/label';
import { useRadioStyle } from './style';
import Radio from '@material-ui/core/Radio';

interface ChoiceProps {
  choice: any;
  index: number;
  editMode: boolean;
}

const Choice: React.FC<ChoiceProps> = props => {
  const { choice, index, editMode } = props;
  const classesRadio = useRadioStyle();

  const [state, setState] = React.useState({
    hovered: false,
  });

  const onDeleteChoiceClick = (e: any) => {
    console.log(onDeleteChoiceClick);
    // this.props.onDeleteImageClick()
  };

  // const selectionControl = (
  //   <input
  //     id={choice.uuid}
  //     // type={this.props.exclusive ? 'radio' : 'checkbox'}
  //     // onChange={this.props.onSelectChange}
  //     value={choice.content.text}
  //     // checked={this.props.is_correct}
  //   />
  // );

  return (
    <StyledChoiceButton>
      <ChoiceIndex>{state.hovered ? <FaTrashAlt onClick={onDeleteChoiceClick} /> : index}</ChoiceIndex>
      <Radio
        // checked={selectedValue === 'b'}
        // onChange={handleChange}
        value="b"
        name="radio-button-demo"
        inputProps={{ 'aria-label': 'B' }}
      />
      <EditableLabel value={choice.content.text} editMode={editMode} />
    </StyledChoiceButton>
  );
};

export default Choice;
