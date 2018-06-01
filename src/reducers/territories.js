import {
  RECEIVE_GAME_DATA,
  LOGOUT,
  CLEAR_GAME_DETAIL_DATA
} from '../actions/actionTypes';

const territories = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.gameData.territories;
    case CLEAR_GAME_DETAIL_DATA:
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export default territories;
