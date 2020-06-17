import { MATERIAL_FETCHING, MATERIAL_FETCHING_SUCCESS } from './constants';
import { Material } from '../../models/';

import apiFactory, { Api } from './apiFactory';

// import { QAData } from '../../components/qa/IData/index';

// class MaterialRedux extends Material {
//   public isFetching!: boolean;
// }

// todo make it configurable for lib user
const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/studio/';

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

const api: Api = apiFactory(BACKEND_SERVER_API_URL);

// actions
// export const fetchMaterial = (uuid: string | undefined) => {
export const fetchMaterial = (uuid: string) => {
  return (dispatch: any) => {
    dispatch(fetchingMaterial());
    const url = `materials/${uuid}/`;
    api.get<Material>(url, {}).then((result: Material) => {
      dispatch(fetchingMaterialSuccess(result));
    });
  };
};

export const updateMaterial = (material: Material) => {
  return (dispatch: any) => {
    const url = `materials/${material.uuid}/`;
    api
      .patch<Material>(url, { ...material })
      .then((result: Material) => {
        dispatch(fetchingMaterialSuccess(result));
      });
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
