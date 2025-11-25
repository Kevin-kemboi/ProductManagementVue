import { ref } from 'vue';

const toasts = ref([]);
let nextId = 0;

/**
 * Toast notification composable
 * Provides global toast notification functionality
 */
export function useToast() {
  /**
   * Show a toast notification
   * @param {Object} options - Toast options
   * @param {string} options.message - Toast message
   * @param {string} options.type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} options.duration - Duration in milliseconds (default: 3000)
   */
  const showToast = ({ message, type = 'info', duration = 3000 }) => {
    const id = nextId++;
    const toast = {
      id,
      message,
      type,
    };

    toasts.value.push(toast);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  /**
   * Remove a toast by ID
   * @param {number} id - Toast ID
   */
  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  /**
   * Show success toast
   * @param {string} message - Success message
   * @param {number} duration - Duration in milliseconds
   */
  const success = (message, duration = 3000) => {
    return showToast({ message, type: 'success', duration });
  };

  /**
   * Show error toast
   * @param {string} message - Error message
   * @param {number} duration - Duration in milliseconds
   */
  const error = (message, duration = 4000) => {
    return showToast({ message, type: 'error', duration });
  };

  /**
   * Show warning toast
   * @param {string} message - Warning message
   * @param {number} duration - Duration in milliseconds
   */
  const warning = (message, duration = 3000) => {
    return showToast({ message, type: 'warning', duration });
  };

  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {number} duration - Duration in milliseconds
   */
  const info = (message, duration = 3000) => {
    return showToast({ message, type: 'info', duration });
  };

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
