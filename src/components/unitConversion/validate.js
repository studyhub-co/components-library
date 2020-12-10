// FIXME you need to copy this file at the root of the sandbox to able to load this code on the server side
// TODO exclude 'export' line  at the bottom of this file from a copy of code.
const validate = (correctData, userReactionData) => {
  // check that answers is correct
  const sigFigs = (n, sig) => {
    const multiplying = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
    return Math.round(n * multiplying) / multiplying;
  };

  const getBaseFor2Qty = (firstQty, secondQty) => {
    // Determine the minimum of minLength
    let minLength = firstQty.baseScalar.toString().length;
    if (secondQty.toString().length < minLength) {
      minLength = secondQty.baseScalar.toString().length;
    }

    const asf = sigFigs(firstQty.baseScalar, minLength);
    const isf = sigFigs(secondQty.baseScalar, minLength);

    function decimalPlaces(num) {
      const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      }
      return Math.max(
        0,
        // Number of digits right of decimal point + scientific notation.
        (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0),
      );
    }

    let decPlaces = decimalPlaces(asf);
    if (decimalPlaces(isf) < decPlaces) {
      decPlaces = decimalPlaces(isf);
    }

    function roundX(x, n) {
      const multiplying = Math.pow(10, n);
      return Math.round(x * multiplying) / multiplying;
    }

    return [roundX(asf, decPlaces), roundX(isf, decPlaces)];
  };

  const compareWithSigFigsSI = (firstSI, secondSI) => {
    let equal = '' + firstSI === '' + secondSI;

    if (!equal) {
      const a = firstSI;
      const b = secondSI;
      const percent = (Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b))) * 100;
      if (percent <= 11) {
        equal = true;
      }
    }

    return equal;
  };

  //   ('10', 'LEFT SIDE BLANK'),
  //   ('20', 'RIGHT SIDE BLANK'),
  //   ('30', 'ALL SIDES BLANK'),
  //   JS version of unit conversion answer validation:
  //   1. Evaluate all Latex math values to plain value with evaluatex (see redux reducer)
  //   2. Convert all values+units to SI value+units with js-quantities and save these values in evaluatedSI field (see redux reducer)
  //   (we need to think maybe we need to use python pint + sympy as it works in curricula.
  //   And create backend API for conversion, see 31 option for details)
  //   3. validate.js (uses at the backend)

  // this is curricula/static/curricula/js/games/unit_conversion.jsx: submitQuestion function analog
  if (correctData.conversionType == 20) {
    // RIGHT SIDE BLANK
    // check only an answer
    return compareWithSigFigsSI(correctData.answerStepSI, userReactionData.answerStepSI);
  } else {
    // LEFT SIDE BLANK
    // checking for correct units conversions
    // FIXME is this correct?:
    // We do not care about user steps. Only correct steps SI values (numeratorSI = denominatorSI)  is important.
    for (let column = 0; column < userReactionData.conversionSteps.length; column++) {
      // walk through columns
      if (
        !compareWithSigFigsSI(
          userReactionData.conversionSteps[column].numeratorSI,
          userReactionData.conversionSteps[column].denominatorSI,
        )
      ) {
        return false; // answer is incorrect - one of conversion steps is wrong
      }
    }
    if (correctData.conversionType == 30) {
      // ALL SIDES BLANK
      // additionally check answer step.
      if (!compareWithSigFigsSI(correctData.answerStepSI, userReactionData.answerStepSI)) {
        return false;
      }
    }
    return true; // by default
  }
};

export { validate };
