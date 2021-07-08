import { useEffect } from 'react';

import { playAudio } from '../../utils/sounds';
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

    // don't react if is fetching, TODO we need to change userReactionStateP to 'checked' after we got result from API
    if (userMaterialReactionResult?.isFetching) return;

    const wasCorrect = userReactionStateP === 'checked' ? userMaterialReactionResult?.was_correct : null;

    console.log(userReactionStateP);
    console.log(userMaterialReactionResult);

    // play audio
    if (wasCorrect === true) {
      playAudio('correct', 1);
    } else if (wasCorrect === false) {
      playAudio('incorrect', 1);
    }

    window.parent.postMessage(
      {
        type: 'user_reaction_state',
        data: {
          state: userReactionStateP,
          userLessonScore: userMaterialReactionResult?.lesson_progress,
          wasCorrect: wasCorrect,
        },
      },
      '*',
    );
  }, [userReactionStateP, setUserReactionState, userMaterialReactionResult]);
}
