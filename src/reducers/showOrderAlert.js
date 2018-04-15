import {
  SHOW_ORDER_ALERT,
  HIDE_ORDER_ALERT,
  LOGOUT
} from '../actions/actionTypes';

const showOrderAlert = (state = false, action) => {
  switch (action.type) {
    case SHOW_ORDER_ALERT:
      return true;
    case HIDE_ORDER_ALERT:
      return false;
    case LOGOUT:
      return false;
    default:
      return state;
  }
};

export default showOrderAlert;
