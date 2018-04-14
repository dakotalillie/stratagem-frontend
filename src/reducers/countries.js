import {
  RECEIVE_GAME_DATA,
  CREATE_UNIT,
  DELETE_UNIT
} from '../actions/actionTypes';

const countries = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.countries;
    case CREATE_UNIT:
      newState = { ...state };
      newState[action.payload.unit_data.country].units.push(
        action.payload.unit_data.territory
      );
      return newState;
    case DELETE_UNIT:
      newState = { ...state };
      const units = newState[action.payload.unit_data.country].units;
      const index = units.indexOf(action.payload.unit_data.territory);
      if (index > -1) {
        units.splice(index, 1);
      }
      return newState;
    default:
      return state;
  }
};

export default countries;
