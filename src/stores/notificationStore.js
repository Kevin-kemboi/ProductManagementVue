import { defineStore } from 'pinia';
import { useProductStore } from './productStore';

/**
 * Notification Store
 * Manages system notifications, stock alerts, and reorder warnings
 */
export const useNotificationStore = defineStore('notification', {
  /**
   * State
   */
  state: () => ({
    notifications: [],
    stockAlerts: [],
    settings: {
      lowStockThreshold: 20,
      criticalStockThreshold: 5,
      reorderPoint: 10,
      enableEmailAlerts: false,
      enableBrowserNotifications: true,
    },
    unreadCount: 0,
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Get unread notifications
     */
    unreadNotifications: (state) => {
      return state.notifications.filter(n => !n.read);
    },

    /**
     * Get critical alerts (stock at or below critical threshold)
     */
    criticalAlerts: (state) => {
      return state.stockAlerts.filter(
        alert => alert.stock <= state.settings.criticalStockThreshold
      );
    },

    /**
     * Get low stock alerts
     */
    lowStockAlerts: (state) => {
      return state.stockAlerts.filter(
        alert => alert.stock > state.settings.criticalStockThreshold && 
                 alert.stock <= state.settings.lowStockThreshold
      );
    },

    /**
     * Get reorder suggestions
     */
    reorderSuggestions: (state) => {
      return state.stockAlerts.filter(
        alert => alert.stock <= state.settings.reorderPoint
      );
    },

    /**
     * Get alert statistics
     */
    alertStats: (state) => {
      return {
        total: state.stockAlerts.length,
        critical: state.stockAlerts.filter(
          a => a.stock <= state.settings.criticalStockThreshold
        ).length,
        low: state.stockAlerts.filter(
          a => a.stock > state.settings.criticalStockThreshold && 
               a.stock <= state.settings.lowStockThreshold
        ).length,
        reorder: state.stockAlerts.filter(
          a => a.stock <= state.settings.reorderPoint
        ).length,
      };
    },
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Initialize notification system
     */
    initialize() {
      this.loadSettings();
      this.loadNotifications();
      this.checkStockLevels();
      this.requestBrowserPermission();
    },

    /**
     * Check stock levels across all products
     */
    checkStockLevels() {
      const productStore = useProductStore();
      const alerts = [];

      productStore.products.forEach(product => {
        if (product.stock <= this.settings.lowStockThreshold) {
          const severity = this.getStockSeverity(product.stock);
          
          alerts.push({
            id: `stock-${product.id}`,
            productId: product.id,
            productTitle: product.title,
            stock: product.stock,
            threshold: this.settings.lowStockThreshold,
            reorderPoint: this.settings.reorderPoint,
            severity: severity,
            timestamp: new Date().toISOString(),
          });

          // Create notification for critical stock
          if (severity === 'critical' || severity === 'out') {
            this.addNotification({
              type: 'stock_alert',
              severity: severity,
              title: severity === 'out' ? 'Out of Stock!' : 'Critical Stock Alert',
              message: `${product.title} is ${severity === 'out' ? 'out of stock' : `critically low (${product.stock} units)`}`,
              productId: product.id,
              productTitle: product.title,
              stock: product.stock,
            });
          }
        }
      });

      this.stockAlerts = alerts;
    },

    /**
     * Get stock severity level
     */
    getStockSeverity(stock) {
      if (stock === 0) return 'out';
      if (stock <= this.settings.criticalStockThreshold) return 'critical';
      if (stock <= this.settings.reorderPoint) return 'reorder';
      if (stock <= this.settings.lowStockThreshold) return 'low';
      return 'normal';
    },

    /**
     * Add a new notification
     */
    addNotification(data) {
      // Check if similar notification already exists (within last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const existingNotification = this.notifications.find(n => 
        n.type === data.type &&
        n.productId === data.productId &&
        new Date(n.timestamp) > oneHourAgo
      );

      if (existingNotification) {
        return; // Don't create duplicate notifications
      }

      const notification = {
        id: Date.now() + Math.random(),
        type: data.type || 'info',
        severity: data.severity || 'info',
        title: data.title,
        message: data.message,
        productId: data.productId || null,
        productTitle: data.productTitle || null,
        stock: data.stock || null,
        read: false,
        timestamp: new Date().toISOString(),
        actionUrl: data.actionUrl || null,
      };

      this.notifications.unshift(notification);
      this.unreadCount = this.unreadNotifications.length;

      // Send browser notification if enabled
      if (this.settings.enableBrowserNotifications) {
        this.sendBrowserNotification(notification);
      }

      // Save to localStorage
      this.saveNotifications();

      return notification;
    },

    /**
     * Mark notification as read
     */
    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        this.unreadCount = this.unreadNotifications.length;
        this.saveNotifications();
      }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead() {
      this.notifications.forEach(n => n.read = true);
      this.unreadCount = 0;
      this.saveNotifications();
    },

    /**
     * Delete a notification
     */
    deleteNotification(notificationId) {
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
      this.unreadCount = this.unreadNotifications.length;
      this.saveNotifications();
    },

    /**
     * Clear all notifications
     */
    clearAllNotifications() {
      this.notifications = [];
      this.unreadCount = 0;
      this.saveNotifications();
    },

    /**
     * Update notification settings
     */
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
      this.saveSettings();
      this.checkStockLevels(); // Re-check with new thresholds
    },

    /**
     * Request browser notification permission
     */
    async requestBrowserPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          const permission = await Notification.requestPermission();
          this.settings.enableBrowserNotifications = permission === 'granted';
          this.saveSettings();
        } catch (error) {
          console.error('Failed to request notification permission:', error);
        }
      }
    },

    /**
     * Send browser notification
     */
    sendBrowserNotification(notification) {
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const browserNotif = new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `notification-${notification.id}`,
            requireInteraction: notification.severity === 'critical',
          });

          browserNotif.onclick = () => {
            window.focus();
            if (notification.productId) {
              window.location.href = `/products/${notification.productId}`;
            }
            browserNotif.close();
          };
        } catch (error) {
          console.error('Failed to send browser notification:', error);
        }
      }
    },

    /**
     * Load settings from localStorage
     */
    loadSettings() {
      try {
        const stored = localStorage.getItem('notificationSettings');
        if (stored) {
          this.settings = { ...this.settings, ...JSON.parse(stored) };
        }
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    },

    /**
     * Save settings to localStorage
     */
    saveSettings() {
      try {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
      } catch (error) {
        console.error('Failed to save notification settings:', error);
      }
    },

    /**
     * Load notifications from localStorage
     */
    loadNotifications() {
      try {
        const stored = localStorage.getItem('notifications');
        if (stored) {
          this.notifications = JSON.parse(stored);
          this.unreadCount = this.unreadNotifications.length;
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
        this.notifications = [];
      }
    },

    /**
     * Save notifications to localStorage
     */
    saveNotifications() {
      try {
        // Keep only last 100 notifications
        const notificationsToSave = this.notifications.slice(0, 100);
        localStorage.setItem('notifications', JSON.stringify(notificationsToSave));
      } catch (error) {
        console.error('Failed to save notifications:', error);
      }
    },

    /**
     * Generate reorder report
     */
    generateReorderReport() {
      const suggestions = this.reorderSuggestions;
      
      return {
        totalProducts: suggestions.length,
        criticalCount: suggestions.filter(s => s.severity === 'critical' || s.severity === 'out').length,
        estimatedReorderValue: suggestions.reduce((sum, s) => {
          const productStore = useProductStore();
          const product = productStore.getProductById(s.productId);
          const reorderQty = this.settings.reorderPoint * 2; // Reorder to 2x reorder point
          return sum + (product?.price || 0) * reorderQty;
        }, 0),
        products: suggestions.map(s => {
          const productStore = useProductStore();
          const product = productStore.getProductById(s.productId);
          const reorderQty = this.settings.reorderPoint * 2;
          
          return {
            ...s,
            suggestedQuantity: reorderQty,
            estimatedCost: (product?.price || 0) * reorderQty,
            category: product?.category,
          };
        }),
      };
    },
  },
});
