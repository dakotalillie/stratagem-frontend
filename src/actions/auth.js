import { push } from 'react-router-redux';
import {
  NO_TOKEN,
  REQUEST_CURRENT_USER,
  RECEIVE_CURRENT_USER,
  AUTHENTICATION_ERROR,
  LOGOUT
} from './actionTypes';
import { API_ROOT, HEADERS } from '../utils/constants';

export function noToken() {
  return {
    type: NO_TOKEN
  };
}

export function requestCurrentUser() {
  return {
    type: REQUEST_CURRENT_USER
  };
}

function receiveCurrentUser(data) {
  let payload;
  if (data.token) {
    payload = {
      token: data.token,
      user: data.user
    };
  } else {
    payload = {
      user: data
    };
  }
  return {
    type: RECEIVE_CURRENT_USER,
    payload
  };
}

function authenticationError(error_message) {
  return {
    type: AUTHENTICATION_ERROR,
    payload: {
      error_message
    }
  };
}

export function logout() {
  localStorage.removeItem('token');
  return {
    type: LOGOUT
  };
}

// Thunks

// This thunk is used for retrieving a user's token based off their username
// and password.
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
        dispatch(push('/games'));
      })
      .catch(error => {
        dispatch(authenticationError(error.message));
      });
  };
}

// This thunk is used for retrieving a user's data based off their token.
export const fetchCurrentUser = () => {
  return dispatch => {
    dispatch(requestCurrentUser());
    return fetch(`${API_ROOT}/current_user/`, { headers: HEADERS })
      .then(res => res.json())
      .then(json => {
        dispatch(receiveCurrentUser(json));
      });
  };
};

export const signup = params => {
  return dispatch => {
    dispatch(requestCurrentUser());
    return fetch(`${API_ROOT}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Signup error');
        } else {
          return res.json();
        }
      })
      .then(json => {
        dispatch(receiveCurrentUser(json));
        dispatch(push('/games'));
      })
      .catch(error => {
        dispatch(authenticationError(error.message));
      });
  };
};
