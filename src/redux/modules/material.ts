import { MATERIAL_FETCHING, MATERIAL_FETCHING_SUCCESS } from './constants';
import { Material } from '../../models/';

import { ChoicesData } from '../../components/data/choices';

// class MaterialRedux extends Material {
//   public isFetching!: boolean;
// }

export interface MaterialRedux extends Material {
  isFetching: boolean;
}

// actions events
const fetchingMaterial = () => {
  return {
    type: MATERIAL_FETCHING,
  };
};

const fetchingMaterialSuccess = (material: Material) => {
  return {
    type: MATERIAL_FETCHING_SUCCESS,
    material,
  };
};

// actions
export const fetchMaterial = (uuid: string | undefined) => {
  return (dispatch: any) => {
    dispatch(fetchingMaterial());
    if (uuid) {
      // todo API get call with JSON data validation
    } else {
      // Material mock data
      const mockMaterial: Material = {
        uuid: '',
        data: {
          question: 'this is the question!',
          choices: [
            {
              content: {
                image: '',
                text: 'this is the 1st choice',
              },
              type: 'base',
              uuid: 'uuid1',
            },
            {
              content: {
                image: '',
                text: 'this is the 2nd choice',
              },
              type: 'base',
              uuid: 'uuid2',
            },
          ],
        } as ChoicesData,
      };
      dispatch(fetchingMaterialSuccess(mockMaterial));
    }
  };
};

const initialState: MaterialRedux = {
  uuid: null,
  isFetching: false,
  data: null,
};

// reducer
export default function material(state = initialState, action: any): MaterialRedux {
  switch (action.type) {
    case MATERIAL_FETCHING:
      return {
        ...state,
        isFetching: true,
      };
    case MATERIAL_FETCHING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.material,
      };
    default:
      return state;
  }
}
