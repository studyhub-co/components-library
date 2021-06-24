import { useEffect } from 'react';
import * as userMaterialReactionCreators from '../../redux/modules/userMaterialReactionResult';

export function useUserMaterialReactionResult(
  userMaterialReactionResult: userMaterialReactionCreators.UserReactionResultRedux,
  setUserReactionState: (value: string) => void,
  userReactionStateP: string,
) {
  useEffect(() => {
    // console.log({
    //   type: 'user_reaction_state',
    //   data: {
    //     state: userReactionStateP,
    //     userLessonScore: userMaterialReactionResult?.score,
    //     wasCorrect: userReactionStateP === 'checked' ? userMaterialReactionResult?.was_correct : null,
    //   },
    // });

    window.parent.postMessage(
      {
        type: 'user_reaction_state',
        data: {
          state: userReactionStateP,
          userLessonScore: userMaterialReactionResult?.lesson_progress,
          wasCorrect: userReactionStateP === 'checked' ? userMaterialReactionResult?.was_correct : null,
        },
      },
      '*',
    );
  }, [userReactionStateP, setUserReactionState, userMaterialReactionResult]);
}
