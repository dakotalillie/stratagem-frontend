import { RECEIVE_GAME_DATA, DELETE_UNIT } from '../actions/actionTypes';

const retreatingUnits = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      if (action.payload.game_data.retreating_units !== undefined) {
        return action.payload.game_data.retreating_units;
      }
      return state;
    case DELETE_UNIT:
      // newState = { ...state };
      // delete newState[action.payload.unit_data.territory];
      // return newState;
      break;
    default:
      return state;
  }
};

export default retreatingUnits;
