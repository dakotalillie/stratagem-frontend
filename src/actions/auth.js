import {
  NO_TOKEN,
  REQUEST_TOKEN,
  RECEIVE_TOKEN,
  REQUEST_CURRENT_USER,
  RECEIVE_CURRENT_USER,
  AUTHENTICATION_ERROR
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

function authenticationError(error_message) {
  return {
    type: AUTHENTICATION_ERROR,
    payload: {
      error_message
    }
  };
}

// Thunks

// This thunk is used for retrieving a user's token based off their username
// and password.
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
      .then(json => dispatch(receiveCurrentUser(json)));
  };
};

export const signup = params => {
  return dispatch => {
    dispatch(requestToken());
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
        dispatch(receiveToken(json.token));
        window.location.href = '/';
      })
      .catch(error => {
        dispatch(authenticationError(error.message));
      });
  };
};
