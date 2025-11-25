import axios from 'axios';

/**
 * Centralized Axios instance with request/response interceptors
 * Base URL: https://dummyjson.com
 */
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

/**
 * Request Interceptor
 * Automatically attaches the authentication token from localStorage to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const authData = localStorage.getItem('auth');
    
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        
        // Attach the token to the Authorization header if it exists
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data from localStorage:', error);
      }
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global error responses and token expiration
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return the response data directly for successful requests
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token might be invalid or expired
          console.error('Unauthorized access - redirecting to login');
          // Clear auth data
          localStorage.removeItem('auth');
          // Redirect to login page if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
          
        case 404:
          console.error('Resource not found');
          break;
          
        case 500:
          console.error('Internal server error');
          break;
          
        default:
          console.error(`API Error: ${status}`, data);
      }
      
      // Attach a user-friendly error message
      error.userMessage = data?.message || 'An error occurred. Please try again.';
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
      error.userMessage = 'Unable to reach the server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      error.userMessage = 'An unexpected error occurred.';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
