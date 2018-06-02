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
      newState = action.payload.gameData.countries;
      for (let country of Object.values(newState)) {
        country.ready = false;
      }
      return newState;
    case CREATE_ORDER:
      newState = { ...state };
      const retreatingUnits =
        newState[action.payload.country].retreatingUnits;
      if (retreatingUnits) {
        index = retreatingUnits.indexOf(action.payload.origin);
        retreatingUnits.splice(index, 1);
      }
      return newState;
    case CREATE_UNIT:
      newState = { ...state };
      newState[action.payload.unitData.country].units.push(
        action.payload.unitData.territory
      );
      return newState;
    case DELETE_UNIT:
      newState = { ...state };
      let units;
      if (!action.payload.unitData.displaced) {
        units = newState[action.payload.unitData.country].units;
      } else {
        units = newState[action.payload.unitData.country].retreatingUnits;
      }
      index = units.indexOf(action.payload.unitData.origin);
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
    case ORDERS_SUBMISSION_ERROR:
      newState = { ...state }
      for (let country of Object.values(newState)) {
        if (country.user === action.payload.userId) {
          country.ready = false;
        }
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
