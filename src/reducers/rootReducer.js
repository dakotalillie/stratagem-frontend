import { combineReducers } from 'redux';
import isLoggedIn from './isLoggedIn';
import territories from './territories';
import units from './units';
import orders from './orders';
import showOrderAlert from './showOrderAlert';

const rootReducer = combineReducers({
  isLoggedIn,
  territories,
  units,
  orders,
  showOrderAlert
});

export default rootReducer;
