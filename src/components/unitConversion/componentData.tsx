import React, { useEffect, useReducer } from 'react';

import { isRight } from 'fp-ts/lib/Either';

import { UnitConversionData as IQABaseData, UnitConversionDataIo } from './IData/index';

import { IReducerObject, reducer } from './reducer';

import { mockUnitConversion } from './mockData';

export function useComponentData(componentData: IQABaseData | undefined, currentMaterial: any) {
  const initialState: IReducerObject = { reducerData: null };
  const [data, dispatch] = useReducer(reducer, initialState);

  useEffect((): void => {
    let initialData: IQABaseData | null = null;

    // TODO notify user if isRight!=true
    if (currentMaterial && currentMaterial.data) {
      // set component data from loaded currentMaterial
      // validate data structure from API with io-ts model
      console.log(isRight(UnitConversionDataIo.decode(currentMaterial.data)));
      if (isRight(UnitConversionDataIo.decode(currentMaterial.data))) {
        initialData = currentMaterial.data;
      } else {
        // bad data structure - generate a new empty one
        // TODO we need try to copy all possible fields data from old json structure
        initialData = mockUnitConversion;
      }
    } else if (componentData) {
      // set component data from component props
      initialData = componentData;
    }

    // initialData = data from component props | currentMaterial.data
    if (initialData) {
      if (!currentMaterial.isFetching) {
        dispatch({ type: 'REPLACE_DATA', payload: initialData });
      } else {
        // if is fetching from server process - reset current
        dispatch({ type: 'REPLACE_DATA', payload: null });
      }
    }
  }, [componentData, currentMaterial]);

  const operateDataFunctions = getOperateDataFunctions(dispatch);

  return { data: data.reducerData, operateDataFunctions };
}

function getOperateDataFunctions(dispatch: any) {
  const onQuestionTextChange = (text: string): void => {
    dispatch({ type: 'QUESTION_TEXT_CHANGE', payload: text });
  };

  const onQuestionHintChange = (image: string): void => {
    dispatch({ type: 'QUESTION_HINT_CHANGE', payload: image });
  };

  const onQuestionImageChange = (image: string): void => {
    dispatch({ type: 'QUESTION_IMAGE_CHANGE', payload: image });
  };

  const onUnitConversionTypeChange = (type: string): void => {
    dispatch({ type: 'UNIT_CONVERSION_TYPE_CHANGE', payload: type });
  };

  const onQuestionStepChange = (val: string, _unit: string): void => {
    dispatch({ type: 'UNIT_CONVERSION_QUESTION_STEP_CHANGE', payload: { val, _unit } });
  };

  const onAnswerStepChange = (val: string, _unit: string): void => {
    dispatch({ type: 'UNIT_CONVERSION_ANSWER_STEP_CHANGE', payload: { val, _unit } });
  };

  const onConversionStepsChange = (steps: Array<{ numerator: string; denominator: string }>): void => {
    dispatch({ type: 'UNIT_CONVERSION_STEPS_CHANGE', payload: { steps } });
  };

  return {
    onQuestionTextChange,
    onQuestionHintChange,
    onQuestionImageChange,
    onUnitConversionTypeChange,
    onQuestionStepChange,
    onConversionStepsChange,
    onAnswerStepChange,
  };
}
