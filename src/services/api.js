import axios from 'axios';
import toast from 'react-hot-toast';
import { getStore } from '../stores/redux';
import { LOGOUT } from '../stores/redux/AuthTypes';
import { getToken, removeToken } from '../utils/Token';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================================
// 1. INTERCEPTOR REQUEST: Gắn Token vào trước khi gửi đi
// ========================================================
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================================================
// 2. INTERCEPTOR RESPONSE: Bắt lỗi khi Backend trả về
// ========================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {

      if (error.config.url.includes('/login')) {
        return Promise.reject(error);
      }

      console.warn("🔒 Token đã hết hạn hoặc không hợp lệ. Đang tự động đăng xuất...");

      removeToken();

      const store = getStore();
      if (store) {
        store.dispatch({ type: LOGOUT });
      }

      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!", {
        id: 'session_expired'
      });
    }

    return Promise.reject(error);
  }
);

export default api;
