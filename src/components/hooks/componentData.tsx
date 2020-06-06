import React, { useEffect, useReducer } from 'react';
//
// import { QABaseData as IQABaseData } from '../qaBase/IData/index';
// import { QAData as IQChoicesAData } from '../qaChoices/IData/index';
// import { VectorData as IVectorData } from '../vector/IData/index';
//
// export type IReducerObject = { reducerData: IQABaseData | IQChoicesAData | IVectorData | null };
//
// // 1. operates componentData (defined as prop or currentMaterial.data)
// // 2. validate componentData with selected interfaces
// // 3. manipulate data (pre redux)
//
// type Reducer<S, A> = (prevState: S, action: A) => S;
//
// // export function useComponentData(reducer: any, componentData: IComponentsData, currentMaterial: any) {
// export function useComponentData(
//   reducer: Reducer<IReducerObject, any>, // to change with out reducers types
//   componentData: IQABaseData | IQChoicesAData | IVectorData,
//   currentMaterial: any,
// ) {
//   // const initialState: IReducerObject = { reducerData: null };
//   const initialState: any = { reducerData: null };
//   const [data, dispatch] = useReducer(reducer, initialState);
//
//   useEffect((): void => {
//     let initialData: IQABaseData | IQChoicesAData | IVectorData | null = null;
//     if (currentMaterial && currentMaterial.data) {
//       // set component data from loaded currentMaterial
//       initialData = currentMaterial.data;
//     } else if (componentData) {
//       // set component data from component props
//       initialData = componentData;
//     }
//     if (!data.reducerData && initialData) {
//       dispatch({ type: 'REPLACE_DATA', payload: initialData });
//     }
//   }, [componentData, currentMaterial, data.reducerData]);
//
//   return { data: data.reducerData, dispatch };
// }
