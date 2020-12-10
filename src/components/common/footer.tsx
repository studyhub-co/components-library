import React, { useState, useEffect } from 'react';

import { Material } from '../../models/';

import CheckContinueButton from './checkContinueButton';

import * as materialActionCreators from '../../redux/modules/material';
import { QAData as IQAData } from '../qaChoices/IData/index';
import { VectorData as IVectorData } from '../vector/IData/index';
import { UnitConversionData as IUnitConversionData } from '../unitConversion/IData/index';
import { QABaseData as IQABaseData } from '../qaBase/IData/index';
import { MySQLData as IMySQLData } from '../mysql/IData/index';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface FooterProps {
  currentMaterial: materialActionCreators.MaterialRedux;
  editMode: boolean | undefined;
  disabledCheck: boolean;
  updateMaterial(material: Material): void;
  moveToNextComponent(previousMaterialUuid: string): void;
  checkUserMaterialReaction(material: Material): void;
  componentData: IQAData | IVectorData | IQABaseData | IUnitConversionData | IMySQLData | null; // Any component IData
  userReactionState: string; // todo enum?
}

const Footer: React.FC<FooterProps> = props => {
  const {
    currentMaterial,
    editMode,
    disabledCheck,
    updateMaterial,
    checkUserMaterialReaction,
    componentData,
    userReactionState,
    moveToNextComponent,
  } = props;

  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const handleShowComments = (): void => {
    setShowCommentsModal(!showCommentsModal);
  };

  // console.log(userReactionState);

  return (
    <div style={{ textAlign: 'center' }}>
      <CheckContinueButton
        moveToNextComponent={moveToNextComponent}
        editMode={editMode}
        componentData={componentData}
        checkUserMaterialReaction={checkUserMaterialReaction}
        currentMaterial={currentMaterial}
        disabledCheck={disabledCheck}
        updateMaterial={updateMaterial}
        userReactionState={userReactionState}
      />
    </div>
  );
};

export default Footer;
