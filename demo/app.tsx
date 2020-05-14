import React, { useEffect } from 'react';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import QA from '../src/components/qa';
import Vector from '../src/components/vector';
import { theme } from '../src/components/style';
import { ThemeProvider } from '@material-ui/styles';

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
    <ThemeProvider theme={theme}>
      <div>
        <h1>Q&A</h1>
        <FormControlLabel
          control={
            <Switch checked={state.checkedEditMode} color="primary" onChange={handleEditModeChange()} value="" />
          }
          label="Edit Mode"
        />
        <QA editMode={state.checkedEditMode} />
        <h1>Vector</h1>
        <Vector editMode={state.checkedEditMode} />
      </div>
    </ThemeProvider>
  );
};

export default App;
