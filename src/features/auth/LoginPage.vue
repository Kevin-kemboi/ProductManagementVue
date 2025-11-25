<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="card w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Product Management</h1>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            required
            autocomplete="username"
            class="input-field"
            placeholder="Enter your username"
            :disabled="authStore.isLoading"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            autocomplete="current-password"
            class="input-field"
            placeholder="Enter your password"
            :disabled="authStore.isLoading"
          />
        </div>

        <!-- Error Message -->
        <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ authStore.error }}</p>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="btn-primary w-full py-3 text-base font-medium"
          :disabled="authStore.isLoading"
        >
          <span v-if="!authStore.isLoading">Login</span>
          <span v-else class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </span>
        </button>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
        <p class="text-sm text-blue-700">Username: <span class="font-mono">emilys</span></p>
        <p class="text-sm text-blue-700">Password: <span class="font-mono">emilyspass</span></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

// Form state
const credentials = reactive({
  username: '',
  password: '',
});

/**
 * Handle login form submission
 */
const handleLogin = async () => {
  console.log('=== LOGIN STARTED ===');
  console.log('Credentials:', credentials);
  
  // Clear any previous errors
  authStore.clearError();

  try {
    const result = await authStore.login(credentials);
    console.log('Login result:', result);
    console.log('Auth store state after login:', {
      token: authStore.token,
      user: authStore.user,
      isAuthenticated: authStore.isAuthenticated
    });
    
    // Show success message
    toast.success('Login successful! Welcome back.');

    // Redirect to the intended page or default to products
    const redirectPath = route.query.redirect || '/products';
    console.log('Redirecting to:', redirectPath);
    
    // Use nextTick to ensure state is updated before navigation
    await router.push(redirectPath);
    console.log('Navigation complete');
  } catch (error) {
    // Error is already set in the store and displayed in the template
    console.error('Login failed:', error);
    toast.error(authStore.error || 'Login failed');
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
