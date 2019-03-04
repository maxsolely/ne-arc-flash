import {
  FETCH_STATIONS,
  ADD_STATION,
  FETCH_STATION_INFO
} from '../actions/types';

const initialState = { stationsArray: [], currentStation: null };

export default function(state = initialState, action) {
  console.log(action.type);
  console.log(action.payload);
  switch (action.type) {
    default:
      return state;

    case FETCH_STATIONS:
      return { ...state, stationsArray: action.payload };

    case ADD_STATION:
      return state;

    case FETCH_STATION_INFO:
      return { ...state, currentStation: action.payload };
    // case FETCH_STATIONS: {
    //   if (state.length === 0) {
    //     return [...state].concat(action.payload);
    //   } else {
    //     const currentStateIDs = [...state].map(element => {
    //       return element._id;
    //     });
    //     console.log('currentStateIDs', currentStateIDs);
    //     const newStations = action.payload.filter(element => {
    //       console.log('from the filter function', element);
    //       return !currentStateIDs.includes(element._id);
    //     });
    //     console.log('newStations', newStations);

    //     return [...state].concat(newStations);
    //   }
    // }
  }
}
