// FIXME you need to copy this file at the root of the sandbox to able to load this code on the server side
// code converted from backend, todo refactor this
const validate = (correctData, userReactionData) => {
  const vectorRegex = /((?<first_component>-?\d*)?\s*\\hat\{(?<first_symbol>[xyij])\})?(?<operator>[+-])?((?<second_component>-?\d*)?\s*\\hat\{(?<second_symbol>[xyij])\})?/;

  const convertToVector = vectorLatexText => {
    // """
    // For now we assume that the vector must come in the format:
    //     A\hat{x|i} ± B\hat{y|j}
    // where A and B are the x and y components of the
    // vector, respectively.
    // Note that each space specified in the typing is escaped by the `\`
    // character, so we must account for those as well.
    // """
    function is_x(x) {
      return ['x', 'i'].indexOf(x) > -1;
      // return x in ('x', 'i')
    }

    function is_y(y) {
      return ['y', 'j'].indexOf(y) > -1;
      // return y in ('y', 'j')
    }

    function is_xy(component) {
      return ['x', 'y'].indexOf(component) > -1;
      // return component in ('x', 'y')
    }

    function to_int(val) {
      if (val === '-') {
        return -1;
      } else {
        return parseInt(val);
      }
      // if val == '-':
      //     return -1
      // else:
      //     return int(val)
    }

    // rep = self.representation.replace('\ ', '')
    // match = self.vector_regex.match(rep)
    const match = vectorLatexText.match(vectorRegex);
    if (match) {
      const first = match.groups['first_symbol'];
      const second = match.groups['second_symbol'];
      let multiplier;
      if (is_xy(first) === is_xy(second) || second == null) {
        if (match.groups['operator'] == '-') {
          multiplier = -1;
        } else {
          multiplier = 1;
        }
        let x, y;
        if (is_x(first) && is_y(second)) {
          x = to_int(match.groups['first_component'] || 1);
          y = to_int(match.groups['second_component'] || 1) * multiplier;
        } else if (is_x(second) && is_y(first)) {
          y = to_int(match.groups['first_component'] || 1);
          x = to_int(match.groups['second_component'] || 1) * multiplier;
        } else if (is_x(first)) {
          x = to_int(match.groups['first_component'] || 1);
          y = 0;
        } else if (is_y(first)) {
          y = to_int(match.groups['first_component'] || 1);
          x = 0;
        } else {
          // raise ValueError('Unrecognized vector format')
          throw 'Unrecognized vector format';
        }
        return { x, y };
        // return Vector(x_component=x, y_component=y)
      }
    }
    throw 'Unrecognized vector format';
    // raise ValueError('Unrecognized vector format')
  };

  if (correctData.answer.content.text) {
    // check text (Mathematical Expression) answer
    const correctVector = convertToVector(correctData.answer.content.text);
    const userVector = convertToVector(userReactionData.answer.content.text);
    return JSON.stringify(correctVector) === JSON.stringify(userVector);
  } else {
    // check null
    if (correctData.answerVectorIsNull && correctData.answerVectorIsNull === userReactionData.answerVectorIsNull) {
      return true;
    }

    if (correctData.answerVectors.length !== userReactionData.answerVectors.length) {
      return false;
    }

    // if at least one of vectors are not correct - return 'false'
    let answerIsCorrect = true;

    // check vectors answers
    correctData.answerVectors.forEach((correctVector, index) => {
      // TODO check that index will be in correct order
      const userVector = userReactionData.answerVectors[index];
      if (correctData.answerToCheck === 10) {
        // 'Full vector match',
        // this is not work because order is important
        // answerIsCorrect = JSON.stringify(correctVector) === JSON.stringify(userVector);
        // check that all keys in correct answer is equal to userVector key's values
        answerIsCorrect = Object.keys(correctVector).every(
          key => correctVector[key].toFixed(2) === userVector[key].toFixed(2),
        );
      } else if (correctData.answerToCheck === 20) {
        // 'Magnitude only',
        answerIsCorrect = correctVector.magnitude.toFixed(2) === userVector.magnitude.toFixed(2);
      } else if (correctData.answerToCheck === 30) {
        // Angle only',
        answerIsCorrect = correctVector.angle.toFixed(2) === userVector.angle.toFixed(2);
      }
    });

    return answerIsCorrect;
  }
};

// export default validate;
