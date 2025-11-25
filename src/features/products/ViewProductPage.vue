<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Back Button -->
      <button
        @click="router.back()"
        class="mb-6 inline-flex items-center text-primary hover:text-blue-900"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

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
      <div v-else-if="product" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <!-- Product Images -->
          <div>
            <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                :src="currentImage"
                :alt="product.title"
                class="w-full h-96 object-cover"
                @error="handleImageError"
              />
            </div>
            <!-- Thumbnail Gallery -->
            <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-2">
              <button
                v-for="(image, index) in product.images.slice(0, 4)"
                :key="index"
                @click="currentImage = image"
                :class="[
                  'aspect-w-1 aspect-h-1 bg-gray-200 rounded overflow-hidden border-2',
                  currentImage === image ? 'border-primary' : 'border-transparent'
                ]"
              >
                <img :src="image" :alt="`${product.title} ${index + 1}`" class="w-full h-20 object-cover" />
              </button>
            </div>
          </div>

          <!-- Product Information -->
          <div>
            <div class="mb-6">
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ formatCategory(product.category) }}
              </span>
            </div>

            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.title }}</h1>

            <div class="mb-6">
              <div class="flex items-baseline mb-2">
                <span class="text-4xl font-bold text-primary">${{ product.price.toFixed(2) }}</span>
                <span v-if="product.discountPercentage" class="ml-3 text-sm text-gray-500 line-through">
                  ${{ originalPrice.toFixed(2) }}
                </span>
              </div>
              <span v-if="product.discountPercentage" class="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                {{ product.discountPercentage }}% OFF
              </span>
            </div>

            <div class="mb-6">
              <div class="flex items-center mb-2">
                <span
                  :class="[
                    'h-3 w-3 rounded-full mr-2',
                    product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                  ]"
                ></span>
                <span :class="[
                  'text-sm font-medium',
                  product.stock > 0 ? 'text-green-700' : 'text-red-700'
                ]">
                  {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                </span>
              </div>
              <div v-if="product.rating" class="flex items-center">
                <div class="flex items-center mr-2">
                  <span v-for="i in 5" :key="i" class="text-yellow-400">
                    {{ i <= Math.round(product.rating) ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-sm text-gray-600">{{ product.rating.toFixed(1) }}</span>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Product Metadata -->
            <div class="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm text-gray-500">Brand</p>
                <p class="text-sm font-medium text-gray-900">{{ product.brand || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">SKU</p>
                <p class="text-sm font-medium text-gray-900">{{ product.sku || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Weight</p>
                <p class="text-sm font-medium text-gray-900">{{ product.weight ? `${product.weight}kg` : 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Warranty</p>
                <p class="text-sm font-medium text-gray-900">{{ product.warrantyInformation || 'N/A' }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-4">
              <router-link
                :to="`/products/${product.id}/edit`"
                class="btn-primary flex-1 text-center"
              >
                Edit Product
              </router-link>
              <button
                @click="showDeleteModal = true"
                class="btn-danger flex-1"
              >
                Delete Product
              </button>
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
