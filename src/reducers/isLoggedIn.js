import { RECEIVE_CURRENT_USER, LOGOUT } from '../actions/actionTypes';

const isLoggedIn = (state = false, action) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return true;
    case LOGOUT:
      return false;
    default:
      return state;
  }
};

export default isLoggedIn;
