// FIXME you need to copy this file at the root of the sandbox to able to load this code on the server side
const validate = (correctData, userReactionData) => {
  // check that answers is correct
  // TODO we need to process math formulas to get one result of both sides
  return correctData.answer.content.evaluatedMathText === userReactionData.answer.content.evaluatedMathText;
};
