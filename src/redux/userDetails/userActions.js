export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const CLEAR_USER_DETAILS = 'CLEAR_USER_DETAILS';

export const set_User_Details = userDetails => {
   
  return {
    type: SET_USER_DETAILS,
    payload: userDetails,
  };
};

export const clearUserDetails = () => {
  return {
    type: CLEAR_USER_DETAILS,
  };
};
