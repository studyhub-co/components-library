import React, { useState, useEffect } from 'react';

import { ComponentsData as IComponentsData } from '../hooks/IData';

export function useComponentData(componentData: IComponentsData, currentMaterial: any) {
  const [data, setData] = useState(componentData);

  useEffect(() => {
    if (currentMaterial && currentMaterial.data) {
      setData(currentMaterial.data);
    } else if (componentData) {
      setData(componentData);
    }
  }, [componentData, currentMaterial]);

  // TODO S
  // 1. uses by all components
  // 2. operate componentData (defined as prop or currentMaterial.data)
  // 3. validate componentData with selected interface
  // 4. manipulate onChange data

  const setComponentData = (newComponentData: IComponentsData) => {
    setData(newComponentData);
  };

  return { data, setComponentData };
  // return [data, setComponentData];
}
