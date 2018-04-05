import { combineReducers } from 'redux';
import territories from './territories';
import units from './units';

const rootReducer = combineReducers({ territories, units });

export default rootReducer;
