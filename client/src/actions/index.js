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

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/users/me', {
    headers: {
      'x-auth':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzZlYzAwNGE3OGEzMWNhYzc2NmFlMDkiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxMTE5NzQyfQ.Y3GtfoISe3BCOP51OKZDLnueiJCxHABz2mpZvtQXg4'
    }
  });
  dispatch({ type: FETCH_USER, payload: res.data });
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
