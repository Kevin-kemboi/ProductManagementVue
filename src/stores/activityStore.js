import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

/**
 * Activity Log Store
 * Tracks all product-related actions (create, update, delete)
 */
export const useActivityStore = defineStore('activity', {
  /**
   * State
   */
  state: () => ({
    activities: [],
    isLoading: false,
    error: null,
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Get activities for a specific product
     */
    getProductActivities: (state) => (productId) => {
      return state.activities
        .filter(activity => activity.productId === productId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    /**
     * Get recent activities (last 50)
     */
    recentActivities: (state) => {
      return state.activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50);
    },

    /**
     * Get activities by action type
     */
    getActivitiesByType: (state) => (actionType) => {
      return state.activities
        .filter(activity => activity.action === actionType)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    /**
     * Get activities by user
     */
    getUserActivities: (state) => (userId) => {
      return state.activities
        .filter(activity => activity.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Log a product activity
     * @param {Object} activityData - Activity details
     */
    logActivity(activityData) {
      const authStore = useAuthStore();
      const user = authStore.user;

      const activity = {
        id: Date.now() + Math.random(), // Simple ID generation
        userId: user?.id || 'unknown',
        username: user?.username || user?.firstName || 'Unknown User',
        userEmail: user?.email || '',
        action: activityData.action, // 'created', 'updated', 'deleted'
        productId: activityData.productId,
        productTitle: activityData.productTitle,
        changes: activityData.changes || null, // What was changed
        timestamp: new Date().toISOString(),
        ipAddress: activityData.ipAddress || null,
        userAgent: navigator.userAgent || null,
      };

      // Add to beginning of activities array
      this.activities.unshift(activity);

      // Persist to localStorage
      this.saveToLocalStorage();

      return activity;
    },

    /**
     * Load activities from localStorage
     */
    loadFromLocalStorage() {
      try {
        const stored = localStorage.getItem('productActivities');
        if (stored) {
          this.activities = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load activities from localStorage:', error);
        this.activities = [];
      }
    },

    /**
     * Save activities to localStorage
     */
    saveToLocalStorage() {
      try {
        // Keep only last 500 activities to prevent localStorage overflow
        const activitiesToSave = this.activities.slice(0, 500);
        localStorage.setItem('productActivities', JSON.stringify(activitiesToSave));
      } catch (error) {
        console.error('Failed to save activities to localStorage:', error);
      }
    },

    /**
     * Clear all activities
     */
    clearActivities() {
      this.activities = [];
      localStorage.removeItem('productActivities');
    },

    /**
     * Delete activities for a specific product
     */
    deleteProductActivities(productId) {
      this.activities = this.activities.filter(
        activity => activity.productId !== productId
      );
      this.saveToLocalStorage();
    },

    /**
     * Get activity statistics
     */
    getStatistics() {
      const stats = {
        total: this.activities.length,
        created: this.activities.filter(a => a.action === 'created').length,
        updated: this.activities.filter(a => a.action === 'updated').length,
        deleted: this.activities.filter(a => a.action === 'deleted').length,
        uniqueProducts: new Set(this.activities.map(a => a.productId)).size,
        uniqueUsers: new Set(this.activities.map(a => a.userId)).size,
      };

      return stats;
    },

    /**
     * Export activities to CSV
     */
    exportToCSV() {
      const headers = [
        'Timestamp',
        'User',
        'Action',
        'Product ID',
        'Product Title',
        'Changes'
      ];

      const rows = this.activities.map(activity => [
        new Date(activity.timestamp).toLocaleString(),
        activity.username,
        activity.action.toUpperCase(),
        activity.productId || 'N/A',
        activity.productTitle || 'N/A',
        activity.changes ? JSON.stringify(activity.changes) : 'N/A'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      return csvContent;
    },
  },
});
