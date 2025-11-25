import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      title: 'Login - Product App',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/features/dashboard/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard - Product App',
    },
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/features/products/ProductListPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Products - Product App',
    },
  },
  {
    path: '/products/new',
    name: 'AddProduct',
    component: () => import('@/features/products/AddProductPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Add New Product - Product App',
    },
  },
  {
    path: '/products/:id/edit',
    name: 'EditProduct',
    component: () => import('@/features/products/EditProductPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Edit Product - Product App',
    },
  },
  {
    path: '/products/:id',
    name: 'ViewProduct',
    component: () => import('@/features/products/ViewProductPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'View Product - Product App',
    },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/features/orders/OrdersPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Orders - Product App',
    },
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('@/features/customers/CustomersPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Customers - Product App',
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/features/settings/SettingsPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Settings - Product App',
    },
  },
  {
    path: '/activity',
    name: 'ActivityLog',
    component: () => import('@/features/activity/ActivityLogPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Activity Log - Product App',
    },
  },
  {
    path: '/alerts',
    name: 'StockAlerts',
    component: () => import('@/features/alerts/StockAlertsPage.vue'),
    meta: {
      requiresAuth: true,
      title: 'Stock Alerts - Product App',
    },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Global Navigation Guard
 * Handles authentication checks and redirects
 */
router.beforeEach((to, from, next) => {
  // Import authStore inside the guard to ensure Pinia is initialized
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authStore.isAuthenticated;

  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // Check if the route requires authentication
  if (requiresAuth && !isAuthenticated) {
    // Redirect unauthenticated users to login
    next({
      name: 'Login',
      query: { redirect: to.fullPath }, // Save the intended destination
    });
  } else if (to.name === 'Login' && isAuthenticated) {
    // Redirect authenticated users away from login page
    next({ name: 'Products' });
  } else {
    // Proceed to the route
    next();
  }
});

export default router;
