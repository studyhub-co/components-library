import React from 'react';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Choices from '../src/components/qa';

const App: React.FC = () => {
  // const textInput = createRef<HTMLInputElement>();
  // function addTodo(e: React.KeyboardEvent<HTMLInputElement>): void {
  //
  // }

  const [state, setState] = React.useState({
    checkedEditMode: false,
  });

  const handleEditModeChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, checkedEditMode: event.target.checked });
  };

  return (
    <div>
      <h1>Choices</h1>
      <FormControlLabel
        control={<Switch checked={state.checkedEditMode} color="primary" onChange={handleEditModeChange()} value="" />}
        label="Edit Mode"
      />
      <Choices editMode={state.checkedEditMode} />
    </div>
  );
};

export default App;
