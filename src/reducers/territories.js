import { RECEIVE_GAME_DATA } from '../actions/actionTypes';

const territories = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.territories;
    default:
      return state;
  }
};

export default territories;
