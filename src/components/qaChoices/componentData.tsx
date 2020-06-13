import React, { useState, useEffect, useReducer } from 'react';

// import { ComponentsData as IComponentsData, ReducerObject as IReducerObject } from '../hooks/IData';
// import { ComponentsData as IComponentsData } from '../hooks/IData';

import { QAData as IQAData, isQAData } from './IData/index';

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
    // NOTE: types are used only during development and compile time.
    // The type information is not translated in any way to the compiled JavaScript code.
    // So we can't validate data, and we must use ts-interface-checker for this.

    if (currentMaterial && currentMaterial.data) {
      // set component data from loaded currentMaterial
      console.log(isQAData(currentMaterial.data));
      initialData = currentMaterial.data;
    } else if (componentData) {
      // set component data from component props
      initialData = componentData;
    }
    if (!data.reducerData && initialData) {
      dispatch({ type: 'REPLACE_DATA', payload: initialData });
    }
  }, [componentData, currentMaterial]);

  // useEffect((): void => {
  //   if (currentMaterial && currentMaterial.data) {
  //     setData(currentMaterial.data);
  //   } else if (componentData) {
  //     setData(componentData);
  //   }
  // }, [componentData, currentMaterial]);

  // console.log(data);

  return { data: data.reducerData, dispatch };
  // return { data: {}, dispatch: {} };
  // return [data, setComponentData];
  // return [data.data, dispatch];
}
