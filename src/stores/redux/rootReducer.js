import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import commandReducer from './CommandReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  command: commandReducer,
});

export default rootReducer;
