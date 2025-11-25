<template>
  <div class="relative" ref="dropdownRef">
    <!-- Notification Bell -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      :class="{ 'bg-gray-100': showDropdown }"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      
      <!-- Badge -->
      <span
        v-if="notificationStore.unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
      >
        {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[32rem] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 class="text-sm font-semibold text-gray-900">
          Notifications
          <span v-if="notificationStore.unreadCount > 0" class="ml-2 text-xs text-gray-500">
            ({{ notificationStore.unreadCount }} unread)
          </span>
        </h3>
        <div class="flex items-center gap-2">
          <button
            v-if="notificationStore.unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs text-primary hover:text-blue-900 font-medium"
          >
            Mark all read
          </button>
          <button
            @click="clearAll"
            class="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        </div>
      </div>

      <!-- Stock Alert Summary -->
      <div v-if="alertStats.total > 0" class="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
        <div class="flex items-center gap-2 text-sm">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="font-medium text-yellow-800">
            {{ alertStats.critical }} critical, {{ alertStats.low }} low stock items
          </span>
          <router-link 
            to="/products?filter=low-stock" 
            @click="closeDropdown"
            class="ml-auto text-xs text-yellow-700 hover:text-yellow-800 font-medium"
          >
            View all →
          </router-link>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="overflow-y-auto flex-1">
        <div v-if="notifications.length === 0" class="px-4 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">No notifications</p>
        </div>

        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
          :class="{ 'bg-blue-50': !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :class="getSeverityClass(notification.severity)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="notification.severity === 'critical' || notification.severity === 'out'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                <path v-else-if="notification.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-1">
                <p class="text-sm font-semibold text-gray-900">{{ notification.title }}</p>
                <button
                  @click.stop="deleteNotification(notification.id)"
                  class="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-gray-600">{{ notification.message }}</p>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs text-gray-500">
                  {{ formatTimestamp(notification.timestamp) }}
                </span>
                <span v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <router-link
          to="/activity"
          @click="closeDropdown"
          class="text-sm text-primary hover:text-blue-900 font-medium flex items-center justify-center"
        >
          View all activity
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notificationStore';

const router = useRouter();
const notificationStore = useNotificationStore();
const showDropdown = ref(false);
const dropdownRef = ref(null);

const notifications = computed(() => notificationStore.notifications.slice(0, 10));
const alertStats = computed(() => notificationStore.alertStats);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const markAllAsRead = () => {
  notificationStore.markAllAsRead();
};

const clearAll = () => {
  if (confirm('Are you sure you want to clear all notifications?')) {
    notificationStore.clearAllNotifications();
  }
};

const deleteNotification = (id) => {
  notificationStore.deleteNotification(id);
};

const handleNotificationClick = (notification) => {
  notificationStore.markAsRead(notification.id);
  
  if (notification.productId) {
    router.push(`/products/${notification.productId}`);
    closeDropdown();
  }
};

const getSeverityClass = (severity) => {
  switch (severity) {
    case 'critical':
    case 'out':
      return 'bg-red-100 text-red-600';
    case 'reorder':
    case 'low':
      return 'bg-yellow-100 text-yellow-600';
    case 'success':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-blue-100 text-blue-600';
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
