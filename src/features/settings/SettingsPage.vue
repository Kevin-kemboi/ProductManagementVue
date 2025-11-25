<template>
  <AppLayout>
    <div class="p-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-500 text-sm mt-1">Manage your application preferences and account settings.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Settings Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg border border-gray-200 p-4 space-y-1">
            <button class="w-full text-left px-4 py-2.5 bg-gray-50 text-gray-900 rounded-lg font-medium text-sm">
              Account Settings
            </button>
            <button class="w-full text-left px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
              Notifications
            </button>
            <button class="w-full text-left px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
              Security
            </button>
            <button class="w-full text-left px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
              Preferences
            </button>
          </div>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  :value="authStore.userFullName" 
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  disabled
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  :value="authStore.user?.email || 'N/A'" 
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  disabled
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input 
                  type="text" 
                  :value="authStore.user?.username || 'N/A'" 
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  disabled
                />
              </div>

              <div class="pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-500">
                  <strong>Note:</strong> This is a demo application. Account settings are read-only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import AppLayout from '@/components/AppLayout.vue';

const authStore = useAuthStore();
</script>
