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
export function useComponentData(componentData: IQAData | undefined, currentMaterial: any) {
  const initialState: IReducerObject = { reducerData: null };
  const [data, dispatch] = useReducer(reducer, initialState);

  useEffect((): void => {
    let initialData: IQAData | null = null;

    // TODO notify user if isRight!=true
    if (currentMaterial && currentMaterial.data) {
      // set component data from loaded currentMaterial
      // validate data structure from API with io-ts model
      if (isRight(QADataIo.decode(currentMaterial.data))) {
        initialData = currentMaterial.data;
      } else {
        // bad data structure - generate a new empty one
        // TODO we need try to copy all possible fields data from old json structure
        initialData = mockQaChoices;
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
  const selectChoiceUuid = (uuid: string, value: boolean): void => {
    dispatch({ type: 'CHOICE_SELECT_CHANGE', payload: { uuid, value } });
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

  const onChoiceReactionResultChange = (uuid: string, reactionResult: string): void => {
    const newChoice = { uuid, reactionResult };
    dispatch({ type: 'CHOICE_REACTION_RESULT_CHANGE', payload: newChoice });
  };

  const onAddChoice = (): void => {
    // Add choice to data
    dispatch({ type: 'ADD_CHOICE', payload: {} });
  };

  const onMultiSelectModeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: 'MULTI_SELECT_MODE_CHANGE', payload: event.target.checked });
  };

  // const resetComponentData = (): void => {
  //   // remove data (before load new one from server). FixMe or it's good?
  //   dispatch({ type: 'REPLACE_DATA', payload: null });
  // };

  return {
    selectChoiceUuid,
    deleteChoice,
    onQuestionTextChange,
    onQuestionHintChange,
    onQuestionImageChange,
    onChoiceImageChange,
    onChoiceTextChange,
    onAddChoice,
    onChoiceReactionResultChange,
    onMultiSelectModeChange,
    // resetComponentData,
  };
}
