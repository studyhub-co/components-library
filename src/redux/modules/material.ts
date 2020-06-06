import { MATERIAL_FETCHING, MATERIAL_FETCHING_SUCCESS } from './constants';
import { Material } from '../../models/';

// import { QAData } from '../../components/qa/IData/index';

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
    console.log('fetch');
    // dispatch(fetchingMaterial());
    // todo API get call with JSON data validation
    // dispatch(fetchingMaterialSuccess(mockMaterial));
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
