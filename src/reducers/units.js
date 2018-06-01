import {
  RECEIVE_GAME_DATA,
  CREATE_UNIT,
  DELETE_UNIT,
  LOGOUT,
  CLEAR_GAME_DETAIL_DATA
} from '../actions/actionTypes';

const units = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.gameData.units;
    case CREATE_UNIT:
      newState = { ...state };
      newState[action.payload.unitData.territory] = action.payload.unitData;
      return newState;
    case DELETE_UNIT:
      newState = { ...state };
      if (!action.payload.unitData.displaced) {
        delete newState[action.payload.unitData.territory];
      }
      return newState;
    case CLEAR_GAME_DETAIL_DATA:
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export default units;
