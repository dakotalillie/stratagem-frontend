import { RECEIVE_GAME_DATA } from '../actions/actionTypes';

const units = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.units;
    default:
      return state;
  }
};

export default units;
