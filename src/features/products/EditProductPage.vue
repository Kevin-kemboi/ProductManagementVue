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

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow p-8">
        <div class="animate-pulse space-y-4">
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Error Loading Product -->
      <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <p class="text-red-600">{{ loadError }}</p>
        <button @click="loadProduct" class="btn-primary mt-3">Retry</button>
      </div>

      <!-- Edit Form -->
      <div v-else-if="formData.title">
        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800">Edit Product</h1>
          <p class="text-gray-600 mt-2">Update the product details below</p>
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

          <!-- Price and Stock -->
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

          <!-- Category and Brand -->
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

          <!-- Product Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div 
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              :class="[
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                isDragging ? 'border-primary bg-blue-50' : 'border-gray-300'
              ]"
            >
              <div v-if="!imagePreview" class="flex flex-col items-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p class="text-sm text-gray-600 mb-1">
                  <label for="file-upload-edit" class="text-primary hover:text-blue-900 cursor-pointer font-medium">
                    Click to upload
                  </label>
                  <span> or drag and drop</span>
                </p>
                <p class="text-xs text-gray-500 mb-3">PNG, JPG, GIF (MAX. 5MB)</p>
                
                <input
                  id="file-upload-edit"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileSelect"
                  ref="fileInput"
                />
                
                <div class="mt-3 w-full max-w-md">
                  <input
                    v-model="imageUrl"
                    type="url"
                    placeholder="Or paste image URL"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    @input="handleUrlInput"
                  />
                </div>
              </div>
              
              <div v-else class="space-y-3">
                <div class="relative inline-block">
                  <img
                    :src="imagePreview"
                    alt="Product preview"
                    class="mx-auto max-h-48 rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    @click="removeImage"
                    class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  @click="changeImage"
                  class="text-sm text-primary hover:text-blue-900 font-medium"
                >
                  Change Image
                </button>
              </div>
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
              <span v-if="!isSubmitting">Update Product</span>
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
                Updating...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useToast } from '@/composables/useToast';
import AppLayout from '@/components/AppLayout.vue';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const toast = useToast();

const isLoading = ref(false);
const isSubmitting = ref(false);
const loadError = ref(null);
const formError = ref(null);
const categories = ref([]);
const productId = ref(null);

// Image upload state
const imagePreview = ref(null);
const imageUrl = ref('');
const isDragging = ref(false);
const fileInput = ref(null);

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
 * Load product and categories on mount
 */
onMounted(async () => {
  await Promise.all([loadProduct(), loadCategories()]);
});

/**
 * Load product details
 */
const loadProduct = async () => {
  isLoading.value = true;
  loadError.value = null;

  try {
    productId.value = route.params.id;
    const product = await productStore.fetchProductById(productId.value);
    
    // Populate form with product data
    formData.title = product.title || '';
    formData.description = product.description || '';
    formData.price = product.price || null;
    formData.stock = product.stock || null;
    formData.category = product.category || '';
    formData.brand = product.brand || '';
    formData.thumbnail = product.thumbnail || '';
    
    // Set image preview if thumbnail exists
    if (product.thumbnail) {
      imagePreview.value = product.thumbnail;
    }

    // Update document title
    document.title = `Edit ${product.title} - Product App`;
  } catch (error) {
    loadError.value = error.userMessage || 'Failed to load product details.';
    toast.error(loadError.value);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Load categories
 */
const loadCategories = async () => {
  try {
    categories.value = await productStore.fetchCategories();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

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
 * Clear field error
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
      thumbnail: formData.thumbnail.trim(),
    };

    // Update product
    const updatedProduct = await productStore.updateProduct(productId.value, payload);

    toast.success(`Product '${updatedProduct.title}' has been updated successfully!`);

    // Redirect to the product view page
    router.push(`/products/${productId.value}`);
  } catch (error) {
    formError.value = error.userMessage || 'Failed to update product. Please try again.';
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

/**
 * Handle file selection from input
 */
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    processImageFile(file);
  }
};

/**
 * Handle file drop
 */
const handleFileDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processImageFile(file);
  } else {
    toast.error('Please drop a valid image file');
  }
};

/**
 * Process and validate image file
 */
const processImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    toast.error('Image size must be less than 5MB');
    return;
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid image file (JPG, PNG, GIF, or SVG)');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
    formData.thumbnail = e.target.result;
  };
  reader.readAsDataURL(file);
};

/**
 * Handle URL input
 */
const handleUrlInput = () => {
  if (imageUrl.value && isValidUrl(imageUrl.value)) {
    imagePreview.value = imageUrl.value;
    formData.thumbnail = imageUrl.value;
  }
};

/**
 * Validate URL
 */
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Remove uploaded image
 */
const removeImage = () => {
  imagePreview.value = null;
  imageUrl.value = '';
  formData.thumbnail = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

/**
 * Change image
 */
const changeImage = () => {
  removeImage();
};
</script>
