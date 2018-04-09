import {
  NO_TOKEN,
  REQUEST_TOKEN,
  RECEIVE_TOKEN,
  REQUEST_CURRENT_USER,
  RECEIVE_CURRENT_USER,
  LOGIN_ERROR
} from './actionTypes';
import { API_ROOT, HEADERS } from '../utils/constants';

export function noToken() {
  return {
    type: NO_TOKEN
  };
}

export function requestToken() {
  return {
    type: REQUEST_TOKEN
  };
}

function receiveToken(token) {
  return {
    type: RECEIVE_TOKEN,
    payload: {
      token
    }
  };
}

export function requestCurrentUser() {
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
    dispatch(requestToken());
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
        dispatch(receiveToken(json.token));
        window.location.href = '/';
      })
      .catch(error => {
        dispatch(loginError(error.message));
      });
  };
}

export const fetchCurrentUser = () => {
  return dispatch => {
    dispatch(requestCurrentUser());
    return fetch(`${API_ROOT}/current_user/`, { headers: HEADERS })
      .then(res => res.json())
      .then(json => dispatch(receiveCurrentUser(json)));
  };
};
