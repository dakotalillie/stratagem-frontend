import { RECEIVE_GAME_DATA, LOGOUT } from '../actions/actionTypes';

const currentTurn = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      const GAME_ID = Object.keys(action.payload.game_data.game)[0];
      return action.payload.game_data.game[GAME_ID].current_turn;
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export default currentTurn;
