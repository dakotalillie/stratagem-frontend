import {
  CREATE_ORDER,
  CREATE_UNIT,
  RECEIVE_GAME_DATA,
  LOGOUT,
  CLEAR_GAME_DETAIL_DATA
} from '../actions/actionTypes';
import { DELETE_UNIT } from '../components/game/board/selectionTypes';

const orders = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return {};
    case CREATE_ORDER:
      newState = { ...state };
      newState[action.payload.unitId] = action.payload;
      return newState;
    case CREATE_UNIT:
      newState = { ...state };
      newState[action.payload.unitData.origin] = action.payload.unitData;
      return newState;
    case DELETE_UNIT:
      newState = { ...state };
      newState[action.payload.unitData.origin] = action.payload.unitData;
      return newState;
    case CLEAR_GAME_DETAIL_DATA:
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export default orders;
