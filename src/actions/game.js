import {
  CREATE_ORDER,
  REQUEST_GAME_DATA,
  RECEIVE_GAME_DATA,
  GAME_DATA_ERROR,
  SUBMITTING_ORDERS,
  ORDER_SUBMIT_ERROR
} from './actionTypes';
import { API_ROOT, HEADERS } from '../utils/constants';
import { normalize, schema } from 'normalizr';

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

function orderSubmitError(error_message) {
  return {
    type: ORDER_SUBMIT_ERROR,
    payload: {
      error_message
    }
  };
}

function submittingOrders() {
  return {
    type: SUBMITTING_ORDERS
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
        dispatch(receiveGameData(json));
      })
      .catch(error => {
        dispatch(gameDataError(error.message));
      });
  };
}

export function submitOrders({ game_id, orders }) {
  debugger;
  return dispatch => {
    dispatch(submittingOrders());
    return fetch(`${API_ROOT}/games/${game_id}/orders`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(orders)
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
        dispatch(orderSubmitError(error.message));
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
