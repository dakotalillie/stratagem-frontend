import { CREATE_ORDER } from '../actions/actionTypes';

const orders = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER:
      let newState = { ...state };
      newState[action.unit_id] = {
        unit_id: action.unit_id,
        origin: action.origin,
        destination: action.destination,
        order_type: action.order_type,
        coast: action.coast,
        aux_origin: action.aux_origin,
        aux_destination: action.aux_destination,
        aux_order_type: action.aux_order_type
      };
      return newState;
    default:
      return state;
  }
};

export default orders;
