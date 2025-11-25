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
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-xl font-bold text-primary">Product Management</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-2">
          <router-link
            to="/products"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary text-white hover:bg-primary"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </router-link>

          <router-link
            to="/products/new"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary text-white hover:bg-primary"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </router-link>
        </nav>

        <!-- User Section -->
        <div class="p-4 border-t border-gray-200">
          <div v-if="authStore.user" class="mb-3 px-4 py-2 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700">{{ authStore.userFullName }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user.email }}</p>
          </div>
          <button
            @click="handleLogout"
            class="w-full flex items-center px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile Header -->
      <header class="md:hidden bg-white border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-bold text-primary">Product Management</h1>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
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
