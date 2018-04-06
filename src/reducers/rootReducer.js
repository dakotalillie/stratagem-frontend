import { combineReducers } from 'redux';
import territories from './territories';
import units from './units';
import orders from './orders';

const rootReducer = combineReducers({ territories, units, orders });

export default rootReducer;
