import { RECEIVE_GAME_DATA } from '../actions/actionTypes';

const countries = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.countries;
    default:
      return state;
  }
};

export default countries;
