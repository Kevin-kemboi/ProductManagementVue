<template>
  <div class="animate-pulse space-y-4">
    <div v-for="i in count" :key="i" class="bg-white rounded-lg shadow p-4">
      <div class="flex items-center space-x-4">
        <!-- Circular Image Skeleton -->
        <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
        
        <!-- Content Skeleton -->
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <!-- Action Skeleton -->
        <div class="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 5,
  },
});
</script>
