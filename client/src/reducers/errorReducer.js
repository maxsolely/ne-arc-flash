import { ERROR_400, ERROR_401, RESET_ERROR_MESSAGE } from '../actions/types';

export default function(state = '', action) {
  switch (action.type) {
    case ERROR_400:
      return action.payload;

    case ERROR_401:
      return action.payload;

    case RESET_ERROR_MESSAGE:
      return '';

    default:
      return state;
  }
}
