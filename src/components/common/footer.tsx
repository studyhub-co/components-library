import React, { useState, useEffect } from 'react';

import { Material } from '../../models/';

// import Button from '@material-ui/core/Button';
// import { checkSaveButtonStyle, checkSaveButtonStyleDisabled } from './style';
import * as materialActionCreators from '../../redux/modules/material';
import { QAData as IQAData } from '../qaChoices/IData/index';
import { VectorData as IVectorData } from '../vector/IData/index';
import CheckContinueButton from './checkContinueButton';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface FooterProps {
  currentMaterial: materialActionCreators.MaterialRedux;
  editMode: boolean;
  disabledCheck: boolean;
  updateMaterial(material: Material): void;
  moveToNextComponent(previousMaterialUuid: string): void;
  checkUserMaterialReaction(material: Material): void;
  componentData: IQAData | IVectorData | null; // Any component IData
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
      <div>Footer from eval</div>
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
