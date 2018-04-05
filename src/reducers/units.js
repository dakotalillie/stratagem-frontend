import { INITIALIZE_GAME } from '../actions/actionTypes';
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
            coast: unit.coast
          };
        }
      }
      return newState;
    default:
      return state;
  }
};

export default units;
