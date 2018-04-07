import { combineReducers } from 'redux';
import territories from './territories';
import units from './units';
import orders from './orders';
import showOrderAlert from './showOrderAlert';

const rootReducer = combineReducers({
  territories,
  units,
  orders,
  showOrderAlert
});

export default rootReducer;
