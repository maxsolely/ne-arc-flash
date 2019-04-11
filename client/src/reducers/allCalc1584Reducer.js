import { FETCH_ALL_1584_CALCS } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_ALL_1584_CALCS:
      return action.payload;

    default:
      return state;
  }
}
