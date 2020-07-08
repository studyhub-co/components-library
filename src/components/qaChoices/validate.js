// FIXME you need to copy this file at the root of the sandbox
const validate = (correctData, userReactionData) => {
  // check that all correct choices was selected
  userReactionData.choices.forEach(function(userReactionChoice) {
    correctData.choices.some(function(correctChoice) {
      if (correctChoice.selected !== userReactionChoice.selected) {
        return false;
      }
    });
  });
  return true;
};
