import { RECEIVE_CURRENT_USER } from '../actions/actionTypes';

function games(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.payload.user_data.games.reduce((memo, game) => {
        memo[game.id] = game;
        return memo;
      }, {});
    default:
      return state;
  }
}

export default games;
