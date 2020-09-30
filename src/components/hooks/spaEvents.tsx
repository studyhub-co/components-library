import { useEffect } from 'react';
import { Material } from '../../models/';
import * as materialActionCreators from '../../redux/modules/material';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

// interface SPAHookProps {
//   checkUserMaterialReaction(material: Material): void;
// }

export function useSpaEventsHook(
  updateMaterial: (material: Material) => void,
  checkUserMaterialReaction: (material: Material) => void,
  currentMaterial: materialActionCreators.MaterialRedux,
  componentData: any,
  userMaterialReactionResult: userMaterialReactionCreators.UserReactionResultRedux,
  moveToNextComponent: (nextMaterialUuid: string | undefined) => void,
  lessonUuid: string | undefined,
  setShowFooter: (value: boolean) => void,
  setEditMode: any,
  setUserReactionState: any,
) {
  useEffect(() => {
    // catch parent event inside iframe
    const messageListener = ({ data }: { data: any }): any => {
      if (data.hasOwnProperty('type')) {
        // got edit_mode from parent window
        if (data.type === 'edit_mode') {
          if (data.data === 'edit') {
            setEditMode(true);
            setShowFooter(true);
          } else {
            setEditMode(false);
            setShowFooter(false);
          }
        }
        if (data.type === 'check_user_reaction') {
          if (!currentMaterial.isFetching && currentMaterial.uuid && componentData) {
            const reactionMaterial: Material = { uuid: currentMaterial.uuid, data: componentData };
            checkUserMaterialReaction(reactionMaterial);
            setUserReactionState('checked');
          }
        }
        if (data.type === 'save_data') {
          if (!currentMaterial.isFetching && currentMaterial.uuid && componentData) {
            const reactionMaterial: Material = { uuid: currentMaterial.uuid, data: componentData };
            updateMaterial(reactionMaterial);
          }
        }
        if (data.type === 'continue') {
          if (currentMaterial.uuid) {
            // reset results for the same problem type component
            moveToNextComponent(userMaterialReactionResult.next_material_uuid);
            setUserReactionState('start');

            // send redirect url tp parent
            window.parent.postMessage(
              {
                type: 'redirect_to_material',
                data: { lessonUuid, nextMaterialUuid: userMaterialReactionResult.next_material_uuid },
              },
              '*',
            );
          }
        }
      }
    };

    // TODO check that we have only the one Listener
    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, [
    checkUserMaterialReaction,
    currentMaterial,
    componentData,
    lessonUuid,
    setShowFooter,
    setEditMode,
    setUserReactionState,
    userMaterialReactionResult,
    moveToNextComponent,
  ]);
}

// useEffect(() => {
//   // catch parent event inside iframe
//   const messageListener = ({ data }: { data: any }): any => {
//     if (data.hasOwnProperty('type')) {
//       // got edit_mode from parent window
//       if (data.type === 'edit_mode') {
//         if (data.data === 'edit') {
//           setEditMode(true);
//         } else {
//           setEditMode(false);
//         }
//       }
//       if (data.type === 'check_user_reaction') {
//         if (!currentMaterial.isFetching && currentMaterial.uuid && componentData) {
//           const reactionMaterial: Material = { uuid: currentMaterial.uuid, data: componentData };
//           checkUserMaterialReaction(reactionMaterial);
//         }
//       }
//       if (data.type === 'continue') {
//         if (currentMaterial.uuid) {
//           setUserReactionState('start');
//           moveToNextComponent(userMaterialReactionResult.next_material_uuid);
//           // send redirect url tp parent
//           window.parent.postMessage(
//             {
//               type: 'redirect_to_material',
//               data: { lessonUuid, nextMaterialUuid: userMaterialReactionResult.next_material_uuid },
//             },
//             '*',
//           );
//         }
//       }
//     }
//   };
//
//   // TODO check that we have only the one Listener
//   window.addEventListener('message', messageListener);
//
//   return () => {
//     window.removeEventListener('message', messageListener);
//   };
// }, [
//   checkUserMaterialReaction,
//   currentMaterial,
//   componentData,
//   userMaterialReactionResult,
//   moveToNextComponent,
//   lessonUuid,
// ]);
