import {SET_USER_DETAILS, CLEAR_USER_DETAILS} from './userActions';

const initialState = {
  userDetails: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    case CLEAR_USER_DETAILS:
      return {
        ...state,
        userDetails: null,
      };
    default:
      return state;
  }
};

export default userReducer;
