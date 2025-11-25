# Product Management Vue

A modern, enterprise-grade product management application built with Vue 3, featuring advanced inventory tracking, bulk operations, and intelligent search capabilities.

![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.x-FFC107?style=for-the-badge&logo=pinia&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

### 🎯 Core Functionality
- **Complete CRUD Operations** - Create, read, update, and delete products
- **Secure Authentication** - Token-based auth with session persistence
- **Real-time Validation** - Instant form feedback and error handling
- **Responsive Design** - Mobile-first approach with adaptive layouts

### 🚀 Advanced Features

#### 📊 Smart Pagination
- Configurable items per page (5, 10, 20, 50)
- Intelligent page numbering with ellipsis
- Smooth navigation and scroll-to-top

#### ✅ Bulk Operations
- Multi-select with visual indicators
- Bulk delete with confirmation
- Select/deselect all functionality

#### 📁 CSV Export
- Export all products or filtered results
- Export current page or selected items
- Formatted data with proper escaping
- Automatic timestamped downloads

#### 🖼️ Image Upload
- Drag-and-drop interface
- Real-time preview
- Client-side validation (type & size)
- Base64 encoding for API compatibility

#### 🎛️ Advanced Filtering
- Price range slider with dual handles
- Multi-category selection
- Saveable filter presets
- Custom preset management
- LocalStorage persistence

#### 🔽 Sortable Columns
- Click-to-sort all table headers
- Ascending/descending indicators
- Visual sort state with icons
- Maintains filter state

#### 🎨 Product Variants
- Size and color variations
- Individual stock tracking per variant
- Variant-specific pricing
- Dynamic variant management

#### 📝 Activity Log
- Complete audit trail for all operations
- User action timestamps
- Product change history
- Filterable activity feed
- Export logs to CSV

#### 🔔 Stock Alerts
- Real-time stock monitoring
- Browser push notifications
- 4-tier severity system:
  - 🔴 Out of Stock (0 units)
  - 🟠 Critical (≤ 5 units)
  - 🟡 Reorder Point (≤ 10 units)
  - 🟢 Low Stock (≤ 20 units)
- Configurable thresholds
- Notification center with badge
- Reorder cost estimation

#### 🔍 Enhanced Search
- Debounced search (300ms delay)
- Multi-field searching (title, description, category, brand, SKU)
- Smart suggestions dropdown (up to 8)
- Search term highlighting with yellow background
- Relevance-based ranking algorithm
- Real-time search statistics
- Loading state indicators

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Vue 3 (Composition API) |
| **State Management** | Pinia |
| **Routing** | Vue Router |
| **Styling** | Tailwind CSS |
| **HTTP Client** | Axios |
| **Build Tool** | Vite |
| **API** | DummyJSON API |

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Kevin-kemboi/ProductManagementVue.git
cd ProductManagementVue

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Demo Credentials

```
Username: emilys
Password: emilyspass
```

## 📁 Project Structure

```
PRODUCTVUE/
├── src/
│   ├── api/                      # API configuration
│   │   └── axios.js              # Axios instance with interceptors
│   ├── components/               # Shared components
│   │   ├── AppLayout.vue         # Main layout with sidebar
│   │   ├── ConfirmModal.vue      # Reusable confirmation modal
│   │   ├── NotificationBell.vue  # Notification center
│   │   ├── SkeletonLoader.vue    # Loading skeletons
│   │   └── ToastContainer.vue    # Toast notifications
│   ├── composables/              # Vue composables
│   │   ├── useAdvancedSearch.js  # Search logic with debouncing
│   │   └── useToast.js           # Toast notifications
│   ├── features/                 # Feature modules
│   │   ├── activity/             # Activity log
│   │   ├── alerts/               # Stock alerts
│   │   ├── auth/                 # Authentication
│   │   ├── customers/            # Customer management
│   │   ├── dashboard/            # Analytics dashboard
│   │   ├── orders/               # Order processing
│   │   ├── products/             # Product management
│   │   └── settings/             # Application settings
│   ├── router/                   # Vue Router
│   │   └── index.js              # Routes with guards
│   ├── stores/                   # Pinia stores
│   │   ├── activityStore.js      # Activity logging
│   │   ├── authStore.js          # Authentication
│   │   ├── notificationStore.js  # Notifications
│   │   └── productStore.js       # Products CRUD
│   ├── App.vue                   # Root component
│   └── main.js                   # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Key Features Breakdown

### 1. Smart Pagination
- **Items per page selector**: 5, 10, 20, 50 options
- **Page navigation**: Previous, Next, and direct page buttons
- **Smart numbering**: Shows ellipsis for large page counts
- **Scroll behavior**: Auto-scroll to top on page change

### 2. Bulk Operations
- **Multi-select**: Checkbox for each product row
- **Select all**: Toggle all products on current page
- **Visual feedback**: Blue highlight for selected items
- **Bulk actions**: Delete multiple products at once
- **Confirmation**: Safe deletion with modal confirmation

### 3. CSV Export Options
- **Export all**: All filtered products
- **Export page**: Current page only
- **Export selected**: Only checked products
- **Format**: Properly escaped CSV with headers
- **Download**: Auto-download with timestamp

### 4. Image Upload
- **Drag & drop**: Intuitive file upload
- **Click to upload**: Alternative upload method
- **Preview**: Real-time image preview
- **Validation**: File type and size checks
- **Encoding**: Base64 for API compatibility

### 5. Advanced Filters
- **Price range**: Dual-handle slider (0-5000)
- **Categories**: Multi-select checkboxes
- **Presets**: Save custom filter combinations
- **Management**: Edit and delete presets
- **Persistence**: LocalStorage for saved filters
- **Badge**: Active filter count indicator

### 6. Sortable Headers
- **Click to sort**: All columns sortable
- **Toggle order**: ASC → DESC → Default
- **Visual indicators**: Arrow icons show direction
- **State preservation**: Maintains filters while sorting

### 7. Product Variants
- **Multiple variations**: Size and color options
- **Stock per variant**: Individual inventory tracking
- **Pricing**: Variant-specific prices
- **Management**: Add/edit/delete variants
- **Display**: Grid layout with stock status

### 8. Activity Log
- **Action tracking**: All CRUD operations logged
- **Timestamps**: Precise time of each action
- **User info**: Who performed the action
- **Details**: What changed and previous values
- **Export**: Download activity history as CSV
- **Filter**: Search through activity records

### 9. Stock Alerts
- **Monitoring**: Real-time stock level tracking
- **Notifications**: Browser push notifications
- **Severity levels**: Out, Critical, Reorder, Low
- **Thresholds**: Customizable alert limits
- **Dashboard**: Dedicated alerts page
- **Badge**: Unread alert count
- **Estimates**: Reorder cost calculations

### 10. Enhanced Search
- **Debouncing**: 300ms delay to optimize performance
- **Multi-field**: Searches across 5 fields simultaneously
- **Suggestions**: Up to 8 smart suggestions
- **Highlighting**: Yellow background for matches
- **Ranking**: Relevance-based result ordering
- **Statistics**: "Found X products matching..." banner
- **Loading**: Spinner during search

## 🔒 Security Features

- JWT token-based authentication
- Protected routes with navigation guards
- Automatic token injection via Axios interceptors
- Session persistence with localStorage
- Auto-logout on token expiration
- Client-side input validation

## ⚡ Performance Optimizations

- **Debounced search**: Reduces API calls
- **Computed properties**: Efficient filtering and sorting
- **LocalStorage caching**: Persists user preferences
- **Optimistic UI updates**: Instant feedback
- **Code splitting**: Lazy-loaded routes
- **Vite**: Lightning-fast builds and HMR

## 🎨 UI/UX Highlights

- **Toast notifications**: Non-intrusive feedback
- **Confirmation modals**: Prevent accidental deletions
- **Skeleton loaders**: Better perceived performance
- **Loading states**: Visual feedback during async ops
- **Responsive design**: Mobile, tablet, desktop
- **Keyboard navigation**: Accessibility support
- **Color-coded status**: Visual stock indicators

## 🧪 Testing

The application has been manually tested across:
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android phones)

## 📝 API Integration

### Base URL
```
https://dummyjson.com
```

### Endpoints Used
- `POST /auth/login` - User authentication
- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch single product
- `POST /products/add` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /products/categories` - Fetch categories

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com) - Free fake REST API
- [Vue.js](https://vuejs.org) - The Progressive JavaScript Framework
- [Pinia](https://pinia.vuejs.org) - The Vue Store that you will enjoy using
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [Vite](https://vitejs.dev) - Next Generation Frontend Tooling

---

**Built with ❤️ by Kevin Kemboi**

[Live Demo](#) | [Report Bug](https://github.com/Kevin-kemboi/ProductManagementVue/issues) | [Request Feature](https://github.com/Kevin-kemboi/ProductManagementVue/issues)
