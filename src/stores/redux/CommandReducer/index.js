import { CREATE_TASK_FAILURE, CREATE_TASK_REQUEST, CREATE_TASK_SUCCESS } from '../CommandTypes';

const initialState = {
  loading: false,
  error: null,
  lastCommand: null,
};

const commandReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TASK_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_TASK_SUCCESS:
      return { ...state, loading: false, lastCommand: action.payload, error: null };

    case CREATE_TASK_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default commandReducer;
