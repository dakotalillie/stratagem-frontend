import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import isLoggedIn from './isLoggedIn';
import currentUser from './currentUser';
import games from './games';
import currentTurn from './currentTurn';
import countries from './countries';
import territories from './territories';
import units from './units';
import retreatingUnits from './retreatingUnits';
import orders from './orders';
import showOrderAlert from './showOrderAlert';
import convoyRoutes from './convoyRoutes';

const rootReducer = combineReducers({
  isLoggedIn,
  currentUser,
  games,
  currentTurn,
  countries,
  territories,
  units,
  retreatingUnits,
  orders,
  convoyRoutes,
  showOrderAlert,
  router: routerReducer
});

export default rootReducer;
