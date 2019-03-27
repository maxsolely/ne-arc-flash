import {
  ADD_ARCPRO_CALC,
  DELETE_ARCPRO_CALC,
  FETCH_ARCPRO_CALCULATION_INFO
} from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    default:
      return state;

    case ADD_ARCPRO_CALC:
      return action.payload;

    case DELETE_ARCPRO_CALC:
      return state;

    case FETCH_ARCPRO_CALCULATION_INFO:
      console.log(action.payload);
      return action.payload;
  }
}
