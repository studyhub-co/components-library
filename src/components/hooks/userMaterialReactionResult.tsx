import { useEffect } from 'react';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

export function useUserMaterialReactionResult(
  userMaterialReactionResult: userMaterialReactionCreators.UserReactionResultRedux,
  setUserReactionState: (value: string) => void,
  userReactionStateP: string,
) {
  useEffect(() => {
    // let userReactionState = userReactionStateP;
    // console.log(userMaterialReactionResult);
    // if (userMaterialReactionResult) {
    //   userReactionState = 'checked';
    // } else {
    //   userReactionState = 'start';
    // }
    //
    // if (userReactionState !== userReactionStateP) {
    //   setUserReactionState(userReactionState);
    // }
    //
    // console.log(userReactionState);

    window.parent.postMessage(
      {
        type: 'user_reaction_state',
        data: {
          state: userReactionStateP,
          userLessonScore: userMaterialReactionResult?.score,
          wasCorrect: userReactionStateP == 'checked' ? userMaterialReactionResult?.was_correct : null,
        },
      },
      '*',
    );
  }, [userReactionStateP, setUserReactionState, userMaterialReactionResult]);
}
