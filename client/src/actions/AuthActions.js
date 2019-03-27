import axios from 'axios';
import { FETCH_USER, LOGIN_USER } from './types';

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
