import { INITIALIZE_GAME, RECEIVE_GAME_DATA } from '../actions/actionTypes';
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
    case RECEIVE_GAME_DATA:
      return action.payload.game_data.territories;
    default:
      return state;
  }
};

export default territories;
