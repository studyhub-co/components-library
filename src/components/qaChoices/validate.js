// FIXME you need to copy this file at the root of the sandbox to able to load this code on the server side
const validate = (correctData, userReactionData) => {
  // check that all correct choices was selected
  let correct = true;

  correctData.choices.forEach(function(choicefromCorrectData) {
    const userReactionChoice = userReactionData.choices.find((choice)=>{
      return choice.uuid === choicefromCorrectData.uuid;
    })
    if (choicefromCorrectData.selected !== userReactionChoice.selected) {
      correct = false;
    }
  });
  return correct;
};
