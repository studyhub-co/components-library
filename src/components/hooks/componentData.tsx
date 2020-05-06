import React, { useState, useEffect, useReducer } from 'react';

// import { ComponentsData as IComponentsData, ReducerObject as IReducerObject } from '../hooks/IData';
//
// import { reducer } from '../qa/reducer';
//
// // export function useComponentData(reducer: any, componentData: IComponentsData, currentMaterial: any) {
// export function useComponentData(componentData: IComponentsData, currentMaterial: any) {
//   // const initialState: IReducerObject = { data: null };
//   const [data, dispatch] = useReducer(reducer, { data: null });
//
//   useEffect((): void => {
//     let initialData: IComponentsData = null;
//     if (currentMaterial && currentMaterial.data) {
//       initialData = currentMaterial.data;
//     } else if (componentData) {
//       initialData = componentData;
//     }
//     if (!data.data && initialData) {
//       dispatch({ type: 'REPLACE_DATA', payload: initialData });
//     }
//   }, [componentData, currentMaterial]);
//
//   // useEffect((): void => {
//   //   if (currentMaterial && currentMaterial.data) {
//   //     setData(currentMaterial.data);
//   //   } else if (componentData) {
//   //     setData(componentData);
//   //   }
//   // }, [componentData, currentMaterial]);
//
//   // 1. uses by all components
//   // 2. operate componentData (defined as prop or currentMaterial.data)
//   // 3. validate componentData with selected interfaces
//   // 4. manipulate data (pre redux save material)
//
//   console.log(data);
//
//   return { data: data.data, dispatch };
//   // return [data, setComponentData];
//   // return [data.data, dispatch];
// }
