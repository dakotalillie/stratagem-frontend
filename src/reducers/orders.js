import { CREATE_ORDER } from '../actions/actionTypes';

const orders = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER:
      let newState = { ...state };
      newState[action.payload.unit_id] = action.payload;
      return newState;
    default:
      return state;
  }
};

export default orders;
