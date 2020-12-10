import React, { useEffect } from 'react';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import QAChoices from '../src/components/qaChoices';
import QABase from '../src/components/qaBase';
import Vector from '../src/components/vector';
import UnitConversion from '../src/components/unitConversion';
import MySQL from '../src/components/mysql';

import { mockQaChoices } from '../src/components/qaChoices/mockData';
import { mockQaBase } from '../src/components/qaBase/mockData';
import { mockVector } from '../src/components/vector/mockData';
import { mockUnitConversion } from '../src/components/unitConversion/mockData';
import { mockMysql } from '../src/components/mysql/mockData';

const Components: React.FC = () => {
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
      <FormControlLabel
        control={<Switch checked={state.checkedEditMode} color="primary" onChange={handleEditModeChange()} value="" />}
        label="Edit Mode"
      />
      <h1>Q&A Base</h1>
      <QABase componentData={mockQaBase} editMode={state.checkedEditMode} />
      <h1>Q&A Choices</h1>
      <QAChoices componentData={mockQaChoices} editMode={state.checkedEditMode} />
      <h1>Vector</h1>
      <Vector componentData={mockVector} editMode={state.checkedEditMode} />
      <h1>Unit Conversion</h1>
      <UnitConversion componentData={mockUnitConversion} editMode={state.checkedEditMode} />
      <h1>MySQL</h1>
      <MySQL componentData={mockMysql} editMode={state.checkedEditMode} />
    </div>
  );
};

export default Components;
