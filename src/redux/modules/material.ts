// action + reducer in the same file
import { MATERIAL_FETCHING, MATERIAL_FETCHING_SUCCESS } from './constants';
import { Material } from '../../models/';

// actions
// export const setProfileMe = (id: number) => {
//   return {
//     type: PROFILE_ME,
//     id,
//   };
// };

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
      // todo get API call
    } else {
      dispatch(fetchingMaterialSuccess({ uuid: '' })); // Material mock
    }
  };
};

const initialState: MaterialRedux = {
  uuid: null,
  isFetching: false,
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
