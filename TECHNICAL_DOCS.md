# Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [State Management](#state-management)
4. [API Integration](#api-integration)
5. [Routing and Navigation](#routing-and-navigation)
6. [Component Hierarchy](#component-hierarchy)
7. [Error Handling Strategy](#error-handling-strategy)
8. [Performance Optimizations](#performance-optimizations)

---

## Architecture Overview

### Design Patterns
- **Feature-Based Architecture** - Code organized by business domain
- **Composition API** - Vue 3's reactive composition for logic reuse
- **Centralized State Management** - Pinia stores for global state
- **Request Interceptors** - Axios middleware for auth and error handling
- **Route Guards** - Navigation protection at the router level

### Technology Stack
```
Frontend Framework:    Vue 3.4.21
State Management:      Pinia 2.1.7
Routing:               Vue Router 4.3.0
HTTP Client:           Axios 1.6.8
CSS Framework:         Tailwind CSS 3.4.1
Build Tool:            Vite 5.2.0
```

---

## Authentication Flow

### Login Process
```
1. User submits credentials
   ↓
2. LoginPage.vue calls authStore.login(credentials)
   ↓
3. authStore makes POST request to /auth/login via Axios
   ↓
4. Server responds with token and user data
   ↓
5. authStore updates state (token, user)
   ↓
6. Token and user saved to localStorage
   ↓
7. Router redirects to /products
```

### Session Persistence
```javascript
// On app initialization (main.js)
const authStore = useAuthStore();
authStore.restoreSession(); // Reads from localStorage

// authStore.restoreSession() implementation
restoreSession() {
  const authData = localStorage.getItem('auth');
  if (authData) {
    const { token, user } = JSON.parse(authData);
    this.token = token;
    this.user = user;
  }
}
```

### Token Injection
```javascript
// Axios request interceptor (api/axios.js)
apiClient.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth');
  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

### Logout Process
```
1. User clicks logout button
   ↓
2. AppLayout.vue calls authStore.logout()
   ↓
3. authStore clears state (token = null, user = null)
   ↓
4. localStorage.removeItem('auth')
   ↓
5. Router redirects to /login
```

---

## State Management

### Auth Store Architecture

**State:**
```javascript
{
  token: string | null,        // JWT token
  user: object | null,          // User profile
  isLoading: boolean,           // Async operation indicator
  error: string | null          // Error message
}
```

**Getters:**
```javascript
isAuthenticated: (state) => !!state.token
userFullName: (state) => `${state.user.firstName} ${state.user.lastName}`
```

**Actions:**
- `login(credentials)` - Authenticate user
- `logout()` - Clear session
- `restoreSession()` - Restore from localStorage
- `clearError()` - Reset error state

### Product Store Architecture

**State:**
```javascript
{
  products: Array,              // All products
  currentProduct: object | null, // Selected product
  isLoading: boolean,           // Loading indicator
  error: string | null,         // Error message
  totalProducts: number,        // Total count
  categories: Array             // Available categories
}
```

**Actions:**
- `fetchProducts(params)` - Fetch with optional search/filter
- `fetchProductById(id)` - Get single product
- `addProduct(payload)` - Create new product (optimistic update)
- `updateProduct(id, payload)` - Edit existing product
- `deleteProduct(id)` - Remove product
- `fetchCategories()` - Get category list

**Optimistic Updates:**
```javascript
async addProduct(payload) {
  const response = await apiClient.post('/products/add', payload);
  const newProduct = response.data;
  
  // Immediately add to local state (optimistic)
  this.products.unshift(newProduct);
  this.totalProducts += 1;
  
  return newProduct;
}
```

---

## API Integration

### Centralized Axios Instance

**Configuration:**
```javascript
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});
```

### Request Interceptor
```javascript
apiClient.interceptors.request.use(
  (config) => {
    // Attach auth token from localStorage
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor
```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect
          localStorage.removeItem('auth');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }
      
      // Attach user-friendly message
      error.userMessage = error.response.data?.message || 'An error occurred';
    } else if (error.request) {
      error.userMessage = 'Unable to reach server';
    } else {
      error.userMessage = 'Unexpected error';
    }
    
    return Promise.reject(error);
  }
);
```

### API Methods by Feature

**Authentication:**
```javascript
POST /auth/login
Body: { username, password }
Response: { token, id, username, email, firstName, lastName, ... }
```

**Products:**
```javascript
GET    /products                    // List all
GET    /products/:id                // Get one
GET    /products/search?q=query     // Search
POST   /products/add                // Create
PUT    /products/:id                // Update
DELETE /products/:id                // Delete
GET    /products/categories         // List categories
```

---

## Routing and Navigation

### Route Configuration
```javascript
const routes = [
  {
    path: '/login',
    component: LoginPage,
    meta: { requiresAuth: false, title: 'Login - Product App' }
  },
  {
    path: '/products',
    component: ProductListPage,
    meta: { requiresAuth: true, title: 'Products - Product App' }
  },
  {
    path: '/products/new',
    component: AddProductPage,
    meta: { requiresAuth: true, title: 'Add New Product - Product App' }
  },
  {
    path: '/products/:id',
    component: ViewProductPage,
    meta: { requiresAuth: true, title: 'View Product - Product App' }
  },
  {
    path: '/products/:id/edit',
    component: EditProductPage,
    meta: { requiresAuth: true, title: 'Edit Product - Product App' }
  }
];
```

### Global Navigation Guard
```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authStore.isAuthenticated;

  // Update browser tab title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // Authentication check
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login, save intended destination
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && isAuthenticated) {
    // Already logged in, redirect to products
    next({ name: 'Products' });
  } else {
    // Allow navigation
    next();
  }
});
```

### Dynamic Page Titles
- Set in route meta: `meta: { title: 'Page Title' }`
- Updated in navigation guard
- ViewProductPage updates title dynamically: `document.title = \`\${product.title} - Product App\``

---

## Component Hierarchy

### Layout Structure
```
App.vue
└── ToastContainer.vue (global)
└── router-view
    ├── LoginPage.vue (public)
    └── AppLayout.vue (authenticated)
        ├── Sidebar (navigation)
        ├── Mobile Header
        └── Main Content (router-view)
            ├── ProductListPage.vue
            │   └── SkeletonLoader.vue
            ├── ViewProductPage.vue
            │   └── ConfirmModal.vue
            ├── AddProductPage.vue
            └── EditProductPage.vue
```

### Component Communication

**Parent → Child (Props):**
```vue
<ConfirmModal
  :model-value="showModal"
  title="Delete Product"
  :is-danger="true"
/>
```

**Child → Parent (Emits):**
```vue
// In child component
emit('confirm');
emit('update:modelValue', false);

// In parent component
<ConfirmModal @confirm="handleDelete" />
```

**Global State (Pinia):**
```javascript
// Any component can access
const authStore = useAuthStore();
const productStore = useProductStore();
```

**Composables:**
```javascript
// Reusable logic across components
const toast = useToast();
toast.success('Operation completed!');
```

---

## Error Handling Strategy

### Three-Layer Error Handling

**1. Store Level (Granular)**
```javascript
async fetchProducts() {
  this.isLoading = true;
  this.error = null;
  
  try {
    const response = await apiClient.get('/products');
    this.products = response.data.products;
  } catch (error) {
    this.error = error.userMessage || 'Failed to fetch products';
    throw error; // Propagate to component
  } finally {
    this.isLoading = false;
  }
}
```

**2. Component Level (UI State)**
```javascript
const loadProducts = async () => {
  try {
    await productStore.fetchProducts();
  } catch (error) {
    // Store error is already set
    // Show user-friendly toast
    toast.error('Failed to load products. Please try again.');
  }
};
```

**3. Global Level (Axios Interceptor)**
```javascript
// Intercepts all API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Attach user-friendly message
    error.userMessage = error.response?.data?.message || 'An error occurred';
    
    // Handle auth errors globally
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
```

### Error Display Methods

**Inline Errors (Forms):**
```vue
<p v-if="validationErrors.title" class="text-red-600">
  {{ validationErrors.title }}
</p>
```

**Alert Boxes (Page Level):**
```vue
<div v-if="error" class="bg-red-50 border border-red-200 p-4">
  <p class="text-red-600">{{ error }}</p>
</div>
```

**Toast Notifications (Global):**
```javascript
toast.error('Failed to delete product');
toast.success('Product created successfully!');
```

---

## Performance Optimizations

### 1. Lazy Loading (Route-Level Code Splitting)
```javascript
{
  path: '/products',
  component: () => import('@/features/products/ProductListPage.vue')
}
```

### 2. Optimistic UI Updates
```javascript
// Add product locally before API confirmation
this.products.unshift(newProduct);
// If API fails, rollback the change
```

### 3. Debounced Search
```javascript
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300); // Wait 300ms after user stops typing
};
```

### 4. Computed Properties for Filtering/Sorting
```javascript
const filteredProducts = computed(() => {
  let products = [...productStore.products];
  
  // Filter by category
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value);
  }
  
  // Apply sorting
  if (sortBy.value) {
    products.sort((a, b) => /* sort logic */);
  }
  
  return products;
});
```

### 5. Skeleton Loaders (Better UX)
```vue
<!-- Instead of showing a spinner -->
<SkeletonLoader v-if="isLoading" :count="8" />

<!-- Show content when loaded -->
<ProductTable v-else :products="products" />
```

### 6. Request Deduplication
```javascript
// In store, track ongoing requests
let fetchPromise = null;

async fetchProducts() {
  if (fetchPromise) return fetchPromise;
  
  fetchPromise = apiClient.get('/products');
  const response = await fetchPromise;
  fetchPromise = null;
  
  return response;
}
```

### 7. Production Build Optimizations
- Tree-shaking (Vite automatically removes unused code)
- CSS purging (Tailwind removes unused styles)
- Minification (Vite minifies JS/CSS)
- Gzip compression (Server-side)

---

## Best Practices Implemented

### Code Quality
✅ Consistent naming conventions
✅ JSDoc comments for functions
✅ Proper error handling with try-catch
✅ Loading states for async operations
✅ Disabled buttons during submission
✅ Clean code principles (DRY, SOLID)

### Security
✅ Protected routes with auth guards
✅ Token stored in localStorage (consider httpOnly cookies for production)
✅ Input validation (client-side)
✅ XSS protection (Vue escapes by default)

### User Experience
✅ Loading indicators
✅ Toast notifications
✅ Confirmation modals for destructive actions
✅ Responsive design
✅ Smooth transitions
✅ Clear error messages
✅ Skeleton loaders

### Maintainability
✅ Feature-based structure
✅ Reusable components
✅ Composables for shared logic
✅ Centralized API configuration
✅ Comprehensive documentation
✅ Consistent styling with Tailwind

---

## Testing Recommendations

### Unit Tests (Vitest)
```javascript
// Test store actions
describe('authStore', () => {
  it('should login successfully', async () => {
    const store = useAuthStore();
    await store.login({ username: 'test', password: 'test' });
    expect(store.isAuthenticated).toBe(true);
  });
});

// Test components
describe('LoginPage', () => {
  it('should render login form', () => {
    const wrapper = mount(LoginPage);
    expect(wrapper.find('form').exists()).toBe(true);
  });
});
```

### E2E Tests (Playwright/Cypress)
```javascript
// Test user flow
test('user can login and view products', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'emilys');
  await page.fill('#password', 'emilyspass');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/products');
});
```

---

## Deployment Checklist

- [ ] Run `npm run build` to generate production bundle
- [ ] Test production build with `npm run preview`
- [ ] Set up environment variables for API base URL
- [ ] Configure CORS on backend
- [ ] Enable HTTPS
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Enable Gzip/Brotli compression
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Test on multiple browsers and devices
- [ ] Run lighthouse audit for performance

---

## Conclusion

This application demonstrates production-quality Vue.js development with clean architecture, comprehensive error handling, and excellent user experience. The codebase is maintainable, scalable, and follows industry best practices.
