import React, { useState, useEffect } from 'react';

import { Material } from '../../models/';

import Button from '@material-ui/core/Button';
import { checkSaveButtonStyle, checkSaveButtonStyleDisabled } from './style';
import * as materialActionCreators from '../../redux/modules/material';
import { QAData as IQAData } from '../qaChoices/IData/index';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface CheckContinueProps {
  currentMaterial: materialActionCreators.MaterialRedux;
  editMode: boolean;
  disabledCheck: boolean;
  updateMaterial(material: Material): void;
  checkUserMaterialReaction(material: Material): void;
  componentData: IQAData; // Any component IData
}

const CheckContinueButton: React.FC<CheckContinueProps> = props => {
  const { currentMaterial, editMode, disabledCheck, updateMaterial, checkUserMaterialReaction, componentData } = props;

  const handleSaveDataClick = () => {
    const material: Material = { uuid: currentMaterial.uuid, data: componentData };
    updateMaterial(material);
  };

  const handleCheckClick = () => {
    const material: Material = { uuid: currentMaterial.uuid, data: componentData };
    checkUserMaterialReaction(material);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {currentMaterial && editMode ? (
        <Button style={checkSaveButtonStyle} variant="contained" color="primary" onClick={handleSaveDataClick}>
          Save
        </Button>
      ) : (
        <Button
          disabled={disabledCheck}
          style={disabledCheck ? checkSaveButtonStyleDisabled : checkSaveButtonStyle}
          variant="contained"
          color="primary"
          onClick={handleCheckClick}
        >
          Check
        </Button>
      )}
    </div>
  );
};

export default CheckContinueButton;
