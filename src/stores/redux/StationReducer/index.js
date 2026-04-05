import { FETCH_STATIONS_FAILURE, FETCH_STATIONS_REQUEST, FETCH_STATIONS_SUCCESS } from '../StationTypes';

const initialState = {
  isFetching: true,
  stations: [],
  error: null,
};

const stationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STATIONS_REQUEST:
      return { ...state, isFetching: true, error: null };

    case FETCH_STATIONS_SUCCESS:
      return { ...state, isFetching: false, stations: action.payload, error: null };

    case FETCH_STATIONS_FAILURE:
      return { ...state, isFetching: false, error: action.payload };

    default:
      return state;
  }
};

export default stationReducer;
