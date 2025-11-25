<template>
  <AppLayout>
    <div class="p-8 max-w-3xl">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p class="text-gray-500 mt-1 text-sm">Enter the details below to add a new item to your inventory.</p>
      </div>

      <!-- Product Form -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <!-- Product Information Section -->
        <div>
          <h2 class="text-base font-semibold text-gray-900 mb-4">Product Information</h2>
          
          <!-- Title -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Product Title
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
              Product Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
              placeholder="Provide a detailed description of the product"
            ></textarea>
          </div>
        </div>

        <!-- Pricing & Inventory Section -->
        <div>
          <h2 class="text-base font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Price -->
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  id="price"
                  v-model.number="formData.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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

            <!-- Stock Quantity -->
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                id="stock"
                v-model.number="formData.stock"
                type="number"
                min="0"
                required
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                :class="{ 'border-red-500': validationErrors.stock }"
                placeholder="Enter stock quantity"
                @blur="validateField('stock')"
                @input="clearFieldError('stock')"
              />
              <p v-if="validationErrors.stock" class="mt-1 text-sm text-red-600">
                {{ validationErrors.stock }}
              </p>
            </div>
          </div>

          <!-- Category -->
          <div class="mt-4">
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              v-model="formData.category"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ formatCategory(category) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Media Section -->
        <div>
          <h2 class="text-base font-semibold text-gray-900 mb-4">Media</h2>
          
          <div 
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
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
                <label for="file-upload" class="text-primary hover:text-blue-900 cursor-pointer font-medium">
                  Click to upload
                </label>
                <span> or drag and drop</span>
              </p>
              <p class="text-xs text-gray-500 mb-4">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
              
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
                ref="fileInput"
              />
              
              <!-- URL Input Option -->
              <div class="mt-4 w-full max-w-md">
                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                  </div>
                  <div class="relative flex justify-center text-xs">
                    <span class="px-2 bg-white text-gray-500">Or paste image URL</span>
                  </div>
                </div>
                <input
                  v-model="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  class="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  @input="handleUrlInput"
                />
              </div>
            </div>
            
            <!-- Image Preview -->
            <div v-else class="space-y-4">
              <div class="relative inline-block">
                <img
                  :src="imagePreview"
                  alt="Product preview"
                  class="mx-auto max-h-64 rounded-lg border border-gray-300"
                  @error="handleImageError"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="text-sm text-gray-600">
                <p class="font-medium">{{ uploadedFileName || 'Image from URL' }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ uploadedFileSize || 'External image' }}</p>
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

        <!-- Product Variants Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-semibold text-gray-900">Product Variants</h2>
              <p class="text-xs text-gray-500 mt-1">Add size, color, or other variations with individual stock and pricing</p>
            </div>
            <button
              type="button"
              @click="toggleVariantsEnabled"
              class="text-sm font-medium transition-colors"
              :class="variantsEnabled ? 'text-primary hover:text-blue-900' : 'text-gray-600 hover:text-gray-900'"
            >
              {{ variantsEnabled ? 'Disable Variants' : 'Enable Variants' }}
            </button>
          </div>

          <div v-if="variantsEnabled" class="space-y-4">
            <!-- Variant Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sizes
                </label>
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="size in availableSizes"
                    :key="size"
                    class="inline-flex items-center px-3 py-1.5 border rounded-lg cursor-pointer transition-colors text-sm"
                    :class="selectedSizes.includes(size) 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'"
                  >
                    <input
                      type="checkbox"
                      :value="size"
                      v-model="selectedSizes"
                      @change="generateVariants"
                      class="hidden"
                    />
                    {{ size }}
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Colors
                </label>
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="color in availableColors"
                    :key="color.name"
                    class="inline-flex items-center px-3 py-1.5 border rounded-lg cursor-pointer transition-colors text-sm"
                    :class="selectedColors.includes(color.name) 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'"
                  >
                    <input
                      type="checkbox"
                      :value="color.name"
                      v-model="selectedColors"
                      @change="generateVariants"
                      class="hidden"
                    />
                    <span 
                      class="w-3 h-3 rounded-full mr-2 border border-gray-300"
                      :style="{ backgroundColor: color.hex }"
                    ></span>
                    {{ color.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Variant List -->
            <div v-if="variants.length > 0" class="mt-6">
              <h3 class="text-sm font-medium text-gray-900 mb-3">
                Generated Variants ({{ variants.length }})
              </h3>
              <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
                <div
                  v-for="(variant, index) in variants"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-900">{{ variant.name }}</span>
                      <span 
                        v-if="variant.color"
                        class="w-4 h-4 rounded-full border border-gray-300"
                        :style="{ backgroundColor: getColorHex(variant.color) }"
                      ></span>
                    </div>
                    <button
                      type="button"
                      @click="removeVariant(index)"
                      class="text-red-600 hover:text-red-700 p-1"
                      title="Remove variant"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Price Adjustment</label>
                      <div class="relative">
                        <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                        <input
                          v-model.number="variant.priceAdjustment"
                          type="number"
                          step="0.01"
                          class="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Stock</label>
                      <input
                        v-model.number="variant.stock"
                        type="number"
                        min="0"
                        class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">SKU</label>
                      <input
                        v-model="variant.sku"
                        type="text"
                        class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        :placeholder="`SKU-${index + 1}`"
                      />
                    </div>
                  </div>
                  <div class="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    Final Price: ${{ calculateVariantPrice(variant).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
              Select sizes and/or colors to generate variants
            </div>
          </div>

          <div v-else class="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            Enable variants to add size, color, or other product variations
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ formError }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            @click="router.back()"
            class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors"
            :disabled="isSubmitting || !isFormValid"
          >
            <span v-if="!isSubmitting">Save Product</span>
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
              Saving...
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

// Image upload state
const imagePreview = ref(null);
const imageUrl = ref('');
const isDragging = ref(false);
const uploadedFileName = ref('');
const uploadedFileSize = ref('');
const fileInput = ref(null);

// Variant state
const variantsEnabled = ref(false);
const selectedSizes = ref([]);
const selectedColors = ref([]);
const variants = ref([]);

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const availableColors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' }
];

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

    // Add variants if enabled
    if (variantsEnabled.value && variants.value.length > 0) {
      payload.variants = variants.value.map(v => ({
        name: v.name,
        size: v.size,
        color: v.color,
        priceAdjustment: v.priceAdjustment || 0,
        stock: v.stock || 0,
        sku: v.sku || `${formData.title.substring(0, 3).toUpperCase()}-${v.name.replace(/\s/g, '')}`
      }));
      
      // Calculate total stock from variants
      payload.stock = payload.variants.reduce((sum, v) => sum + v.stock, 0);
    }

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
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    toast.error('Image size must be less than 5MB');
    return;
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid image file (JPG, PNG, GIF, or SVG)');
    return;
  }

  uploadedFileName.value = file.name;
  uploadedFileSize.value = formatFileSize(file.size);

  // Read file and create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
    formData.thumbnail = e.target.result; // Store base64 for submission
  };
  reader.readAsDataURL(file);
};

/**
 * Format file size for display
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Handle URL input
 */
const handleUrlInput = () => {
  if (imageUrl.value && isValidUrl(imageUrl.value)) {
    imagePreview.value = imageUrl.value;
    formData.thumbnail = imageUrl.value;
    uploadedFileName.value = '';
    uploadedFileSize.value = '';
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
  uploadedFileName.value = '';
  uploadedFileSize.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

/**
 * Change image (trigger file input again)
 */
const changeImage = () => {
  removeImage();
};

/**
 * Toggle variants enabled
 */
const toggleVariantsEnabled = () => {
  variantsEnabled.value = !variantsEnabled.value;
  if (!variantsEnabled.value) {
    // Clear variant data when disabling
    selectedSizes.value = [];
    selectedColors.value = [];
    variants.value = [];
  }
};

/**
 * Generate variants based on selected sizes and colors
 */
const generateVariants = () => {
  const newVariants = [];
  
  // If both sizes and colors are selected, create combinations
  if (selectedSizes.value.length > 0 && selectedColors.value.length > 0) {
    for (const size of selectedSizes.value) {
      for (const color of selectedColors.value) {
        // Check if variant already exists to preserve user input
        const existingVariant = variants.value.find(
          v => v.size === size && v.color === color
        );
        
        if (existingVariant) {
          newVariants.push(existingVariant);
        } else {
          newVariants.push({
            name: `${size} / ${color}`,
            size: size,
            color: color,
            priceAdjustment: 0,
            stock: 0,
            sku: ''
          });
        }
      }
    }
  } 
  // If only sizes are selected
  else if (selectedSizes.value.length > 0) {
    for (const size of selectedSizes.value) {
      const existingVariant = variants.value.find(
        v => v.size === size && !v.color
      );
      
      if (existingVariant) {
        newVariants.push(existingVariant);
      } else {
        newVariants.push({
          name: size,
          size: size,
          color: null,
          priceAdjustment: 0,
          stock: 0,
          sku: ''
        });
      }
    }
  }
  // If only colors are selected
  else if (selectedColors.value.length > 0) {
    for (const color of selectedColors.value) {
      const existingVariant = variants.value.find(
        v => v.color === color && !v.size
      );
      
      if (existingVariant) {
        newVariants.push(existingVariant);
      } else {
        newVariants.push({
          name: color,
          size: null,
          color: color,
          priceAdjustment: 0,
          stock: 0,
          sku: ''
        });
      }
    }
  }
  
  variants.value = newVariants;
};

/**
 * Remove a specific variant
 */
const removeVariant = (index) => {
  variants.value.splice(index, 1);
};

/**
 * Calculate final price for a variant
 */
const calculateVariantPrice = (variant) => {
  const basePrice = formData.price || 0;
  const adjustment = variant.priceAdjustment || 0;
  return basePrice + adjustment;
};

/**
 * Get color hex value by name
 */
const getColorHex = (colorName) => {
  const color = availableColors.find(c => c.name === colorName);
  return color ? color.hex : '#CCCCCC';
};
</script>
