import { MATERIAL_USER_REACTION_REQUESTING, MATERIAL_USER_REACTION_SUCCESS } from './constants';
import { UserReactionResult } from '../../models/index';

import { Material } from '../../models/';

import apiFactory, { Api } from './apiFactory';

// todo make it configurable for lib user
// const BACKEND_SERVER_API_URL = 'http://127.0.0.1:8000/api/v1/';
const BACKEND_SERVER_API_URL = process.env['NODE_ENV'] === 'development' ? 'http://127.0.0.1:8000/api/v1/' : '/api/v1/';

export interface UserReactionResultRedux extends UserReactionResult {
  isFetching: boolean;
}

// actions events
const userMaterialReactionRequesting = () => {
  return {
    type: MATERIAL_USER_REACTION_REQUESTING,
  };
};

const userMaterialReactionSuccess = (userReaction: UserReactionResult | {} | null) => {
  return {
    type: MATERIAL_USER_REACTION_SUCCESS,
    userReaction,
  };
};

const api: Api = apiFactory(BACKEND_SERVER_API_URL);

// , callback: Function
// actions
export const checkUserMaterialReaction = (material: Material) => {
  return (dispatch: any) => {
    dispatch(userMaterialReactionRequesting());
    const url = `courses/materials/${material.uuid}/reaction/`;
    api
      .post<Material>(url, { ...material })
      .then((result: any) => {
        dispatch(userMaterialReactionSuccess(result));
        // callback();
      })
      .catch((error: any) => {
        if (error.response?.status === 404) {
          alert('There is an error with the validation of your response. Please contact the server administration.');
        }
      });
  };
};

export const resetUserMaterialReaction = () => {
  return (dispatch: any) => {
    dispatch(userMaterialReactionSuccess(null));
  };
};

const initialState: UserReactionResultRedux | {} | null = null;

// reducer
export default function userMaterialReactionResult(
  state = initialState,
  action: any,
): UserReactionResultRedux | {} | null {
  switch (action.type) {
    case MATERIAL_USER_REACTION_REQUESTING:
      return {
        ...state,
        isFetching: true,
      };
    case MATERIAL_USER_REACTION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.userReaction,
      };
    default:
      return state;
  }
}
