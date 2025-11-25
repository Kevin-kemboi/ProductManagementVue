<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <!-- Logo -->
    <div class="mb-8 flex items-center gap-3">
      <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <span class="text-xl font-semibold text-gray-900">Platform Logo</span>
    </div>

    <!-- Login Card -->
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p class="text-gray-500 text-sm">Sign in to manage your products.</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email or Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-900 mb-2">
            Email or Username
          </label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            required
            autocomplete="username"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="you@example.com"
            :disabled="authStore.isLoading"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-900 mb-2">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              class="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Enter your password"
              :disabled="authStore.isLoading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabindex="-1"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <span class="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <a href="#" class="text-sm text-primary hover:text-blue-900 font-medium">
            Forgot Password?
          </a>
        </div>

        <!-- Error Message -->
        <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ authStore.error }}</p>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="w-full bg-primary hover:bg-blue-900 text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p class="text-xs font-medium text-blue-800 mb-2">Demo Credentials:</p>
        <p class="text-xs text-blue-700">Username: <span class="font-mono">emilys</span></p>
        <p class="text-xs text-blue-700">Password: <span class="font-mono">emilyspass</span></p>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-8 text-center">
      <p class="text-sm text-gray-500">© 2024 Platform Inc. All Rights Reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
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

const showPassword = ref(false);
const rememberMe = ref(false);

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
