<template>
  <AppLayout>
    <div class="p-6 max-w-3xl mx-auto">
      <!-- Back Button -->
      <button
        @click="router.back()"
        class="mb-6 inline-flex items-center text-primary hover:text-blue-900"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Add New Product</h1>
        <p class="text-gray-600 mt-2">Fill in the details below to create a new product</p>
      </div>

      <!-- Product Form -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-8 space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="input-field"
            :class="{ 'border-red-500': validationErrors.title }"
            placeholder="Enter product title"
            @blur="validateField('title')"
            @input="clearFieldError('title')"
          />
          <p v-if="validationErrors.title" class="mt-1 text-sm text-red-600">
            {{ validationErrors.title }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            class="input-field resize-none"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <!-- Price and Stock (2-column grid) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Price -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
              Price <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="price"
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="input-field pl-8"
                :class="{ 'border-red-500': validationErrors.price }"
                placeholder="0.00"
                @blur="validateField('price')"
                @input="clearFieldError('price')"
              />
            </div>
            <p v-if="validationErrors.price" class="mt-1 text-sm text-red-600">
              {{ validationErrors.price }}
            </p>
          </div>

          <!-- Stock -->
          <div>
            <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity <span class="text-red-500">*</span>
            </label>
            <input
              id="stock"
              v-model.number="formData.stock"
              type="number"
              min="0"
              required
              class="input-field"
              :class="{ 'border-red-500': validationErrors.stock }"
              placeholder="0"
              @blur="validateField('stock')"
              @input="clearFieldError('stock')"
            />
            <p v-if="validationErrors.stock" class="mt-1 text-sm text-red-600">
              {{ validationErrors.stock }}
            </p>
          </div>
        </div>

        <!-- Category and Brand (2-column grid) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              v-model="formData.category"
              class="input-field"
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ formatCategory(category) }}
              </option>
            </select>
          </div>

          <!-- Brand -->
          <div>
            <label for="brand" class="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              id="brand"
              v-model="formData.brand"
              type="text"
              class="input-field"
              placeholder="Enter brand name"
            />
          </div>
        </div>

        <!-- Thumbnail URL -->
        <div>
          <label for="thumbnail" class="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail URL
          </label>
          <input
            id="thumbnail"
            v-model="formData.thumbnail"
            type="url"
            class="input-field"
            placeholder="https://example.com/image.jpg"
          />
          <p class="mt-1 text-xs text-gray-500">Enter a valid image URL</p>
          
          <!-- Image Preview -->
          <div v-if="formData.thumbnail" class="mt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              :src="formData.thumbnail"
              alt="Thumbnail preview"
              class="h-32 w-32 object-cover rounded border border-gray-300"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ formError }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="router.back()"
            class="btn-secondary"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="isSubmitting || !isFormValid"
          >
            <span v-if="!isSubmitting">Create Product</span>
            <span v-else class="flex items-center">
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
              Creating...
            </span>
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useToast } from '@/composables/useToast';
import AppLayout from '@/components/AppLayout.vue';

const router = useRouter();
const productStore = useProductStore();
const toast = useToast();

const isSubmitting = ref(false);
const formError = ref(null);
const categories = ref([]);

// Form data
const formData = reactive({
  title: '',
  description: '',
  price: null,
  stock: null,
  category: '',
  brand: '',
  thumbnail: '',
});

// Validation errors
const validationErrors = reactive({
  title: '',
  price: '',
  stock: '',
});

/**
 * Load categories on mount
 */
onMounted(async () => {
  try {
    categories.value = await productStore.fetchCategories();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
});

/**
 * Validate a specific field
 */
const validateField = (field) => {
  switch (field) {
    case 'title':
      if (!formData.title.trim()) {
        validationErrors.title = 'Title is required';
      } else if (formData.title.length < 3) {
        validationErrors.title = 'Title must be at least 3 characters';
      } else {
        validationErrors.title = '';
      }
      break;

    case 'price':
      if (formData.price === null || formData.price === '') {
        validationErrors.price = 'Price is required';
      } else if (formData.price <= 0) {
        validationErrors.price = 'Price must be greater than 0';
      } else {
        validationErrors.price = '';
      }
      break;

    case 'stock':
      if (formData.stock === null || formData.stock === '') {
        validationErrors.stock = 'Stock quantity is required';
      } else if (formData.stock < 0) {
        validationErrors.stock = 'Stock cannot be negative';
      } else {
        validationErrors.stock = '';
      }
      break;
  }
};

/**
 * Clear field error on input
 */
const clearFieldError = (field) => {
  validationErrors[field] = '';
};

/**
 * Validate entire form
 */
const validateForm = () => {
  validateField('title');
  validateField('price');
  validateField('stock');

  return !validationErrors.title && !validationErrors.price && !validationErrors.stock;
};

/**
 * Check if form is valid
 */
const isFormValid = computed(() => {
  return formData.title.trim() && 
         formData.price !== null && 
         formData.price > 0 && 
         formData.stock !== null && 
         formData.stock >= 0;
});

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    formError.value = 'Please fix the errors above before submitting.';
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  try {
    // Prepare payload
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category || 'general',
      brand: formData.brand.trim() || 'Generic',
      thumbnail: formData.thumbnail.trim() || 'https://via.placeholder.com/150',
    };

    // Create product (with optimistic update)
    const newProduct = await productStore.addProduct(payload);

    toast.success(`Product '${newProduct.title}' has been created successfully!`);

    // Redirect to the new product's view page
    router.push(`/products/${newProduct.id}`);
  } catch (error) {
    formError.value = error.userMessage || 'Failed to create product. Please try again.';
    toast.error(formError.value);
  } finally {
    isSubmitting.value = false;
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
  e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
};
</script>
