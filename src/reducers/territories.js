import { INITIALIZE_GAME } from '../actions/actionTypes';
import countryData from '../utils/countries.json';

const territories = (state = {}, action) => {
  switch (action.type) {
    case INITIALIZE_GAME:
      let newState = {};
      for (let country of Object.keys(countryData)) {
        for (let territory of countryData[country].startingTerritories) {
          newState[territory] = country;
        }
      }
      return newState;
    default:
      return state;
  }
};

export default territories;
