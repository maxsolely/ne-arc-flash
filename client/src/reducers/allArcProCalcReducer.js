import { FETCH_ALL_ARCPRO_CALCS } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_ALL_ARCPRO_CALCS:
      return action.payload;

    default:
      return state;
  }
}
