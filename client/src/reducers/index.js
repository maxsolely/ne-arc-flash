import { combineReducers } from 'redux';
import authReducer from './authReducer';
import stationReducer from './stationReducer';
import calc1584Reducer from './calc1584Reducer';
import arcProReducer from './arcProReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  auth: authReducer,
  stations: stationReducer,
  calculation1584: calc1584Reducer,
  arcProCalculation: arcProReducer,
  errorMessage: errorReducer
});
