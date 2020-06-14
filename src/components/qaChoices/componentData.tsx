import React, { useState, useEffect, useReducer } from 'react';

import { isRight } from 'fp-ts/lib/Either';

import { QAData as IQAData, QADataIo } from './IData/index';

import { IReducerObject, reducer } from './reducer';

// 1. operates componentData (defined as prop or currentMaterial.data)
// 2. validate componentData with selected interfaces
// 3. manipulate data (pre redux)

// export function useComponentData(reducer: any, componentData: IComponentsData, currentMaterial: any) {
export function useComponentData(componentData: IQAData, currentMaterial: any) {
  const initialState: IReducerObject = { reducerData: null };
  const [data, dispatch] = useReducer(reducer, initialState);

  useEffect((): void => {
    let initialData: IQAData | null = null;

    // validate data from API
    // TODO notify user if isRight!=true
    if (currentMaterial && currentMaterial.data && isRight(QADataIo.decode(currentMaterial.data))) {
      // set component data from loaded currentMaterial
      initialData = currentMaterial.data;
    } else if (componentData) {
      // set component data from component props
      initialData = componentData;
    }
    if (!data.reducerData && initialData) {
      dispatch({ type: 'REPLACE_DATA', payload: initialData });
    }
  }, [componentData, currentMaterial, data.reducerData]);

  return { data: data.reducerData, dispatch };
}
