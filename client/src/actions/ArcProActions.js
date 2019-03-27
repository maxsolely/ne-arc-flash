import axios from 'axios';
import {
  FETCH_ARCPRO_CALCULATION_INFO,
  ADD_ARCPRO_CALC,
  DELETE_ARCPRO_CALC,
  ERROR_400
} from './types';

// export const fetch1584CalculationInfo = (xauth, id) => async dispatch => {
//   if (xauth === null || xauth.length === 0) {
//     dispatch({ type: FETCH_1584_CALCULATION_INFO, payload: {} });
//   } else {
//     const res = await axios.get(`/api/arccalc1584/${id}`, {
//       headers: {
//         'x-auth': xauth
//       }
//     });

//     dispatch({
//       type: FETCH_1584_CALCULATION_INFO,
//       payload: res.data.calculation
//     });
//   }
// };

export const addArcProCalc = (
  xauth,
  { calcParams, arcProInput, arcProResults, results }
) => async dispatch => {
  //for some reason, faultCurrent and relayOpTime are getting converted to a string when they are getting passed into this action creator. They both need to be a Number.
  //   let reformattedCalcParams = { ...calcParams };
  //   reformattedCalcParams.boltedFaultCurrent = parseFloat(
  //     reformattedCalcParams.boltedFaultCurrent
  //   );
  //   reformattedCalcParams.totalClearingTime = parseFloat(
  //     reformattedCalcParams.totalClearingTime
  //   );

  //   let reformattedResults = { ...results };
  //   reformattedResults.incidentEnergy = parseFloat(
  //     reformattedResults.incidentEnergy
  //   );
  //   reformattedResults.calculatedArcFlashEnergy = parseFloat(
  //     reformattedResults.calculatedArcFlashEnergy
  //   );

  if (xauth === null || xauth.length === 0) {
    dispatch({ type: ADD_ARCPRO_CALC, payload: {} });
  } else {
    try {
      const res = await axios.post(
        '/api/arccalcarcpro',
        { calcParams, arcProInput, arcProResults, results },
        {
          headers: { 'x-auth': xauth }
        }
      );
      dispatch({ type: ADD_ARCPRO_CALC, payload: res.data });
    } catch (error) {
      console.log(error.response.data.message);
      dispatch({ type: ERROR_400, payload: error.response.data.message });
    }
  }
};

export const deleteArcProCalc = (xauth, calcID) => async dispatch => {
  if (xauth === null || xauth.length === 0) {
    dispatch({ type: DELETE_ARCPRO_CALC, payload: {} });
  } else {
    const res = await axios.delete(`/api/arccalcarcpro/${calcID}`, {
      headers: { 'x-auth': xauth }
    });

    dispatch({ type: DELETE_ARCPRO_CALC, payload: res.data });
  }
};
