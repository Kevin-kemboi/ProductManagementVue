<template>
  <AppLayout>
    <div class="p-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Activity Log</h1>
            <p class="text-gray-500 text-sm mt-1">Track all product changes and actions in your system.</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="exportActivities"
              class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg inline-flex items-center text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Log
            </button>
            <button
              @click="clearActivitiesConfirm"
              class="bg-red-50 border border-red-300 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-lg inline-flex items-center text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Activities</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Products Created</p>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.created }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Products Updated</p>
              <p class="text-2xl font-bold text-blue-600 mt-1">{{ stats.updated }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Products Deleted</p>
              <p class="text-2xl font-bold text-red-600 mt-1">{{ stats.deleted }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex items-center gap-3">
        <select
          v-model="filterAction"
          class="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        >
          <option value="">All Actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
        </select>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by product name or user..."
          class="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />

        <button
          v-if="filterAction || searchQuery"
          @click="resetFilters"
          class="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900"
        >
          Reset
        </button>
      </div>

      <!-- Activity List -->
      <div v-if="filteredActivities.length > 0" class="bg-white rounded-lg border border-gray-200">
        <div class="divide-y divide-gray-100">
          <div
            v-for="activity in paginatedActivities"
            :key="activity.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start gap-4">
              <!-- Action Icon -->
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="getActionColorClass(activity.action)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="activity.action === 'created'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  <path v-else-if="activity.action === 'updated'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <!-- Activity Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-medium text-gray-900">
                    <span class="font-semibold">{{ activity.username }}</span>
                    <span class="text-gray-600 font-normal">
                      {{ getActionText(activity.action) }}
                    </span>
                    <span class="font-semibold">{{ activity.productTitle }}</span>
                  </p>
                  <span class="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {{ formatTimestamp(activity.timestamp) }}
                  </span>
                </div>

                <!-- Changes Detail -->
                <div v-if="activity.changes" class="mt-2 text-sm text-gray-600">
                  <div v-if="activity.action === 'created'" class="bg-green-50 border border-green-200 rounded px-3 py-2">
                    <span class="font-medium text-green-800">Created with:</span>
                    <span class="ml-2">Price: ${{ activity.changes.price }}, Stock: {{ activity.changes.stock }}</span>
                  </div>
                  <div v-else-if="activity.action === 'updated'" class="bg-blue-50 border border-blue-200 rounded px-3 py-2">
                    <span class="font-medium text-blue-800">Changed:</span>
                    <div class="mt-1 space-y-1">
                      <div v-for="(change, field) in activity.changes" :key="field" class="text-xs">
                        <span class="font-medium capitalize">{{ field }}:</span>
                        <span class="text-red-600 line-through ml-1">{{ formatChangeValue(change.from) }}</span>
                        <span class="mx-1">→</span>
                        <span class="text-green-600">{{ formatChangeValue(change.to) }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="activity.action === 'deleted'" class="bg-red-50 border border-red-200 rounded px-3 py-2">
                    <span class="font-medium text-red-800">Deleted permanently</span>
                    <span class="ml-2 text-xs">Price: ${{ activity.changes.price }}, Stock: {{ activity.changes.stock }}</span>
                  </div>
                </div>

                <!-- User Details -->
                <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span v-if="activity.userEmail">{{ activity.userEmail }}</span>
                  <span>ID: {{ activity.productId }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="border-t border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Showing {{ startIndex }} to {{ endIndex }} of {{ filteredActivities.length }} activities
            </p>
            <div class="flex items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ filterAction || searchQuery ? 'Try adjusting your filters' : 'Activity log will appear here as you create, update, or delete products.' }}
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useActivityStore } from '@/stores/activityStore';
import { useToast } from '@/composables/useToast';
import AppLayout from '@/components/AppLayout.vue';

const activityStore = useActivityStore();
const toast = useToast();

// Filter state
const filterAction = ref('');
const searchQuery = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(20);

/**
 * Load activities on mount
 */
onMounted(() => {
  activityStore.loadFromLocalStorage();
});

/**
 * Statistics
 */
const stats = computed(() => activityStore.getStatistics());

/**
 * Filtered activities
 */
const filteredActivities = computed(() => {
  let activities = activityStore.recentActivities;

  // Filter by action
  if (filterAction.value) {
    activities = activities.filter(a => a.action === filterAction.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    activities = activities.filter(a => 
      a.productTitle?.toLowerCase().includes(query) ||
      a.username?.toLowerCase().includes(query) ||
      a.userEmail?.toLowerCase().includes(query)
    );
  }

  return activities;
});

/**
 * Pagination
 */
const totalPages = computed(() => {
  return Math.ceil(filteredActivities.value.length / itemsPerPage.value);
});

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredActivities.value.slice(start, end);
});

const startIndex = computed(() => {
  if (filteredActivities.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, filteredActivities.value.length);
});

/**
 * Reset filters
 */
const resetFilters = () => {
  filterAction.value = '';
  searchQuery.value = '';
  currentPage.value = 1;
};

/**
 * Get action color class
 */
const getActionColorClass = (action) => {
  switch (action) {
    case 'created':
      return 'bg-green-100 text-green-600';
    case 'updated':
      return 'bg-blue-100 text-blue-600';
    case 'deleted':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

/**
 * Get action text
 */
const getActionText = (action) => {
  switch (action) {
    case 'created':
      return ' created ';
    case 'updated':
      return ' updated ';
    case 'deleted':
      return ' deleted ';
    default:
      return ' modified ';
  }
};

/**
 * Format timestamp
 */
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
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Format change value
 */
const formatChangeValue = (value) => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return value || 'N/A';
};

/**
 * Export activities to CSV
 */
const exportActivities = () => {
  const csvContent = activityStore.exportToCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `activity_log_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success('Activity log exported successfully');
};

/**
 * Clear all activities with confirmation
 */
const clearActivitiesConfirm = () => {
  if (confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
    activityStore.clearActivities();
    toast.success('Activity log cleared');
  }
};
</script>
