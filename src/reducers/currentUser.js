import {
  REQUEST_CURRENT_USER,
  RECEIVE_CURRENT_USER,
  AUTHENTICATION_ERROR,
  NO_TOKEN
} from '../actions/actionTypes';

const currentUser = (state = { loading: true }, action) => {
  switch (action.type) {
    case NO_TOKEN:
      return { loading: false };
    case REQUEST_CURRENT_USER:
      return { loading: true };
    case RECEIVE_CURRENT_USER:
      let { id, first_name, last_name, email } = action.payload.user;
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      return { loading: false, id, first_name, last_name, email };
    case AUTHENTICATION_ERROR:
      return { loading: false, error: action.payload.error };
    default:
      return state;
  }
};

export default currentUser;
