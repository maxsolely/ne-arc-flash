import { ADD_1584_CALC } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    default:
      return state;

    case ADD_1584_CALC:
      return action.payload;
  }
}
