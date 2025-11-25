import { defineStore } from 'pinia';
import apiClient from '@/api/axios';
import { useActivityStore } from './activityStore';
import { useNotificationStore } from './notificationStore';

/**
 * Product Store
 * Manages product data, CRUD operations, and product-related state
 */
export const useProductStore = defineStore('product', {
  /**
   * State
   */
  state: () => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    totalProducts: 0,
    categories: [],
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Get product by ID from the current products array
     * @returns {Function}
     */
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === parseInt(id));
    },

    /**
     * Get unique categories from products
     * @returns {Array<string>}
     */
    uniqueCategories: (state) => {
      const categories = state.products.map(p => p.category);
      return [...new Set(categories)].sort();
    },

    /**
     * Check if products are loaded
     * @returns {boolean}
     */
    hasProducts: (state) => state.products.length > 0,
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Fetch all products with optional query parameters
     * @param {Object} params - Query parameters
     * @param {number} params.limit - Limit number of products
     * @param {number} params.skip - Skip number of products
     * @param {string} params.search - Search query
     * @returns {Promise<void>}
     */
    async fetchProducts(params = {}) {
      this.isLoading = true;
      this.error = null;

      try {
        const { limit = 100, skip = 0, search = '' } = params;
        
        let endpoint = '/products';
        
        // If search query exists, use search endpoint
        if (search) {
          endpoint = `/products/search?q=${encodeURIComponent(search)}`;
        } else {
          endpoint = `/products?limit=${limit}&skip=${skip}`;
        }

        const response = await apiClient.get(endpoint);
        
        this.products = response.data.products || [];
        this.totalProducts = response.data.total || 0;

        // Check stock levels after loading products
        const notificationStore = useNotificationStore();
        notificationStore.checkStockLevels();

        return response.data;
      } catch (error) {
        this.error = error.userMessage || 'Failed to fetch products.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch a single product by ID
     * @param {number|string} id - Product ID
     * @returns {Promise<Object>}
     */
    async fetchProductById(id) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiClient.get(`/products/${id}`);
        
        this.currentProduct = response.data;

        // Update the product in the products array if it exists
        const index = this.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
          this.products[index] = response.data;
        }

        return response.data;
      } catch (error) {
        this.error = error.userMessage || 'Failed to fetch product details.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Add a new product
     * @param {Object} payload - Product data
     * @returns {Promise<Object>}
     */
    async addProduct(payload) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiClient.post('/products/add', payload);
        
        const newProduct = response.data;

        // Optimistic UI Update: Add to the beginning of the products array
        this.products.unshift(newProduct);
        this.totalProducts += 1;

        // Log activity
        const activityStore = useActivityStore();
        activityStore.logActivity({
          action: 'created',
          productId: newProduct.id,
          productTitle: newProduct.title,
          changes: {
            price: newProduct.price,
            stock: newProduct.stock,
            category: newProduct.category,
          }
        });

        // Check stock levels
        const notificationStore = useNotificationStore();
        notificationStore.checkStockLevels();

        return newProduct;
      } catch (error) {
        this.error = error.userMessage || 'Failed to add product.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update an existing product
     * @param {number|string} id - Product ID
     * @param {Object} payload - Updated product data
     * @returns {Promise<Object>}
     */
    async updateProduct(id, payload) {
      this.isLoading = true;
      this.error = null;

      try {
        // Get old product data for change tracking
        const oldProduct = this.getProductById(id);
        
        const response = await apiClient.put(`/products/${id}`, payload);
        
        const updatedProduct = response.data;

        // Update the product in the products array
        const index = this.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        // Update current product if it's the one being edited
        if (this.currentProduct && this.currentProduct.id === parseInt(id)) {
          this.currentProduct = updatedProduct;
        }

        // Log activity with changes
        const activityStore = useActivityStore();
        const changes = {};
        
        if (oldProduct) {
          if (oldProduct.title !== updatedProduct.title) changes.title = { from: oldProduct.title, to: updatedProduct.title };
          if (oldProduct.price !== updatedProduct.price) changes.price = { from: oldProduct.price, to: updatedProduct.price };
          if (oldProduct.stock !== updatedProduct.stock) changes.stock = { from: oldProduct.stock, to: updatedProduct.stock };
          if (oldProduct.category !== updatedProduct.category) changes.category = { from: oldProduct.category, to: updatedProduct.category };
        }

        activityStore.logActivity({
          action: 'updated',
          productId: updatedProduct.id,
          productTitle: updatedProduct.title,
          changes: Object.keys(changes).length > 0 ? changes : null
        });

        // Check stock levels
        const notificationStore = useNotificationStore();
        notificationStore.checkStockLevels();

        return updatedProduct;
      } catch (error) {
        this.error = error.userMessage || 'Failed to update product.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete a product
     * @param {number|string} id - Product ID
     * @returns {Promise<void>}
     */
    async deleteProduct(id) {
      this.isLoading = true;
      this.error = null;

      try {
        // Get product data before deletion
        const product = this.getProductById(id);
        
        await apiClient.delete(`/products/${id}`);

        // Remove the product from the products array
        this.products = this.products.filter(p => p.id !== parseInt(id));
        this.totalProducts -= 1;

        // Clear current product if it's the one being deleted
        if (this.currentProduct && this.currentProduct.id === parseInt(id)) {
          this.currentProduct = null;
        }

        // Log activity
        const activityStore = useActivityStore();
        activityStore.logActivity({
          action: 'deleted',
          productId: id,
          productTitle: product?.title || 'Unknown Product',
          changes: {
            deletedAt: new Date().toISOString(),
            price: product?.price,
            stock: product?.stock
          }
        });
      } catch (error) {
        this.error = error.userMessage || 'Failed to delete product.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch all product categories
     * @returns {Promise<Array>}
     */
    async fetchCategories() {
      try {
        const response = await apiClient.get('/products/categories');
        console.log('Categories response:', response.data);
        
        // Handle different response formats
        let categoryList = response.data;
        
        // If response is an array of objects, extract the slug or name
        if (Array.isArray(categoryList) && categoryList.length > 0 && typeof categoryList[0] === 'object') {
          categoryList = categoryList.map(cat => cat.slug || cat.name || cat);
        }
        
        this.categories = categoryList;
        return categoryList;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
      }
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null;
    },

    /**
     * Clear current product
     */
    clearCurrentProduct() {
      this.currentProduct = null;
    },
  },
});
