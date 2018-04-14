import { CREATE_ORDER, CREATE_UNIT } from '../actions/actionTypes';
import { DELETE_UNIT } from '../components/game/board/selectionTypes';

const orders = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case CREATE_ORDER:
      newState = { ...state };
      newState[action.payload.unit_id] = action.payload;
      return newState;
    case CREATE_UNIT:
      newState = { ...state };
      newState[action.payload.unit_data.territory] = action.payload.unit_data;
      return newState;
    case DELETE_UNIT:
      newState = { ...state };
      newState[action.payload.unit_data.territory] = action.payload.unit_data;
      return newState;
    default:
      return state;
  }
};

export default orders;
