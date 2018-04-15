import {
  RECEIVE_GAME_DATA,
  CREATE_UNIT,
  DELETE_UNIT,
  CREATE_ORDER
} from '../actions/actionTypes';

const countries = (state = {}, action) => {
  let newState;
  let index;
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.countries;
    case CREATE_ORDER:
      newState = { ...state };
      const retreating_units =
        newState[action.payload.country].retreating_units;
      if (retreating_units) {
        index = retreating_units.indexOf(action.payload.origin);
        retreating_units.splice(index, 1);
      }
      return newState;
    case CREATE_UNIT:
      newState = { ...state };
      newState[action.payload.unit_data.country].units.push(
        action.payload.unit_data.territory
      );
      return newState;
    case DELETE_UNIT:
      newState = { ...state };
      const units = newState[action.payload.unit_data.country].units;
      index = units.indexOf(action.payload.unit_data.territory);
      if (index > -1) {
        units.splice(index, 1);
      }
      return newState;
    default:
      return state;
  }
};

export default countries;
