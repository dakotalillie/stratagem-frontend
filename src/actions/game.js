import {
  INITIALIZE_GAME,
  CREATE_ORDER,
  REQUEST_GAME_DATA,
  RECEIVE_GAME_DATA,
  GAME_DATA_ERROR
} from './actionTypes';
import { API_ROOT, HEADERS } from '../utils/constants';

export const initializeGame = () => {
  return {
    type: INITIALIZE_GAME
  };
};

export const createOrder = args => {
  return {
    ...args,
    type: CREATE_ORDER
  };
};

function requestGameData() {
  return {
    type: REQUEST_GAME_DATA
  };
}

function receiveGameData(game_data) {
  return {
    type: RECEIVE_GAME_DATA,
    payload: {
      game_data
    }
  };
}

function gameDataError(error_message) {
  return {
    type: GAME_DATA_ERROR,
    payload: {
      error_message
    }
  };
}

// Thunks

export function fetchGameData(game_id) {
  return dispatch => {
    dispatch(requestGameData());
    return fetch(`${API_ROOT}/games/${game_id}`, {
      headers: HEADERS
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error fetching game data');
        } else {
          return res.json();
        }
      })
      .then(json => {
        debugger;
        dispatch(receiveGameData(json));
      })
      .catch(error => {
        dispatch(gameDataError(error.message));
      });
  };
}
