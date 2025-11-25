<template>
  <AppLayout>
    <div class="p-8">
      <!-- Breadcrumb -->
      <div class="mb-6 flex items-center text-sm text-gray-500">
        <router-link to="/products" class="hover:text-gray-700">Products</router-link>
        <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-900">{{ product?.title || 'Loading...' }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow p-8">
        <div class="animate-pulse space-y-4">
          <div class="h-64 bg-gray-200 rounded"></div>
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <p class="text-red-600">{{ error }}</p>
        <button @click="loadProduct" class="btn-primary mt-3">Retry</button>
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Product Image -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center" style="height: 500px;">
            <img
              :src="currentImage"
              :alt="product.title"
              class="max-w-full max-h-full object-contain"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- Right Column - Product Information -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ product.title }}</h1>
          
          <p class="text-gray-600 mb-6 leading-relaxed">{{ product.description }}</p>

          <router-link :to="`/products/${product.id}/edit`" class="mb-6 inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Product
          </router-link>

          <div class="space-y-4 mb-6">
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Price</span>
              <span class="text-2xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Category</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {{ formatCategory(product.category) }}
              </span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Stock</span>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'w-2 h-2 rounded-full',
                    product.stock > 20 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
                  ]"
                ></span>
                <span class="text-sm font-medium" :class="[
                  product.stock > 20 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                ]">
                  {{ product.stock > 20 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock' }}
                </span>
                <span class="text-sm text-gray-900 ml-2">{{ product.stock }} units</span>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ product.description || 'Crafted from 100% genuine full-grain leather, this jacket offers a timeless look with modern durability. It features classic zip-front closure, multiple pockets for convenience, and a comfortable inner lining. The natural aging process of the leather ensures that each jacket becomes uniquely yours over time. Suitable for casual outings or a night on the town, it\'s a versatile addition to any wardrobe.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Customer Reviews Section -->
      <div v-if="product" class="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        
        <div class="flex items-start gap-12">
          <!-- Rating Summary -->
          <div class="text-center">
            <div class="text-5xl font-bold text-gray-900 mb-2">4.5</div>
            <div class="flex items-center justify-center mb-2">
              <span v-for="i in 5" :key="i" class="text-yellow-400 text-xl">
                {{ i <= 4 ? '★' : '★' }}
              </span>
            </div>
            <p class="text-sm text-gray-600">Based on 120 reviews</p>
          </div>

          <!-- Rating Breakdown -->
          <div class="flex-1">
            <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-3 mb-2">
              <span class="text-sm text-gray-600 w-3">{{ star }}</span>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full"
                  :class="star === 5 ? 'bg-yellow-400' : star === 4 ? 'bg-yellow-400' : 'bg-gray-300'"
                  :style="{ width: star === 5 ? '75%' : star === 4 ? '15%' : star === 3 ? '5%' : star === 2 ? '3%' : '2%' }"
                ></div>
              </div>
              <span class="text-sm text-gray-600 w-8">{{ star === 5 ? '75%' : star === 4 ? '15%' : star === 3 ? '5%' : star === 2 ? '3%' : '2%' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Product"
      :message="`Are you sure you want to delete '${product?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      :is-danger="true"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useToast } from '@/composables/useToast';
import AppLayout from '@/components/AppLayout.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const toast = useToast();

const product = ref(null);
const isLoading = ref(false);
const error = ref(null);
const showDeleteModal = ref(false);
const isDeleting = ref(false);
const currentImage = ref('');

/**
 * Computed original price (before discount)
 */
const originalPrice = computed(() => {
  if (!product.value || !product.value.discountPercentage) return 0;
  return product.value.price / (1 - product.value.discountPercentage / 100);
});

/**
 * Load product on mount
 */
onMounted(async () => {
  await loadProduct();
});

/**
 * Update document title when product loads
 */
const updateTitle = () => {
  if (product.value) {
    document.title = `${product.value.title} - Product App`;
  }
};

/**
 * Load product details
 */
const loadProduct = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const productId = route.params.id;
    const data = await productStore.fetchProductById(productId);
    product.value = data;
    currentImage.value = data.thumbnail || data.images?.[0] || '';
    updateTitle();
  } catch (err) {
    error.value = err.userMessage || 'Failed to load product details.';
    toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Handle product deletion
 */
const handleDelete = async () => {
  isDeleting.value = true;

  try {
    await productStore.deleteProduct(product.value.id);
    toast.success(`Product '${product.value.title}' has been deleted successfully.`);
    showDeleteModal.value = false;
    router.push('/products');
  } catch (err) {
    toast.error(err.userMessage || 'Failed to delete product.');
  } finally {
    isDeleting.value = false;
  }
};

/**
 * Format category name
 */
const formatCategory = (category) => {
  if (!category) return '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Handle image loading errors
 */
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/400?text=No+Image';
};
</script>
