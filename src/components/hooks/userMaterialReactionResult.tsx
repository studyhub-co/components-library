import { useEffect } from 'react';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

export function useUserMaterialReactionResult(
  userMaterialReactionResult: userMaterialReactionCreators.UserReactionResultRedux,
  setUserReactionState: (value: string) => void,
  userReactionStateP: string,
) {
  useEffect(() => {
    let userReactionState = userReactionStateP;

    if (userMaterialReactionResult) {
      setUserReactionState('checked');
      userReactionState = 'checked';
    }

    window.parent.postMessage(
      {
        type: 'user_reaction_state',
        data: {
          state: userReactionState,
          userLessonScore: userMaterialReactionResult?.score,
          wasCorrect: userMaterialReactionResult?.was_correct,
        },
      },
      '*',
    );
  }, [setUserReactionState, userMaterialReactionResult, userReactionStateP]);
}
