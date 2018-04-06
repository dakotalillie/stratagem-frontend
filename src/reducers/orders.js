import { CREATE_ORDER } from '../actions/actionTypes';

const orders = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER:
      let newState = { ...state };
      newState[action.fromTerr] = {
        toTerr: action.toTerr,
        country: action.country,
        orderType: action.orderType,
        auxFromTerr: action.auxFromTerr,
        auxToTerr: action.auxToTerr,
        auxCountry: action.auxCountry,
        auxOrderType: action.auxOrderType
      };
      return newState;
    default:
      return state;
  }
};

export default orders;
