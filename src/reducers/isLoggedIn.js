import { RECEIVE_CURRENT_USER } from '../actions/actionTypes';

const isLoggedIn = (state = false, action) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return true;
    default:
      return state;
  }
};

export default isLoggedIn;
