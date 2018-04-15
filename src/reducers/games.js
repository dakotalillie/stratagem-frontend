import { RECEIVE_CURRENT_USER, LOGOUT } from '../actions/actionTypes';

function games(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      let user_data;
      if (action.payload.user) {
        user_data = action.payload.user;
      } else {
        user_data = action.payload;
      }
      return user_data.games.reduce((memo, game) => {
        memo[game.id] = game;
        return memo;
      }, {});
    case LOGOUT:
      return {};
    default:
      return state;
  }
}

export default games;
