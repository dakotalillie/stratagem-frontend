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
import { API_ROOT, HEADERS } from '../utils/constants';
import { normalize, schema } from 'normalizr';
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

function receiveGameData(game_data) {
  const normalized_data = normalizeGameData(game_data);
  return {
    type: RECEIVE_GAME_DATA,
    payload: {
      game_data: normalized_data.entities
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

function requestOrdersSubmission() {
  return {
    type: REQUEST_ORDERS_SUBMISSION
  };
}

function ordersSubmissionError(error_message) {
  return {
    type: ORDERS_SUBMISSION_ERROR,
    payload: {
      error_message
    }
  };
}

function requestGameCreation() {
  return {
    type: REQUEST_GAME_CREATION
  };
}

function gameCreationError(error_message) {
  return {
    type: GAME_CREATION_ERROR,
    payload: {
      error_message
    }
  };
}

export function createUnit(unit_data) {
  return {
    type: CREATE_UNIT,
    payload: {
      unit_data
    }
  };
}

export function deleteUnit(unit_data) {
  return {
    type: DELETE_UNIT,
    payload: {
      unit_data
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

export function fetchGameData(game_id) {
  return dispatch => {
    dispatch(requestGameData());
    return fetch(`${API_ROOT}/games/${game_id}/`, {
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
        dispatch(logout());
        dispatch(gameDataError(error.message));
      });
  };
}

export function submitOrders({ game_id, orders, convoy_routes }) {
  return dispatch => {
    dispatch(requestOrdersSubmission());
    return fetch(`${API_ROOT}/games/${game_id}/orders`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ orders, convoy_routes })
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
        dispatch(ordersSubmissionError(error.message));
      });
  };
}

// Helpers

function normalizeGameData(game_data) {
  const units = new schema.Entity(
    'units',
    {},
    {
      idAttribute: 'territory'
    }
  );
  const retreating_units = new schema.Entity(
    'retreating_units',
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
      retreating_units: [retreating_units],
      territories: [territories]
    },
    {
      idAttribute: 'name'
    }
  );
  const game = new schema.Entity('game', {
    countries: [countries]
  });

  return normalize(game_data, game);
}
