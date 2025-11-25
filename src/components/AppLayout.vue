<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white border-r border-gray-200 transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-0 md:w-64'
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Logo/Brand -->
        <div class="p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 class="text-base font-semibold text-gray-900">E-Commerce</h1>
              <p class="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-1">
          <router-link
            to="/dashboard"
            class="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary text-white hover:bg-primary"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span class="text-sm font-medium">Dashboard</span>
          </router-link>

          <router-link
            to="/products"
            class="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary text-white hover:bg-primary"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
            </svg>
            <span class="text-sm font-medium">Products</span>
          </router-link>

          <router-link
            to="/orders"
            class="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary text-white hover:bg-primary"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="text-sm font-medium">Orders</span>
          </router-link>

          <router-link
            to="/customers"
            class="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary text-white hover:bg-primary"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="text-sm font-medium">Customers</span>
          </router-link>

          <router-link
            to="/activity"
            class="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary text-white hover:bg-primary"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="text-sm font-medium">Activity Log</span>
          </router-link>
        </nav>

        <!-- Bottom Section -->
        <div class="p-4 space-y-1">
          <router-link
            to="/settings"
            class="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary text-white hover:bg-primary"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-sm font-medium">Settings</span>
          </router-link>

          <button
            @click="handleLogout"
            class="w-full flex items-center px-4 py-2.5 text-white bg-primary rounded-lg hover:bg-blue-900 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Desktop Header with Notifications -->
      <header class="hidden md:flex bg-white border-b border-gray-200 px-6 py-3 items-center justify-end">
        <NotificationBell />
      </header>

      <!-- Mobile Header -->
      <header class="md:hidden bg-white border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-bold text-primary">Product Management</h1>
          <div class="flex items-center gap-2">
            <NotificationBell />
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useToast } from '@/composables/useToast';
import NotificationBell from './NotificationBell.vue';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const toast = useToast();

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleLogout = () => {
  authStore.logout();
  toast.info('You have been logged out.');
  router.push('/login');
};

// Initialize notification system
onMounted(() => {
  notificationStore.initialize();
});
</script>

<style scoped>
/* Additional styles for sidebar transitions */
@media (max-width: 768px) {
  aside {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
  }
}
</style>
