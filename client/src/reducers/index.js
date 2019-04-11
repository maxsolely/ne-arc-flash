import { combineReducers } from 'redux';
import authReducer from './authReducer';
import stationReducer from './stationReducer';
import calc1584Reducer from './calc1584Reducer';
import arcProReducer from './arcProReducer';
import errorReducer from './errorReducer';
import allCalc1584Reducer from './allCalc1584Reducer';
import allArcProCalcReducer from './allArcProCalcReducer';

export default combineReducers({
  auth: authReducer,
  stations: stationReducer,
  calculation1584: calc1584Reducer,
  arcProCalculation: arcProReducer,
  all1584Calcs: allCalc1584Reducer,
  allArcProCalcs: allArcProCalcReducer,
  errorMessage: errorReducer
});
