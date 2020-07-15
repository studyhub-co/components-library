import React, { useState, useEffect, useReducer } from 'react';

import { isRight } from 'fp-ts/lib/Either';

import { VectorData as IVectorData, VectorDataIo } from './IData/index';

import { IReducerObject, reducer } from './reducer';

import { mockVector } from './mockData';

// 1. operates componentData (defined as prop or currentMaterial.data)
// 2. validate componentData with selected interfaces
// 3. manipulate data (pre redux)

// export function useComponentData(reducer: any, componentData: IComponentsData, currentMaterial: any) {
export function useComponentData(componentData: IVectorData, currentMaterial: any) {
  const initialState: IReducerObject = { reducerData: null };
  const [data, dispatch] = useReducer(reducer, initialState);

  useEffect((): void => {
    let initialData: IVectorData | null = null;

    // TODO notify user if isRight!=true
    if (currentMaterial && currentMaterial.data) {
      // set component data from loaded currentMaterial
      // validate data structure from API with io-ts model
      if (isRight(VectorDataIo.decode(currentMaterial.data))) {
        initialData = currentMaterial.data;
      } else {
        // bad data structure - generate a new empty one
        // TODO we need try to copy all possible fields data from old json structure
        initialData = mockVector;
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
  // }, [componentData, currentMaterial, data.reducerData]);

  const operateDataFunctions = getOperateDataFunctions(dispatch);

  // return { data: data.reducerData, dispatch };
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

  const onQuestionTextOnly = (checked: boolean): void => {
    dispatch({ type: 'QUESTION_TEXT_ONLY', payload: checked });
  };

  const onAnswerTextChange = (text: string): void => {
    dispatch({ type: 'ANSWER_TEXT_CHANGE', payload: text });
  };

  const onAnswerImageChange = (image: string): void => {
    dispatch({ type: 'ANSWER_IMAGE_CHANGE', payload: image });
  };

  // const resetComponentData = (): void => {
  //   // remove data (before load new one from server). FixMe or it's good?
  //   dispatch({ type: 'REPLACE_DATA', payload: null });
  // };

  return {
    onQuestionTextChange,
    onQuestionHintChange,
    onQuestionImageChange,
    onQuestionTextOnly,
    onAnswerTextChange,
    onAnswerImageChange,
  };
}
