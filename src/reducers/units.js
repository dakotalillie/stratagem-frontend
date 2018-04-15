import {
  RECEIVE_GAME_DATA,
  CREATE_UNIT,
  DELETE_UNIT
} from '../actions/actionTypes';

const units = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.units;
    case CREATE_UNIT:
      newState = { ...state };
      newState[action.payload.unit_data.territory] = action.payload.unit_data;
      return newState;
    case DELETE_UNIT:
      newState = { ...state };
      if (!action.payload.unit_data.displaced) {
        delete newState[action.payload.unit_data.territory];
      }
      return newState;
    default:
      return state;
  }
};

export default units;
