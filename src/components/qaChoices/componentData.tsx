import React, { useState, useEffect, useReducer } from 'react';

import { isRight } from 'fp-ts/lib/Either';

import { QAData as IQAData, QADataIo } from './IData/index';

import { IReducerObject, reducer } from './reducer';

// import { mockQaChoicesMaterial } from '../mockData';
import { mockQaChoices } from './mockData';

// 1. operates componentData (defined as prop or currentMaterial.data)
// 2. validate componentData with selected interfaces
// 3. manipulate data (pre redux)

// export function useComponentData(reducer: any, componentData: IComponentsData, currentMaterial: any) {
export function useComponentData(componentData: IQAData, currentMaterial: any) {
  const initialState: IReducerObject = { reducerData: null };
  const [data, dispatch] = useReducer(reducer, initialState);
  // let useBackEndApi = false;

  useEffect((): void => {
    let initialData: IQAData | null = null;

    // TODO notify user if isRight!=true
    if (currentMaterial && currentMaterial.data) {
      // // set
      // useBackEndApi = true
      // set component data from loaded currentMaterial
      // validate data from API
      if (isRight(QADataIo.decode(currentMaterial.data))) {
        initialData = currentMaterial.data;
      } else {
        // bad data structure - generate new empty one
        initialData = mockQaChoices;
      }
    } else if (componentData) {
      // set component data from component props
      initialData = componentData;
    }
    if (!data.reducerData && initialData) {
      dispatch({ type: 'REPLACE_DATA', payload: initialData });
    }
  }, [componentData, currentMaterial, data.reducerData]);

  const operateDataFunctions = getOperateDataFunctions(dispatch);

  // return { data: data.reducerData, dispatch };
  return { data: data.reducerData, operateDataFunctions };
}

function getOperateDataFunctions(dispatch: any) {
  const selectChoiceUuid = (uuid: string): void => {
    // setSelectedChoiceUuid(uuid);
    // TODO select uuid, unselect others
    // if (componentData) {
    // TODO add muliselect support
    dispatch({ type: 'CHOICE_SELECT_CHANGE', payload: uuid });
    // }
  };

  const deleteChoice = (uuid: string): void => {
    dispatch({ type: 'DELETE_CHOICE', payload: uuid });
  };

  const onQuestionTextChange = (text: string): void => {
    dispatch({ type: 'QUESTION_TEXT_CHANGE', payload: text });
  };

  const onQuestionHintChange = (image: string): void => {
    dispatch({ type: 'QUESTION_HINT_CHANGE', payload: image });
  };

  const onQuestionImageChange = (image: string): void => {
    dispatch({ type: 'QUESTION_IMAGE_CHANGE', payload: image });
  };

  const onChoiceImageChange = (uuid: string, image: File): void => {
    const newChoice = { uuid, image };
    dispatch({ type: 'CHOICE_IMAGE_CHANGE', payload: newChoice });
  };

  const onChoiceTextChange = (uuid: string, text: string): void => {
    const newChoice = { uuid, text };
    dispatch({ type: 'CHOICE_TEXT_CHANGE', payload: newChoice });
  };

  const onAddChoice = (): void => {
    // Add choice to data
    dispatch({ type: 'ADD_CHOICE', payload: {} });
  };

  return {
    selectChoiceUuid,
    deleteChoice,
    onQuestionTextChange,
    onQuestionHintChange,
    onQuestionImageChange,
    onChoiceImageChange,
    onChoiceTextChange,
    onAddChoice,
  };
}
