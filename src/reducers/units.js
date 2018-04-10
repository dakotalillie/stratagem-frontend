import { INITIALIZE_GAME, RECEIVE_GAME_DATA } from '../actions/actionTypes';
import countryData from '../utils/countries.json';

const units = (state = {}, action) => {
  switch (action.type) {
    case INITIALIZE_GAME:
      let newState = {};
      for (let country of Object.keys(countryData)) {
        for (let unit of countryData[country].startingUnits) {
          newState[unit.territory] = {
            country: country,
            type: unit.type,
            territory: unit.territory,
            coast: unit.coast
          };
        }
      }
      return newState;
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.units;
    default:
      return state;
  }
};

export default units;
