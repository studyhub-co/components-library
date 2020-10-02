// FIXME you need to copy this file at the root of the sandbox to able to load this code on the server side
const validate = (correctData, userReactionData) => {
  // check that answers is correct
  return correctData.answer.text === userReactionData.answer.text;
};
