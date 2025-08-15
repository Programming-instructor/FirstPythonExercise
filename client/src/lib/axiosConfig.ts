import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, 
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response.data;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // Handle unauthorized (e.g., token expired)
        localStorage.removeItem('token');
        window.location.href = '/admin/auth';
        return Promise.reject({ message: 'Session expired. Please log in again.' });
      }
      if (status === 403) {
        return Promise.reject({ message: 'Forbidden: You do not have permission to perform this action.' });
      }
      if (status >= 500) {
        return Promise.reject({ message: 'Server error. Please try again later.' });
      }
      return Promise.reject(data);
    } else if (error.request) {
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      return Promise.reject({ message: 'An error occurred. Please try again.' });
    }
  }
);

export default api;