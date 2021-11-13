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

import VectorGame from '../src/games/vector/index';
import UnitConversionGame from '../src/games/unitConversion/index';

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
      {/*<h3>Vector Game</h3>*/}
      {/*<VectorGame*/}
      {/*  materialUuid={'9130054b-42b3-4f16-8864-033872831d97'}*/}
      {/*  moveToNextComponent={nextMaterialUuid => {*/}
      {/*    console.log(`moveToNextComponent called. nextMaterialUuid: ${nextMaterialUuid}`);*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<h3>Unit Conversion Game</h3>*/}
      {/*<UnitConversionGame*/}
      {/*  materialUuid={'9130054b-42b3-4f16-8864-033872831d97'}*/}
      {/*  moveToNextComponent={nextMaterialUuid => {*/}
      {/*    console.log(`moveToNextComponent called. nextMaterialUuid: ${nextMaterialUuid}`);*/}
      {/*  }}*/}
      {/*/>*/}
      <FormControlLabel
        control={<Switch checked={state.checkedEditMode} color="primary" onChange={handleEditModeChange()} value="" />}
        label="Edit Mode"
      />
      <h2>Q&A Base</h2>
      <QABase componentData={mockQaBase} editMode={state.checkedEditMode} />
      <h2>Q&A Choices</h2>
      <QAChoices componentData={mockQaChoices} editMode={state.checkedEditMode} />
      <h2>Vector</h2>
      <Vector componentData={mockVector} editMode={state.checkedEditMode} />
      <h2>Unit Conversion</h2>
      <UnitConversion componentData={mockUnitConversion} editMode={state.checkedEditMode} />
      <h2>MySQL</h2>
      <MySQL componentData={mockMysql} editMode={state.checkedEditMode} />
    </div>
  );
};

export default Components;
