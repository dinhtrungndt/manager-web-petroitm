import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import commandReducer from './CommandReducer';
import stationReducer from './StationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  command: commandReducer,
  station: stationReducer,
});

export default rootReducer;
