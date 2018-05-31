import {
  REQUEST_ORDERS_SUBMISSION, RECEIVE_GAME_DATA, ORDERS_SUBMISSION_ERROR
} from '../actions/actionTypes';

const defaultState = { loading: false, error: false }

export default function gameDataStatus(state = defaultState, action) {
  switch (action.type) {
    case REQUEST_ORDERS_SUBMISSION:
      return { loading: true, error: false }
    case RECEIVE_GAME_DATA:
      return defaultState;
    case ORDERS_SUBMISSION_ERROR:
      return { loading: false, error: true }  
    default:
      return state;  
  }
}