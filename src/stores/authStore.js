import { defineStore } from 'pinia';
import apiClient from '@/api/axios';

/**
 * Authentication Store
 * Manages user authentication state, token persistence, and auth-related actions
 */
export const useAuthStore = defineStore('auth', {
  /**
   * State
   */
  state: () => ({
    token: null,
    user: null,
    isLoading: false,
    error: null,
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Check if the user is authenticated
     * @returns {boolean} True if user has a valid token
     */
    isAuthenticated: (state) => !!state.token,

    /**
     * Get the current user's full name
     * @returns {string|null} User's full name or null
     */
    userFullName: (state) => {
      if (state.user) {
        return `${state.user.firstName} ${state.user.lastName}`;
      }
      return null;
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Login user with credentials
     * @param {Object} credentials - User credentials
     * @param {string} credentials.username - Username
     * @param {string} credentials.password - Password
     * @returns {Promise<void>}
     */
    async login(credentials) {
      this.isLoading = true;
      this.error = null;

      try {
        console.log('Attempting login with:', credentials.username);
        
        // Call the DummyJSON auth endpoint
        const response = await apiClient.post('/auth/login', {
          username: credentials.username,
          password: credentials.password,
        });

        console.log('Login response:', response.data);

        // DummyJSON returns 'accessToken' instead of 'token'
        const { accessToken, refreshToken, ...user } = response.data;

        // Update the store state
        this.token = accessToken;
        this.user = user;

        // Persist to localStorage
        this.saveToLocalStorage();

        console.log('Login successful, token saved:', this.token);

        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        
        // Set error state with user-friendly message
        this.error = error.userMessage || error.response?.data?.message || 'Login failed. Please check your credentials.';
        
        // Clear any existing auth data
        this.clearAuth();
        
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Logout user and clear authentication data
     */
    logout() {
      this.clearAuth();
      this.removeFromLocalStorage();
    },

    /**
     * Restore user session from localStorage
     * Should be called on app initialization
     */
    restoreSession() {
      try {
        const authData = localStorage.getItem('auth');
        
        if (authData) {
          const { token, user } = JSON.parse(authData);
          
          // Validate the restored data
          if (token && user) {
            this.token = token;
            this.user = user;
            return true;
          }
        }
      } catch (error) {
        console.error('Error restoring session from localStorage:', error);
        // Clear potentially corrupted data
        this.removeFromLocalStorage();
      }
      
      return false;
    },

    /**
     * Clear authentication state
     * @private
     */
    clearAuth() {
      this.token = null;
      this.user = null;
      this.error = null;
    },

    /**
     * Save authentication data to localStorage
     * @private
     */
    saveToLocalStorage() {
      try {
        const authData = {
          token: this.token,
          user: this.user,
        };
        localStorage.setItem('auth', JSON.stringify(authData));
      } catch (error) {
        console.error('Error saving auth data to localStorage:', error);
      }
    },

    /**
     * Remove authentication data from localStorage
     * @private
     */
    removeFromLocalStorage() {
      try {
        localStorage.removeItem('auth');
      } catch (error) {
        console.error('Error removing auth data from localStorage:', error);
      }
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null;
    },
  },
});
