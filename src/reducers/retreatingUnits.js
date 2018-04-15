import {
  RECEIVE_GAME_DATA,
  DELETE_UNIT,
  LOGOUT,
  CLEAR_GAME_DETAIL_DATA
} from '../actions/actionTypes';

const retreatingUnits = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      if (action.payload.game_data.retreating_units !== undefined) {
        return action.payload.game_data.retreating_units;
      }
      return {};
    case DELETE_UNIT:
      let newState = { ...state };
      if (action.payload.unit_data.displaced) {
        delete newState[action.payload.unit_data.territory];
      }
      return newState;
    case CLEAR_GAME_DETAIL_DATA:
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export default retreatingUnits;
