import {
  ADD_1584_CALC,
  DELETE_1584_CALC,
  FETCH_1584_CALCULATION_INFO
} from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    default:
      return state;

    case ADD_1584_CALC:
      return action.payload;

    case DELETE_1584_CALC:
      return state;

    case FETCH_1584_CALCULATION_INFO:
      console.log(action.payload);
      return action.payload;
  }
}
