import { FETCH_USER, LOGIN_USER } from '../actions/types';

const INITIAL_STATE = {
  email: '',
  xauth: '',
  _id: ''
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        email: action.payload.email || false,
        _id: action.payload._id || false
      };
    case LOGIN_USER: {
      const { email, _id } = action.payload.userData;
      return { ...state, xauth: action.payload.xauth, email, _id };
    }
    default:
      return state;
  }
}
