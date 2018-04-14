import { RECEIVE_GAME_DATA, CREATE_UNIT } from '../actions/actionTypes';

const units = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.units;
    case CREATE_UNIT:
      let newState = { ...state };
      newState[action.payload.unit_data.origin] = action.payload.unit_data;
      return newState;
    default:
      return state;
  }
};

export default units;
