// action + reducer in the same file
import { PROFILE_ME } from './constants';
import { Profile } from '../../models/';

export const setProfileMe = (id: number) => {
  return {
    type: PROFILE_ME,
    id,
  };
};

const initialState: Profile = {
  id: 0,
};

export default function profile(state = initialState, action: any) {
  switch (action.type) {
    case PROFILE_ME:
      return {
        ...state,
        is: action.id,
      };
    default:
      return state;
  }
}
