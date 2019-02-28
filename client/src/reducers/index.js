import { combineReducers } from 'redux';
import authReducer from './authReducer';
import stationReducer from './stationReducer';

export default combineReducers({
  auth: authReducer,
  stations: stationReducer
});
