import React, { useEffect } from 'react';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import QAChoices from '../src/components/qaChoices';
import QABase from '../src/components/qaBase';
import Vector from '../src/components/vector';
import { theme } from '../src/components/style';
import { ThemeProvider } from '@material-ui/styles';
import { mockQaChoicesMaterial, mockVectorMaterial, mockQaBaseMaterial } from './mockData';

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
        <FormControlLabel
          control={
            <Switch checked={state.checkedEditMode} color="primary" onChange={handleEditModeChange()} value="" />
          }
          label="Edit Mode"
        />
        <h1>Q&A Base</h1>
        <QABase componentData={mockQaBaseMaterial.data} editMode={state.checkedEditMode} />
        <h1>Q&A Choices</h1>
        <QAChoices componentData={mockQaChoicesMaterial.data} editMode={state.checkedEditMode} />
        <h1>Vector</h1>
        <Vector componentData={mockVectorMaterial.data} editMode={state.checkedEditMode} />
      </div>
    </ThemeProvider>
  );
};

export default App;
