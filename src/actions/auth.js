import {
  REQUEST_CURRENT_USER,
  RECEIVE_CURRENT_USER,
  LOGIN_ERROR
} from './actionTypes';
import { API_ROOT, HEADERS } from '../utils/constants';

function requestCurrentUser() {
  return {
    type: REQUEST_CURRENT_USER
  };
}

function receiveCurrentUser(user_data) {
  return {
    type: RECEIVE_CURRENT_USER,
    payload: {
      user_data
    }
  };
}

function loginError(error_message) {
  return {
    type: LOGIN_ERROR,
    payload: {
      error_message
    }
  };
}

// Thunks

export function login(username, password) {
  return dispatch => {
    dispatch(requestCurrentUser());
    return fetch(`${API_ROOT}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Invalid login credentials');
        } else {
          return res.json();
        }
      })
      .then(json => {
        dispatch(receiveCurrentUser(json));
        window.location.href = '/';
      })
      .catch(error => {
        dispatch(loginError(error.message));
      });
  };
}
