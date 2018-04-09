import {
  REQUEST_CURRENT_USER,
  RECEIVE_CURRENT_USER,
  LOGIN_ERROR,
  NO_TOKEN
} from '../actions/actionTypes';

const currentUser = (state = { loading: true }, action) => {
  switch (action.type) {
    case NO_TOKEN:
      return { loading: false };
    case REQUEST_CURRENT_USER:
      return { loading: true };
    case RECEIVE_CURRENT_USER:
      let { token, first_name, last_name, email } = action.payload.user_data;
      if (token) {
        localStorage.setItem('token', token);
      }
      return { loading: false, first_name, last_name, email };
    case LOGIN_ERROR:
      return { loading: false, error: action.payload.error };
    default:
      return state;
  }
};

export default currentUser;
