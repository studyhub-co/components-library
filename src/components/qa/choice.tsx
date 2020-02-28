import React from 'react';

interface ChoiceProps {
  choice: any;
}

const Choice: React.FC<ChoiceProps> = props => {
  const { choice } = props;
  // TODO add purebuttons
  return <div>{choice.content.text}</div>;
};

export default Choice;
