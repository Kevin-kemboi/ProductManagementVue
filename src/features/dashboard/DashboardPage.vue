<template>
  <AppLayout>
    <div class="p-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 text-sm mt-1">Overview of your e-commerce store performance.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ productStore.totalProducts }}</p>
          <p class="text-sm text-gray-500 mt-1">Total Products</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">0</p>
          <p class="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">0</p>
          <p class="text-sm text-gray-500 mt-1">Total Customers</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">$0.00</p>
          <p class="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Products</h2>
        <div v-if="productStore.products.length > 0" class="space-y-4">
          <div v-for="product in productStore.products.slice(0, 5)" :key="product.id" class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" @click="viewProduct(product.id)">
            <img :src="product.thumbnail" :alt="product.title" class="w-12 h-12 rounded-lg object-cover" @error="handleImageError" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ product.title }}</p>
              <p class="text-xs text-gray-500">{{ formatCategory(product.category) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">${{ product.price.toFixed(2) }}</p>
              <p class="text-xs" :class="product.stock > 20 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'">
                {{ product.stock }} in stock
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          No products available
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import AppLayout from '@/components/AppLayout.vue';

const router = useRouter();
const productStore = useProductStore();

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }
});

const viewProduct = (id) => {
  router.push(`/products/${id}`);
};

const formatCategory = (category) => {
  if (!category) return '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
};
</script>
