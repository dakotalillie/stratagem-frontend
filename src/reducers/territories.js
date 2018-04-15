import { RECEIVE_GAME_DATA, LOGOUT } from '../actions/actionTypes';

const territories = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.territories;
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export default territories;
