import { RECEIVE_GAME_DATA, CREATE_UNIT } from '../actions/actionTypes';

const countries = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.countries;
    case CREATE_UNIT:
      let newState = { ...state };
      newState[action.payload.unit_data.country].units.push(
        action.payload.unit_data.origin
      );
      return newState;
    default:
      return state;
  }
};

export default countries;
