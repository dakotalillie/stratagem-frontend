import { RECEIVE_CURRENT_USER, LOGOUT } from '../actions/actionTypes';

function games(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:  
      let userData;
      if (action.payload.user) {
        userData = action.payload.user;
      } else {
        userData = action.payload;
      }
      return userData.games.reduce((memo, game) => {
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
