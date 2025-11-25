# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Login Credentials
- **Username:** `emilys`
- **Password:** `emilyspass`

## 📂 Key Files

### Configuration
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS with custom primary color (#000080)
- `postcss.config.js` - PostCSS configuration

### Core Application
- `src/main.js` - Application entry point
- `src/App.vue` - Root component
- `src/router/index.js` - Vue Router with navigation guards

### State Management
- `src/stores/authStore.js` - Authentication state
- `src/stores/productStore.js` - Product CRUD operations

### API Integration
- `src/api/axios.js` - Centralized Axios instance with interceptors

### Features
- `src/features/auth/LoginPage.vue` - Login page
- `src/features/products/ProductListPage.vue` - Product listing with search/filter/sort
- `src/features/products/ViewProductPage.vue` - Product details with delete/edit
- `src/features/products/AddProductPage.vue` - Create new product
- `src/features/products/EditProductPage.vue` - Update product

### Shared Components
- `src/components/AppLayout.vue` - Main layout with sidebar
- `src/components/ToastContainer.vue` - Toast notifications
- `src/components/ConfirmModal.vue` - Confirmation dialogs
- `src/components/SkeletonLoader.vue` - Loading skeletons

### Composables
- `src/composables/useToast.js` - Toast notification logic

## 🎯 Key Features

✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Authentication with token persistence
✅ Protected routes with navigation guards
✅ Real-time search and filtering
✅ Product sorting (price, stock, title)
✅ Form validation with instant feedback
✅ Optimistic UI updates
✅ Toast notifications
✅ Confirmation modals
✅ Skeleton loading states
✅ Responsive design with mobile menu
✅ Dynamic page titles
✅ Image galleries

## 🏗️ Architecture Highlights

### Axios Interceptors
- Automatically attaches auth token to all requests
- Global error handling
- User-friendly error messages

### Feature-Based Structure
- Organized by features, not file types
- Easy to scale and maintain
- Clear separation of concerns

### State Management
- Pinia stores for auth and products
- Granular error states
- Session persistence with localStorage

## 📦 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🎨 Custom Tailwind Classes

```css
.btn-primary      /* Navy blue (#000080) button */
.btn-secondary    /* Gray button */
.btn-danger       /* Red button for destructive actions */
.input-field      /* Standard input styling */
.card             /* White card with shadow */
```

## 🔐 API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch single product
- `GET /products/search?q=query` - Search products
- `POST /products/add` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /products/categories` - Fetch categories

Base URL: `https://dummyjson.com`

## 🎓 Code Quality Features

1. **Clean Code** - Consistent naming, proper comments
2. **Error Handling** - Try-catch blocks, user-friendly messages
3. **Loading States** - Skeleton loaders, disabled buttons
4. **Validation** - Client-side form validation
5. **Responsive** - Mobile-first design
6. **Accessibility** - ARIA labels, semantic HTML
7. **Performance** - Lazy loading, optimistic updates
8. **Security** - Protected routes, token management
9. **UX Polish** - Smooth transitions, toast notifications
10. **Documentation** - Comprehensive README, code comments
