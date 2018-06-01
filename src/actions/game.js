import {
  CREATE_ORDER,
  CREATE_CONVOY_ROUTE,
  REQUEST_GAME_DATA,
  RECEIVE_GAME_DATA,
  GAME_DATA_ERROR,
  REQUEST_ORDERS_SUBMISSION,
  ORDERS_SUBMISSION_ERROR,
  REQUEST_GAME_CREATION,
  GAME_CREATION_ERROR,
  CREATE_UNIT,
  CLEAR_GAME_DETAIL_DATA
} from './actionTypes';
import { push } from 'react-router-redux';
import { normalize, schema } from 'normalizr';

import { API_ROOT } from '../utils/constants';
import { camelCaseObjectProperties } from '../utils/stringUtils';
import { DELETE_UNIT } from '../components/game/board/selectionTypes';
import { logout } from './auth';

export function createOrder(args) {
  return {
    type: CREATE_ORDER,
    payload: {
      ...args
    }
  };
}

export function createConvoyRoute(args) {
  return {
    type: CREATE_CONVOY_ROUTE,
    payload: {
      ...args
    }
  };
}

function requestGameData() {
  return {
    type: REQUEST_GAME_DATA
  };
}

function receiveGameData(gameData) {
  const formattedData = camelCaseObjectProperties(gameData);
  const normalizedData = normalizeGameData(formattedData);
  return {
    type: RECEIVE_GAME_DATA,
    payload: {
      gameData: normalizedData.entities
    }
  };
}

function gameDataError(errorMessage) {
  return {
    type: GAME_DATA_ERROR,
    payload: {
      errorMessage
    }
  };
}

function requestOrdersSubmission(userId) {
  return {
    type: REQUEST_ORDERS_SUBMISSION,
    payload: {
      userId
    }
  };
}

function ordersSubmissionError(errorMessage, userId) {
  return {
    type: ORDERS_SUBMISSION_ERROR,
    payload: {
      errorMessage,
      userId
    }
  };
}

function requestGameCreation() {
  return {
    type: REQUEST_GAME_CREATION
  };
}

function gameCreationError(errorMessage) {
  return {
    type: GAME_CREATION_ERROR,
    payload: {
      errorMessage
    }
  };
}

export function createUnit(unitData) {
  return {
    type: CREATE_UNIT,
    payload: {
      unitData
    }
  };
}

export function deleteUnit(unitData) {
  return {
    type: DELETE_UNIT,
    payload: {
      unitData
    }
  };
}

export function clearGameDetailData() {
  return {
    type: CLEAR_GAME_DETAIL_DATA
  };
}

// Thunks

export function createSandbox() {
  return dispatch => {
    dispatch(requestGameCreation());
    return fetch(`${API_ROOT}/games/sandbox/`, {
      method: 'POST',
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error creating sandbox game');
        } else {
          return res.json();
        }
      })
      .then(json => {
        dispatch(push(`/games/${json.game_id}`));
      })
      .catch(error => {
        dispatch(gameCreationError(error.message));
      });
  };
}

export function fetchGameData(gameId) {
  return dispatch => {
    dispatch(requestGameData());
    return fetch(`${API_ROOT}/games/${gameId}/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error fetching game data');
        } else {
          return res.json();
        }
      })
      .then(json => {
        dispatch(receiveGameData(json));
      })
      .catch(error => {
        debugger;
        dispatch(logout());
        dispatch(gameDataError(error.message));
      });
  };
}

export function submitOrders({ gameId, userId, orders, convoyRoutes }) {
  return dispatch => {
    dispatch(requestOrdersSubmission(userId));
    return fetch(`${API_ROOT}/games/${gameId}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orders, convoyRoutes })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error submitting orders');
        } else {
          return res.json();
        }
      })
      .then(json => {
        dispatch(receiveGameData(json));
      })
      .catch(error => {
        dispatch(ordersSubmissionError(error.message, userId));
      });
  };
}

// Helpers

function normalizeGameData(gameData) {
  const units = new schema.Entity(
    'units',
    {},
    {
      idAttribute: 'territory'
    }
  );
  const retreatingUnits = new schema.Entity(
    'retreatingUnits',
    {},
    {
      idAttribute: 'retreating_from'
    }
  );
  const territories = new schema.Entity(
    'territories',
    {},
    {
      idAttribute: 'abbreviation'
    }
  );
  const countries = new schema.Entity(
    'countries',
    {
      units: [units],
      retreatingUnits: [retreatingUnits],
      territories: [territories]
    },
    {
      idAttribute: 'name'
    }
  );
  const game = new schema.Entity('game', {
    countries: [countries]
  });

  return normalize(gameData, game);
}
