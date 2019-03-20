import { ERROR_400 } from '../actions/types';

export default function(state = '', action) {
  switch (action.type) {
    case ERROR_400:
      return action.payload;

    default:
      return state;
  }
}
