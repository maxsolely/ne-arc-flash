import axios from 'axios';
import {
  FETCH_STATIONS,
  ADD_STATION,
  ERROR_400,
  FETCH_STATION_INFO
} from './types';

export const fetchStations = xauth => async dispatch => {
  if (xauth === null || xauth.length === 0) {
    dispatch({ type: FETCH_STATIONS, payload: [] });
  } else {
    const res = await axios.get('/api/stations', {
      headers: {
        'x-auth': xauth
      }
    });

    dispatch({ type: FETCH_STATIONS, payload: res.data.stations });
  }
};

export const addStation = (xauth, body) => async dispatch => {
  // const { stationName, division, voltage, stationConfig } = body;
  if (xauth === null || xauth.length === 0) {
    dispatch({ type: ADD_STATION, payload: {} });
  } else {
    try {
      const res = await axios.post('/api/stations', body, {
        headers: { 'x-auth': xauth }
      });

      dispatch({ type: ADD_STATION, payload: res });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: ERROR_400,
        payload: error.response.data.message || error.response.data
      });
    }
  }
};

export const fetchStationInfo = (xauth, id) => async dispatch => {
  if (xauth === null || xauth.length === 0) {
    dispatch({ type: FETCH_STATION_INFO, payload: {} });
  } else {
    const res = await axios.get(`/api/stations/${id}`, {
      headers: {
        'x-auth': xauth
      }
    });

    const arcProOr1584 =
      parseFloat(res.data.station.voltage) < 20
        ? 'arccalc1584'
        : 'arccalcarcpro';

    const calculations = res.data.station.stationCalcs;
    const retrievedCalculations = await Promise.all(
      calculations.map(async e => {
        const calcRes = await axios.get(`api/${arcProOr1584}/${e}`, {
          headers: { 'x-auth': xauth }
        });
        return calcRes.data.calculation;
      })
    );

    res.data.station.stationCalcs = retrievedCalculations;
    dispatch({ type: FETCH_STATION_INFO, payload: res.data.station });
  }
};
