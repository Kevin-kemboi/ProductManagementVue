<template>
  <AppLayout>
    <div class="p-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Stock Alerts & Reorder Management</h1>
            <p class="text-gray-500 text-sm mt-1">Monitor inventory levels and manage reorder points.</p>
          </div>
          <button
            @click="showSettingsModal = true"
            class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg inline-flex items-center text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Alerts</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ alertStats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Critical Stock</p>
              <p class="text-2xl font-bold text-red-600 mt-1">{{ alertStats.critical }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Low Stock</p>
              <p class="text-2xl font-bold text-orange-600 mt-1">{{ alertStats.low }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Reorder Needed</p>
              <p class="text-2xl font-bold text-blue-600 mt-1">{{ alertStats.reorder }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Reorder Report -->
      <div v-if="reorderReport.totalProducts > 0" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-blue-900 mb-2">Reorder Recommendations</h3>
            <p class="text-sm text-blue-700 mb-4">
              {{ reorderReport.totalProducts }} product{{ reorderReport.totalProducts > 1 ? 's' : '' }} need{{ reorderReport.totalProducts === 1 ? 's' : '' }} reordering
              <span class="ml-2 font-semibold">
                ({{ reorderReport.criticalCount }} critical)
              </span>
            </p>
            <div class="text-sm text-blue-800">
              <span class="font-semibold">Estimated Reorder Value:</span>
              <span class="ml-2 text-lg font-bold">${{ reorderReport.estimatedReorderValue.toFixed(2) }}</span>
            </div>
          </div>
          <button
            @click="downloadReorderReport"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Report
          </button>
        </div>
      </div>

      <!-- Alerts List -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Stock Alerts</h3>
          <button
            @click="refreshAlerts"
            class="text-sm text-primary hover:text-blue-900 font-medium inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div v-if="sortedAlerts.length === 0" class="px-6 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">All stocks are healthy!</h3>
          <p class="mt-1 text-sm text-gray-500">No products require attention at this time.</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="alert in sortedAlerts"
            :key="alert.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <!-- Severity Badge -->
              <div 
                class="w-3 h-3 rounded-full flex-shrink-0"
                :class="getSeverityColor(alert.severity)"
              ></div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <router-link
                    :to="`/products/${alert.productId}`"
                    class="text-sm font-semibold text-gray-900 hover:text-primary"
                  >
                    {{ alert.productTitle }}
                  </router-link>
                  <span 
                    class="text-xs font-semibold px-2 py-1 rounded"
                    :class="getSeverityBadgeClass(alert.severity)"
                  >
                    {{ getSeverityLabel(alert.severity) }}
                  </span>
                </div>
                
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Current Stock: <span class="font-semibold">{{ alert.stock }}</span>
                  </span>
                  <span class="flex items-center gap-1">
                    Reorder Point: <span class="font-semibold">{{ alert.reorderPoint }}</span>
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ formatTimestamp(alert.timestamp) }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <router-link
                  :to="`/products/${alert.productId}/edit`"
                  class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-blue-900 transition-colors"
                >
                  Update Stock
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div
      v-if="showSettingsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showSettingsModal = false"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Alert Settings</h3>
          <button @click="showSettingsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Low Stock Threshold
            </label>
            <input
              v-model.number="settingsForm.lowStockThreshold"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p class="mt-1 text-xs text-gray-500">Alert when stock falls below this level</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Critical Stock Threshold
            </label>
            <input
              v-model.number="settingsForm.criticalStockThreshold"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p class="mt-1 text-xs text-gray-500">Critical alert threshold</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reorder Point
            </label>
            <input
              v-model.number="settingsForm.reorderPoint"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p class="mt-1 text-xs text-gray-500">Suggest reorder when stock reaches this level</p>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Browser Notifications</label>
            <button
              @click="settingsForm.enableBrowserNotifications = !settingsForm.enableBrowserNotifications"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="settingsForm.enableBrowserNotifications ? 'bg-primary' : 'bg-gray-300'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="settingsForm.enableBrowserNotifications ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            @click="showSettingsModal = false"
            class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            @click="saveSettings"
            class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-900"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import { useToast } from '@/composables/useToast';
import AppLayout from '@/components/AppLayout.vue';

const notificationStore = useNotificationStore();
const toast = useToast();

const showSettingsModal = ref(false);
const settingsForm = ref({ ...notificationStore.settings });

const alertStats = computed(() => notificationStore.alertStats);
const sortedAlerts = computed(() => {
  return [...notificationStore.stockAlerts].sort((a, b) => {
    const severityOrder = { out: 0, critical: 1, reorder: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
});

const reorderReport = computed(() => notificationStore.generateReorderReport());

const refreshAlerts = () => {
  notificationStore.checkStockLevels();
  toast.success('Stock alerts refreshed');
};

const saveSettings = () => {
  notificationStore.updateSettings(settingsForm.value);
  showSettingsModal.value = false;
  toast.success('Settings saved successfully');
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'out': return 'bg-gray-500';
    case 'critical': return 'bg-red-500';
    case 'reorder': return 'bg-orange-500';
    case 'low': return 'bg-yellow-500';
    default: return 'bg-gray-300';
  }
};

const getSeverityBadgeClass = (severity) => {
  switch (severity) {
    case 'out': return 'bg-gray-100 text-gray-800';
    case 'critical': return 'bg-red-100 text-red-800';
    case 'reorder': return 'bg-orange-100 text-orange-800';
    case 'low': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSeverityLabel = (severity) => {
  switch (severity) {
    case 'out': return 'OUT OF STOCK';
    case 'critical': return 'CRITICAL';
    case 'reorder': return 'REORDER NOW';
    case 'low': return 'LOW STOCK';
    default: return 'NORMAL';
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

const downloadReorderReport = () => {
  const report = reorderReport.value;
  const csvContent = [
    ['Product', 'Current Stock', 'Reorder Point', 'Suggested Quantity', 'Estimated Cost', 'Category'].join(','),
    ...report.products.map(p => [
      `"${p.productTitle}"`,
      p.stock,
      p.reorderPoint,
      p.suggestedQuantity,
      p.estimatedCost.toFixed(2),
      p.category || 'N/A'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reorder_report_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  
  toast.success('Reorder report downloaded');
};

onMounted(() => {
  notificationStore.checkStockLevels();
});
</script>
