import axios from 'axios';
import {
  FETCH_USER,
  LOGIN_USER,
  FETCH_STATIONS,
  ADD_STATION,
  FETCH_STATION_INFO,
  ADD_1584_CALC
} from './types';

// export const fetchUser = () => {
//   return function(dispatch) {
//     axios
//       .get('/api/users/me', {
//         headers: {
//           'x-auth':
//             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzZlYzAwNGE3OGEzMWNhYzc2NmFlMDkiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUwODY2MDIzfQ.R6jAgLsWkwWfMohPdp596fkK2vPukSQpEguinCA2LVg'
//         }
//       })
//       .then(res => dispatch({ type: FETCH_USER, payload: res }));
//   };
// };

export const fetchUser = xauth => async dispatch => {
  if (xauth === null || xauth.length === 0) {
    dispatch({ type: FETCH_USER, payload: { email: '', password: '' } });
  } else {
    const res = await axios.get('/api/users/me', {
      headers: {
        'x-auth': xauth
      }
    });
    dispatch({ type: FETCH_USER, payload: res.data });
  }
};

export const loginUser = (email, password) => async dispatch => {
  const res = await axios.post('/api/users/login', {
    email: email,
    password: password
  });
  dispatch({
    type: LOGIN_USER,
    payload: { xauth: res.headers['x-auth'], userData: res.data }
  });
};

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
    const res = await axios.post('/api/stations', body, {
      headers: { 'x-auth': xauth }
    });

    dispatch({ type: ADD_STATION, payload: res });
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

    const calculations = res.data.station.stationCalcs;
    const retrievedCalculations = await Promise.all(
      calculations.map(async e => {
        const calcRes = await axios.get(`api/arccalc1584/${e}`, {
          headers: { 'x-auth': xauth }
        });
        return calcRes.data.calculation;
      })
    );

    res.data.station.stationCalcs = retrievedCalculations;
    dispatch({ type: FETCH_STATION_INFO, payload: res.data.station });
  }
};

export const add1584Calc = (xauth, body) => async dispatch => {
  //for some reason, faultCurrent and relayOpTime are getting converted to a string when they are getting passed into this action creator. They both need to be a Number.
  let updatedBody = { ...body };
  console.log(updatedBody);
  updatedBody.faultCurrent = parseFloat(updatedBody.faultCurrent);
  updatedBody.relayOpTime = parseFloat(updatedBody.relayOpTime);

  console.log('body from action creator', updatedBody);
  if (xauth === null || xauth.length === 0) {
    dispatch({ type: ADD_1584_CALC, payload: {} });
  } else {
    const res = await axios.post(
      '/api/arccalc1584',
      { calcParams: updatedBody },
      {
        headers: { 'x-auth': xauth }
      }
    );

    dispatch({ type: ADD_1584_CALC, payload: res.data });
  }
};
