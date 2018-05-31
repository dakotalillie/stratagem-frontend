import {
  RECEIVE_GAME_DATA,
  CREATE_UNIT,
  DELETE_UNIT,
  CREATE_ORDER,
  LOGOUT,
  CLEAR_GAME_DETAIL_DATA,
  REQUEST_ORDERS_SUBMISSION,
  ORDERS_SUBMISSION_ERROR,
} from '../actions/actionTypes';

const countries = (state = {}, action) => {
  let newState;
  let index;
  switch (action.type) {
    case RECEIVE_GAME_DATA:
      newState = action.payload.game_data.countries;
      for (let country of Object.values(newState)) {
        country.ready = false;
      }
      return newState;
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
      let units;
      if (!action.payload.unit_data.displaced) {
        units = newState[action.payload.unit_data.country].units;
      } else {
        units = newState[action.payload.unit_data.country].retreating_units;
      }
      index = units.indexOf(action.payload.unit_data.territory);
      if (index > -1) {
        units.splice(index, 1);
      }
      return newState;
    case REQUEST_ORDERS_SUBMISSION:
      newState = { ...state }
      for (let country of Object.values(newState)) {
        country.ready = country.user === action.payload.userId
      }
      return newState;
    case CLEAR_GAME_DETAIL_DATA:
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export default countries;
