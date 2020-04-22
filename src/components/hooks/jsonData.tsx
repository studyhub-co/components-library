import React, { useState, useEffect } from 'react';
import { ChoicesData } from '../qa/IData/choices';

export function useJsonData(jsonData: ChoicesData | null, currentMaterial: any) {
  const [data, setData] = useState(jsonData);

  useEffect(() => {
    if (currentMaterial && currentMaterial.data) {
      setData(currentMaterial.data);
    } else if (jsonData) {
      setData(jsonData);
    }
  }, [jsonData, currentMaterial]);

  // TODO S
  // 1. uses by all components
  // 2. operate jsonData (defined as prop or currentMaterial.data)
  // 3. validate jsonData with selected interface
  // 4. manipulate onChange data

  return data;
}
