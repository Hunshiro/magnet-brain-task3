import axios from 'axios';
import { useHistory } from 'react-router-dom'; // If you are using React Router for navigation

// Base URL for API calls
const API_BASE_URL =  'http://localhost:4000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response, // simply return the response if it's successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid
      localStorage.removeItem('token'); // Remove invalid token from local storage
      // Redirect user to login page or show a login modal
      window.location.href = '/login'; // Example: navigate to login page (adjust this as needed)
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiService = {
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
};

export default api;
