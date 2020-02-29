import React from 'react';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';

import { StyledChoiceButton, ChoiceIndex } from './style';

interface ChoiceProps {
  choice: any;
  index: number;
}

const Choice: React.FC<ChoiceProps> = props => {
  const { choice, index } = props;

  const [state, setState] = React.useState({
    hovered: false,
  });

  const onDeleteChoiceClick = (e: any) => {
    console.log(onDeleteChoiceClick);
    // this.props.onDeleteImageClick()
  };

  const selectionControl = (
    <input
      id={choice.uuid}
      // type={this.props.exclusive ? 'radio' : 'checkbox'}
      // onChange={this.props.onSelectChange}
      value={choice.content.text}
      // checked={this.props.is_correct}
    />
  );

  return (
    <StyledChoiceButton>
      <ChoiceIndex>
        {state.hovered ? <FaTrashAlt onClick={onDeleteChoiceClick} /> : index}
        {selectionControl}
      </ChoiceIndex>
    </StyledChoiceButton>
  );
};

export default Choice;
