import { getToken } from '../../../utils/Token';
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from '../AuthTypes';

// Kiểm tra xem lúc mới F5 lại trang có token sẵn không
const hasToken = !!getToken();

const initialState = {
  loading: false,
  isAuthenticated: hasToken,
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };

    case LOGIN_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, error: action.payload };

    case LOGOUT:
      return { ...state, isAuthenticated: false, user: null, error: null };

    default:
      return state;
  }
};

export default authReducer;
