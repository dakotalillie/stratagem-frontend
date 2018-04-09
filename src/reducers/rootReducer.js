import { combineReducers } from 'redux';
import isLoggedIn from './isLoggedIn';
import currentUser from './currentUser';
import games from './games';
import territories from './territories';
import units from './units';
import orders from './orders';
import showOrderAlert from './showOrderAlert';

const rootReducer = combineReducers({
  isLoggedIn,
  currentUser,
  games,
  territories,
  units,
  orders,
  showOrderAlert
});

export default rootReducer;
