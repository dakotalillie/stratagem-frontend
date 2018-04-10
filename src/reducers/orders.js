import { CREATE_ORDER } from '../actions/actionTypes';

const orders = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER:
      let newState = { ...state };
      newState[action.fromTerr] = {
        unit_id: action.unit_id,
        toTerr: action.toTerr,
        orderType: action.orderType,
        coast: action.coast,
        auxFromTerr: action.auxFromTerr,
        auxToTerr: action.auxToTerr,
        auxOrderType: action.auxOrderType
      };
      return newState;
    default:
      return state;
  }
};

export default orders;
