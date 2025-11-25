# Product Management App

A production-quality, full-stack Product Management application built with Vue 3, Pinia, and Tailwind CSS. This application demonstrates enterprise-level architecture, clean code practices, and a polished user experience.

![Vue 3](https://img.shields.io/badge/Vue.js-3.x-brightgreen)
![Pinia](https://img.shields.io/badge/Pinia-2.x-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue)
![Axios](https://img.shields.io/badge/Axios-1.x-purple)

## 🚀 Features

### Core Functionality
- ✅ **User Authentication** - Secure login with token-based authentication
- ✅ **Product Listing** - View all products with advanced filtering and sorting
- ✅ **Product Details** - Comprehensive product view with image gallery
- ✅ **Create Product** - Add new products with real-time validation
- ✅ **Update Product** - Edit existing product details
- ✅ **Delete Product** - Remove products with confirmation modal
- ✅ **Search & Filter** - Real-time search and category filtering
- ✅ **Sorting** - Sort by price, stock, and title

### Advanced Features
- 🔐 **Protected Routes** - Navigation guards for authentication
- 🎨 **Responsive Design** - Mobile-first approach with collapsible sidebar
- 📱 **Dynamic Page Titles** - Browser tab titles update based on current page
- ⚡ **Optimistic UI Updates** - Instant feedback on user actions
- 🎯 **Real-time Validation** - Client-side form validation with immediate feedback
- 🔔 **Toast Notifications** - Global notification system for user feedback
- ⏳ **Skeleton Loaders** - Elegant loading states instead of spinners
- 🖼️ **Image Galleries** - Multiple product images with thumbnail navigation
- 💾 **Session Persistence** - Automatic session restoration on page reload
- 🎭 **Confirmation Modals** - Safe deletion with user confirmation

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technical Decisions and Justifications](#technical-decisions-and-justifications)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [State Management](#state-management)
- [Routing](#routing)
- [Components](#components)
- [Styling](#styling)

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd PRODUCTVUE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 🎯 Usage

### Demo Credentials
Use these credentials to log in:
- **Username:** `emilys`
- **Password:** `emilyspass`

### Main Features

#### 1. Login
- Navigate to the login page
- Enter the demo credentials
- Click "Login" to access the application

#### 2. View Products
- Browse the product list with search, filter, and sort capabilities
- Click on any product row to view detailed information

#### 3. Add New Product
- Click "Add New Product" button in the header
- Fill in the required fields (Title, Price, Stock)
- Optionally add description, category, brand, and thumbnail URL
- Click "Create Product" to save

#### 4. Edit Product
- Navigate to a product's detail page
- Click "Edit Product" button
- Update the desired fields
- Click "Update Product" to save changes

#### 5. Delete Product
- Navigate to a product's detail page
- Click "Delete Product" button
- Confirm deletion in the modal
- Product will be removed from the list

## 📁 Project Structure

This project uses a **feature-based structure** rather than a type-based structure for better scalability and maintainability:

```
PRODUCTVUE/
├── src/
│   ├── api/                    # API configuration
│   │   └── axios.js            # Centralized Axios instance with interceptors
│   ├── assets/                 # Static assets
│   │   └── main.css            # Global styles and Tailwind directives
│   ├── components/             # Shared/global components
│   │   ├── AppLayout.vue       # Main application layout with sidebar
│   │   ├── ConfirmModal.vue    # Reusable confirmation modal
│   │   ├── SkeletonLoader.vue  # Loading skeleton component
│   │   └── ToastContainer.vue  # Toast notification container
│   ├── composables/            # Vue composables (reusable logic)
│   │   └── useToast.js         # Toast notification composable
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Authentication feature
│   │   │   └── LoginPage.vue   # Login page component
│   │   └── products/           # Products feature
│   │       ├── ProductListPage.vue   # Product listing page
│   │       ├── ViewProductPage.vue   # Product detail page
│   │       ├── AddProductPage.vue    # Add product page
│   │       └── EditProductPage.vue   # Edit product page
│   ├── router/                 # Vue Router configuration
│   │   └── index.js            # Routes and navigation guards
│   ├── stores/                 # Pinia stores
│   │   ├── authStore.js        # Authentication state management
│   │   └── productStore.js     # Product state management
│   ├── App.vue                 # Root component
│   └── main.js                 # Application entry point
├── index.html                  # HTML entry point
├── package.json                # Project dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.js              # Vite build configuration
└── README.md                   # This file
```

## 🏗️ Technical Decisions and Justifications

### 1. Axios Interceptors for Centralized Authentication

**Decision:** Implemented a centralized Axios instance with request and response interceptors.

**Justification:**
- **DRY Principle:** Eliminates the need to manually attach authentication tokens to every API request
- **Separation of Concerns:** Authentication logic is separated from business logic
- **Global Error Handling:** Response interceptors provide a single point for handling API errors, token expiration, and unauthorized access
- **Maintainability:** Changes to authentication mechanism only need to be made in one place
- **Security:** Ensures all API requests are consistently authenticated

**Implementation:** (`src/api/axios.js`)
```javascript
// Request interceptor automatically attaches token from localStorage
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

// Response interceptor handles errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401, 403, 404, 500, etc.
    // Attach user-friendly error messages
    return Promise.reject(error);
  }
);
```

### 2. Feature-Based Project Structure

**Decision:** Organized code by features (`src/features/`) rather than by file type.

**Justification:**
- **Scalability:** Easy to add new features without affecting existing code
- **Discoverability:** All code related to a feature is in one place
- **Team Collaboration:** Multiple developers can work on different features with minimal conflicts
- **Domain-Driven Design:** Aligns with business domains and user stories
- **Code Splitting:** Enables easier lazy loading and code splitting in production

**Example:**
```
features/
├── auth/
│   └── LoginPage.vue
└── products/
    ├── ProductListPage.vue
    ├── ViewProductPage.vue
    ├── AddProductPage.vue
    └── EditProductPage.vue
```

### 3. Full CRUD Implementation

**Decision:** Implemented complete Create, Read, Update, and Delete operations.

**Justification:**
- **Real-World Completeness:** Production applications require all CRUD operations
- **User Control:** Users can fully manage their data lifecycle
- **State Management Practice:** Demonstrates proper state synchronization across operations
- **Best Practices:** Shows proper handling of optimistic updates, error states, and user feedback
- **Professional Quality:** Goes beyond basic requirements to show engineering excellence

**Implementation Highlights:**
- **Create:** Optimistic UI update with toast notification
- **Read:** Efficient caching and lazy loading
- **Update:** Form pre-population with validation
- **Delete:** Confirmation modal with loading state

### 4. Granular Error Handling with Toast Notifications

**Decision:** Implemented a global toast notification system with error states in Pinia stores.

**Justification:**
- **User Experience:** Provides immediate, non-intrusive feedback
- **Consistency:** Unified notification style across the application
- **Accessibility:** Visual feedback that doesn't block user interaction
- **Error Granularity:** Store-level errors for component access, global toasts for user feedback
- **Type Safety:** Supports success, error, warning, and info message types

**Implementation:** (`src/composables/useToast.js` and `src/components/ToastContainer.vue`)

### 5. Pinia for State Management

**Decision:** Used Pinia instead of Vuex for state management.

**Justification:**
- **Vue 3 Native:** Official state management library for Vue 3
- **TypeScript Support:** Better type inference and autocompletion
- **Simplified API:** No mutations, just actions and state
- **Modular Design:** Each store is independent and tree-shakable
- **Developer Experience:** Cleaner syntax with Composition API integration

### 6. Tailwind CSS Utility-First Approach

**Decision:** Used Tailwind CSS with custom primary color configuration.

**Justification:**
- **Rapid Development:** Build UIs faster with pre-defined utility classes
- **Consistency:** Design system built into the framework
- **Customization:** Easy theming with custom color variables
- **Performance:** PurgeCSS removes unused styles in production
- **Responsive Design:** Mobile-first utilities out of the box

**Configuration:** (`tailwind.config.js`)
```javascript
theme: {
  extend: {
    colors: {
      primary: '#000080', // Custom navy blue
    },
  },
}
```

### 7. Vue Router with Navigation Guards

**Decision:** Implemented global navigation guards for route protection.

**Justification:**
- **Security:** Prevents unauthorized access to protected routes
- **User Experience:** Automatic redirection for unauthenticated users
- **Clean Separation:** Authentication logic separated from component code
- **Redirect Handling:** Saves intended destination for post-login redirect
- **Dynamic Titles:** Updates browser tab title based on route

### 8. Composables for Reusable Logic

**Decision:** Extracted reusable logic into composables (e.g., `useToast`).

**Justification:**
- **Reusability:** Share logic across multiple components
- **Testability:** Easier to unit test isolated functions
- **Composition API:** Leverages Vue 3's Composition API strengths
- **Separation of Concerns:** UI logic separated from business logic

## 🔌 API Integration

This application integrates with [DummyJSON](https://dummyjson.com/), a free fake REST API for testing and prototyping.

### Endpoints Used

#### Authentication
- **POST** `/auth/login` - User login

#### Products
- **GET** `/products` - Fetch all products
- **GET** `/products/:id` - Fetch single product
- **GET** `/products/search?q=query` - Search products
- **POST** `/products/add` - Create new product
- **PUT** `/products/:id` - Update product
- **DELETE** `/products/:id` - Delete product

#### Categories
- **GET** `/products/categories` - Fetch all categories

## 🔐 Authentication

### Flow
1. User enters credentials on login page
2. `authStore.login()` sends POST request to `/auth/login`
3. On success, token and user data are stored in:
   - Pinia state
   - localStorage (for persistence)
4. Axios interceptor automatically attaches token to all subsequent requests
5. Navigation guard checks authentication status on route changes
6. On logout, token is cleared from state and localStorage

### Session Persistence
- `authStore.restoreSession()` is called on app initialization
- Restores authentication state from localStorage if valid token exists
- User remains logged in across browser refreshes

## 🗄️ State Management

### Auth Store (`src/stores/authStore.js`)

**State:**
- `token`: JWT authentication token
- `user`: User object with profile information
- `isLoading`: Loading state for async operations
- `error`: Error message for failed operations

**Getters:**
- `isAuthenticated`: Returns true if user has valid token
- `userFullName`: Returns user's full name

**Actions:**
- `login(credentials)`: Authenticate user
- `logout()`: Clear auth data and redirect
- `restoreSession()`: Restore from localStorage
- `clearError()`: Clear error state

### Product Store (`src/stores/productStore.js`)

**State:**
- `products`: Array of product objects
- `currentProduct`: Currently viewed product
- `isLoading`: Loading state
- `error`: Error message
- `totalProducts`: Total count for pagination
- `categories`: Available product categories

**Getters:**
- `getProductById(id)`: Find product by ID
- `uniqueCategories`: List of unique categories
- `hasProducts`: Check if products are loaded

**Actions:**
- `fetchProducts(params)`: Fetch products with optional search/filter
- `fetchProductById(id)`: Fetch single product
- `addProduct(payload)`: Create new product
- `updateProduct(id, payload)`: Update existing product
- `deleteProduct(id)`: Delete product
- `fetchCategories()`: Fetch category list

## 🛣️ Routing

### Routes

| Path | Component | Auth Required | Title |
|------|-----------|---------------|-------|
| `/login` | LoginPage | No | Login - Product App |
| `/products` | ProductListPage | Yes | Products - Product App |
| `/products/new` | AddProductPage | Yes | Add New Product - Product App |
| `/products/:id` | ViewProductPage | Yes | [Product Title] - Product App |
| `/products/:id/edit` | EditProductPage | Yes | Edit Product - Product App |
| `/` | Redirect to `/products` | - | - |

### Navigation Guards

**Global Before Guard:**
```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authStore.isAuthenticated;

  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // Check authentication
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Products' });
  } else {
    next();
  }
});
```

## 🧩 Components

### Global Components

#### AppLayout.vue
- Main application layout with sidebar navigation
- Responsive design with mobile menu toggle
- User profile section
- Logout functionality

#### ConfirmModal.vue
- Reusable confirmation dialog
- Customizable title, message, and button text
- Danger variant for destructive actions
- Loading state support

#### SkeletonLoader.vue
- Animated loading placeholder
- Configurable item count
- Better UX than spinners

#### ToastContainer.vue
- Global toast notification display
- Auto-dismiss with configurable duration
- Multiple toast types (success, error, warning, info)
- Smooth enter/leave animations

### Feature Components

All feature components are located in `src/features/` and are lazy-loaded for better performance.

## 🎨 Styling

### Tailwind CSS Configuration

**Custom Primary Color:** `#000080` (Navy Blue)

**Custom Utility Classes:**
```css
.btn-primary       /* Primary button style */
.btn-secondary     /* Secondary button style */
.btn-danger        /* Danger/destructive button style */
.input-field       /* Standard input field style */
.card              /* Card container style */
```

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar on mobile devices
- Responsive grid layouts

## 🚀 Build and Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📝 License

This project is for educational and demonstration purposes.

## 👨‍💻 Author

Built with ❤️ as a technical assessment demonstrating production-quality Vue.js development.

---

## 🎓 Key Learnings Demonstrated

1. ✅ Vue 3 Composition API with `<script setup>`
2. ✅ Pinia state management with actions and getters
3. ✅ Vue Router with navigation guards
4. ✅ Axios interceptors for authentication
5. ✅ Feature-based project architecture
6. ✅ Responsive design with Tailwind CSS
7. ✅ Form validation and error handling
8. ✅ Optimistic UI updates
9. ✅ Toast notification system
10. ✅ Reusable components and composables
11. ✅ Session persistence with localStorage
12. ✅ Dynamic page titles
13. ✅ Skeleton loading states
14. ✅ Confirmation modals
15. ✅ Full CRUD operations

## 🔄 Future Enhancements

- [ ] Pagination for product list
- [ ] Advanced filtering (price range, ratings)
- [ ] Product image upload
- [ ] User profile management
- [ ] Dark mode support
- [ ] Unit and E2E tests
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) features
#   P r o d u c t M a n a g e m e n t V u e  
 