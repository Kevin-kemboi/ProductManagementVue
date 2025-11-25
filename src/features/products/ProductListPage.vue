<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 class="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Products</h1>
          <router-link to="/products/new" class="btn-primary inline-flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </router-link>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow p-4 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="input-field pr-10"
              @input="debouncedSearch"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              ✕
            </button>
          </div>

          <!-- Category Filter -->
          <div class="md:w-48">
            <select
              v-model="selectedCategory"
              @change="applyFilters"
              class="input-field"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ formatCategory(category) }}
              </option>
            </select>
          </div>

          <!-- Sort -->
          <div class="md:w-48">
            <select
              v-model="sortBy"
              @change="applySorting"
              class="input-field"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="stock-desc">Stock: High to Low</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <SkeletonLoader v-if="productStore.isLoading && !productStore.hasProducts" :count="8" />

      <!-- Error State -->
      <div v-else-if="productStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ productStore.error }}</p>
        <button @click="loadProducts" class="btn-primary mt-3">Retry</button>
      </div>

      <!-- Products Table -->
      <div v-else-if="filteredProducts.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="viewProduct(product.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <img
                        :src="product.thumbnail"
                        :alt="product.title"
                        class="h-12 w-12 rounded-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.title }}</div>
                      <div class="text-sm text-gray-500">{{ truncateText(product.description, 50) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ formatCategory(product.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ product.price.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span
                      :class="[
                        'h-2 w-2 rounded-full mr-2',
                        product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                      ]"
                    ></span>
                    <span class="text-sm text-gray-900">
                      {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click.stop="viewProduct(product.id)"
                    class="text-primary hover:text-blue-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Results Info -->
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ filteredProducts.length }}</span> 
            of <span class="font-medium">{{ productStore.totalProducts }}</span> products
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating a new product.' }}
        </p>
        <div class="mt-6">
          <button v-if="searchQuery || selectedCategory" @click="resetFilters" class="btn-secondary mr-2">
            Reset Filters
          </button>
          <router-link to="/products/new" class="btn-primary">
            Add New Product
          </router-link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useToast } from '@/composables/useToast';
import AppLayout from '@/components/AppLayout.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';

const router = useRouter();
const productStore = useProductStore();
const toast = useToast();

// Filter and search state
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('');
const categories = ref([]);

// Debounce timeout
let searchTimeout = null;

/**
 * Load products on component mount
 */
onMounted(async () => {
  await loadProducts();
  await loadCategories();
});

/**
 * Load products from the API
 */
const loadProducts = async () => {
  try {
    await productStore.fetchProducts();
  } catch (error) {
    toast.error('Failed to load products. Please try again.');
  }
};

/**
 * Load categories from the API
 */
const loadCategories = async () => {
  try {
    categories.value = await productStore.fetchCategories();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

/**
 * Debounced search function
 */
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
};

/**
 * Apply filters and search
 */
const applyFilters = async () => {
  if (searchQuery.value) {
    try {
      await productStore.fetchProducts({ search: searchQuery.value });
    } catch (error) {
      toast.error('Search failed. Please try again.');
    }
  } else {
    await loadProducts();
  }
};

/**
 * Clear search query
 */
const clearSearch = () => {
  searchQuery.value = '';
  applyFilters();
};

/**
 * Reset all filters
 */
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  sortBy.value = '';
  loadProducts();
};

/**
 * Filtered and sorted products
 */
const filteredProducts = computed(() => {
  let products = [...productStore.products];

  // Filter by category
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value);
  }

  // Apply sorting
  if (sortBy.value) {
    const [field, order] = sortBy.value.split('-');
    products.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'title') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  return products;
});

/**
 * Apply sorting
 */
const applySorting = () => {
  // Sorting is reactive via computed property
};

/**
 * Navigate to product view page
 */
const viewProduct = (id) => {
  router.push(`/products/${id}`);
};

/**
 * Format category name
 */
const formatCategory = (category) => {
  if (!category || typeof category !== 'string') return '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text to specified length
 */
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Handle image loading errors
 */
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
};
</script>
