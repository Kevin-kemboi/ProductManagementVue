<template>
  <AppLayout>
    <div class="p-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Products</h1>
            <p class="text-gray-500 text-sm mt-1">Manage your inventory and view product performance.</p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Export Dropdown -->
            <div class="relative" ref="exportDropdownRef">
              <button
                @click="toggleExportDropdown"
                class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg inline-flex items-center text-sm font-medium transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div
                v-if="showExportDropdown"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <div class="py-1">
                  <button
                    @click="exportToCSV('all')"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <div class="font-medium">Export All Products</div>
                      <div class="text-xs text-gray-500">{{ filteredProducts.length }} items</div>
                    </div>
                  </button>
                  <button
                    @click="exportToCSV('page')"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div class="font-medium">Export Current Page</div>
                      <div class="text-xs text-gray-500">{{ paginatedProducts.length }} items</div>
                    </div>
                  </button>
                  <button
                    v-if="selectedProducts.length > 0"
                    @click="exportToCSV('selected')"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div class="font-medium">Export Selected</div>
                      <div class="text-xs text-gray-500">{{ selectedProducts.length }} items</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            <router-link to="/products/new" class="bg-primary hover:bg-blue-900 text-white px-4 py-2.5 rounded-lg inline-flex items-center text-sm font-medium transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </router-link>
        </div>
      </div>
      </div>

      <!-- Bulk Actions Toolbar -->
      <div v-if="selectedProducts.length > 0" class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span class="text-sm font-medium text-gray-900">{{ selectedProducts.length }} product{{ selectedProducts.length > 1 ? 's' : '' }} selected</span>
        </div>
        <div class="flex items-center gap-2">
          <button @click="bulkDeleteProducts" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected
          </button>
          <button @click="clearSelection" class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
            Clear Selection
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 space-y-4">
        <!-- Search Bar -->
        <div class="flex items-center gap-3">
          <div class="flex-1 relative" ref="searchInputRef">
            <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products by name, category, brand, or description..."
              class="w-full pl-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              :class="{ 'pr-20': searchQuery && isSearching, 'pr-10': searchQuery && !isSearching, 'pr-4': !searchQuery }"
              @input="handleSearchInput"
              @focus="showSuggestions = true"
            />
            
            <!-- Loading indicator -->
            <div v-if="isSearching" class="absolute right-10 top-1/2 -translate-y-1/2">
              <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <!-- Clear button -->
            <button
              v-if="searchQuery"
              @click="handleClearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- Search Suggestions Dropdown -->
            <div
              v-if="showSuggestions && suggestions.length > 0 && searchQuery"
              class="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
            >
              <div class="p-2">
                <div class="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Suggestions</div>
                <button
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  @click="applySuggestion(suggestion)"
                  class="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-900" v-html="highlightMatch(suggestion.text, searchQuery)"></div>
                      <div class="text-xs text-gray-500 mt-0.5 capitalize">{{ suggestion.field }}</div>
                    </div>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div><!-- End search input container -->
          
          <button
            @click="showAdvancedFilters = !showAdvancedFilters"
            class="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg inline-flex items-center text-sm font-medium transition-colors"
            :class="{ 'bg-blue-50 border-blue-500 text-blue-700': hasActiveFilters }"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Advanced Filters
            <span v-if="activeFilterCount > 0" class="ml-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {{ activeFilterCount }}
            </span>
          </button>

          <!-- Stock Status Filter -->
          <select
            v-model="stockFilter"
            @change="applyFilters"
            class="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-w-[140px]"
          >
            <option value="">Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <!-- Search Statistics -->
        <div v-if="searchQuery && filteredProducts.length > 0" class="flex items-center gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Found <span class="font-semibold text-gray-900">{{ filteredProducts.length }}</span> product{{ filteredProducts.length !== 1 ? 's' : '' }} matching "<span class="font-medium">{{ searchQuery }}</span>"</span>
        </div>

        <!-- Advanced Filters Panel -->
        <div v-if="showAdvancedFilters" class="bg-white border border-gray-200 rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Price Range Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
              <div class="space-y-4">
                <div class="px-2">
                  <input
                    type="range"
                    v-model.number="priceRange.min"
                    :min="0"
                    :max="priceRange.max"
                    step="10"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    @input="applyFilters"
                  />
                  <input
                    type="range"
                    v-model.number="priceRange.max"
                    :min="priceRange.min"
                    :max="5000"
                    step="10"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-1"
                    @input="applyFilters"
                  />
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <label class="block text-xs text-gray-500 mb-1">Min Price</label>
                    <input
                      type="number"
                      v-model.number="priceRange.min"
                      min="0"
                      :max="priceRange.max"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      @input="applyFilters"
                    />
                  </div>
                  <span class="text-gray-400 mt-5">—</span>
                  <div class="flex-1">
                    <label class="block text-xs text-gray-500 mb-1">Max Price</label>
                    <input
                      type="number"
                      v-model.number="priceRange.max"
                      :min="priceRange.min"
                      max="5000"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      @input="applyFilters"
                    />
                  </div>
                </div>
                <div class="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  ${{ priceRange.min }} - ${{ priceRange.max }}
                </div>
              </div>
            </div>

            <!-- Multi-Select Categories -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Categories</label>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
                <label
                  v-for="category in categories"
                  :key="category"
                  class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    :value="category"
                    v-model="selectedCategories"
                    @change="applyFilters"
                    class="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                  <span class="text-sm text-gray-700">{{ formatCategory(category) }}</span>
                  <span class="ml-auto text-xs text-gray-500">
                    ({{ getCategoryCount(category) }})
                  </span>
                </label>
                <div v-if="categories.length === 0" class="text-sm text-gray-500 text-center py-4">
                  No categories available
                </div>
              </div>
            </div>

            <!-- Filter Presets -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Filter Presets</label>
              <div class="space-y-2">
                <button
                  v-for="preset in filterPresets"
                  :key="preset.id"
                  @click="applyPreset(preset)"
                  class="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-900">{{ preset.name }}</div>
                      <div class="text-xs text-gray-500 mt-0.5">{{ preset.description }}</div>
                    </div>
                    <button
                      @click.stop="deletePreset(preset.id)"
                      class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                      title="Delete preset"
                    >
                      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </button>
                <button
                  @click="saveCurrentFiltersAsPreset"
                  :disabled="!hasActiveFilters"
                  class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 text-sm text-gray-600 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
                >
                  <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Save Current Filters
                </button>
              </div>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              @click="resetFilters"
              class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
            >
              Reset All Filters
            </button>
            <div class="text-sm text-gray-600">
              Showing <span class="font-semibold">{{ filteredProducts.length }}</span> of <span class="font-semibold">{{ productStore.products.length }}</span> products
            </div>
          </div>
        </div>
      </div><!-- End Search and Filters section -->

      <!-- Loading State -->
      <SkeletonLoader v-if="productStore.isLoading && !productStore.hasProducts" :count="8" />

      <!-- Error State -->
      <div v-else-if="productStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ productStore.error }}</p>
        <button @click="loadProducts" class="btn-primary mt-3">Retry</button>
      </div>

      <!-- Products Table -->
      <div v-else-if="filteredProducts.length > 0" class="bg-white rounded-lg border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" class="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  @click="sortByColumn('title')"
                >
                  <div class="flex items-center gap-2">
                    <span>Product</span>
                    <div class="flex flex-col">
                      <svg 
                        class="w-3 h-3 transition-colors" 
                        :class="sortConfig.field === 'title' && sortConfig.order === 'asc' ? 'text-primary' : 'text-gray-400'"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  @click="sortByColumn('category')"
                >
                  <div class="flex items-center gap-2">
                    <span>Category</span>
                    <div class="flex flex-col">
                      <svg 
                        class="w-3 h-3 transition-colors" 
                        :class="sortConfig.field === 'category' && sortConfig.order === 'asc' ? 'text-primary' : 'text-gray-400'"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  @click="sortByColumn('price')"
                >
                  <div class="flex items-center gap-2">
                    <span>Price</span>
                    <div class="flex flex-col">
                      <svg 
                        class="w-3 h-3 -mb-1 transition-colors" 
                        :class="sortConfig.field === 'price' && sortConfig.order === 'asc' ? 'text-primary' : 'text-gray-400'"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg 
                        class="w-3 h-3 transition-colors" 
                        :class="sortConfig.field === 'price' && sortConfig.order === 'desc' ? 'text-primary' : 'text-gray-400'"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  @click="sortByColumn('stock')"
                >
                  <div class="flex items-center gap-2">
                    <span>Stock</span>
                    <div class="flex flex-col">
                      <svg 
                        class="w-3 h-3 -mb-1 transition-colors" 
                        :class="sortConfig.field === 'stock' && sortConfig.order === 'asc' ? 'text-primary' : 'text-gray-400'"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg 
                        class="w-3 h-3 transition-colors" 
                        :class="sortConfig.field === 'stock' && sortConfig.order === 'desc' ? 'text-primary' : 'text-gray-400'"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50': isSelected(product.id) }"
              >
                <td class="px-6 py-4 w-12" @click.stop>
                  <input
                    type="checkbox"
                    :checked="isSelected(product.id)"
                    @change="toggleSelection(product.id)"
                    class="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                </td>
                <td class="px-6 py-4 cursor-pointer" @click="viewProduct(product.id)">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        :src="product.thumbnail"
                        :alt="product.title"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div 
                        class="text-sm font-medium text-gray-900 truncate"
                        v-if="searchQuery"
                        v-html="highlightMatch(product.title, searchQuery)"
                      ></div>
                      <div 
                        v-else
                        class="text-sm font-medium text-gray-900 truncate"
                      >{{ product.title }}</div>
                      <div 
                        class="text-xs text-gray-500 truncate"
                        v-if="searchQuery && product.description"
                        v-html="highlightMatch(truncateText(product.description, 50), searchQuery)"
                      ></div>
                      <div 
                        v-else
                        class="text-xs text-gray-500 truncate"
                      >{{ truncateText(product.description, 50) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="viewProduct(product.id)">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                    :class="getCategoryClass(product.category)"
                  >
                    <span 
                      v-if="searchQuery"
                      v-html="highlightMatch(formatCategory(product.category), searchQuery)"
                    ></span>
                    <span v-else>{{ formatCategory(product.category) }}</span>
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium cursor-pointer" @click="viewProduct(product.id)">
                  ${{ product.price.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="viewProduct(product.id)">
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'w-2 h-2 rounded-full',
                        product.stock > 20 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
                      ]"
                    ></span>
                    <span class="text-sm" :class="[
                      product.stock > 20 ? 'text-gray-900' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                    ]">
                      {{ product.stock > 20 ? `${product.stock} In Stock` : product.stock > 0 ? `${product.stock} Low Stock` : 'Out of Stock' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    @click.stop="openMenu(product.id)"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <p class="text-sm text-gray-600">
              Showing <span class="font-medium">{{ startIndex }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ filteredProducts.length }}</span> results
            </p>
            <select
              v-model="itemsPerPage"
              @change="changeItemsPerPage"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option :value="5">5 per page</option>
              <option :value="10">10 per page</option>
              <option :value="20">20 per page</option>
              <option :value="50">50 per page</option>
            </select>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Previous Button -->
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :class="{ 'cursor-not-allowed': currentPage === 1 }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Page Numbers -->
            <template v-if="totalPages <= 7">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                class="px-3 py-1.5 border rounded-lg text-sm transition-colors"
                :class="[
                  currentPage === page
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </template>
            <template v-else>
              <button
                @click="goToPage(1)"
                class="px-3 py-1.5 border rounded-lg text-sm transition-colors"
                :class="[
                  currentPage === 1
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
              >
                1
              </button>
              
              <span v-if="currentPage > 3" class="px-2 text-gray-500">...</span>
              
              <button
                v-for="page in [currentPage - 1, currentPage, currentPage + 1].filter(p => p > 1 && p < totalPages)"
                :key="page"
                @click="goToPage(page)"
                class="px-3 py-1.5 border rounded-lg text-sm transition-colors"
                :class="[
                  currentPage === page
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <span v-if="currentPage < totalPages - 2" class="px-2 text-gray-500">...</span>
              
              <button
                @click="goToPage(totalPages)"
                class="px-3 py-1.5 border rounded-lg text-sm transition-colors"
                :class="[
                  currentPage === totalPages
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ totalPages }}
              </button>
            </template>

            <!-- Next Button -->
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :class="{ 'cursor-not-allowed': currentPage === totalPages }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useToast } from '@/composables/useToast';
import { useAdvancedSearch } from '@/composables/useAdvancedSearch';
import AppLayout from '@/components/AppLayout.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';

const router = useRouter();
const productStore = useProductStore();
const toast = useToast();

// Advanced search composable
const {
  searchQuery,
  suggestions,
  isSearching,
  showSuggestions,
  debouncedSearch: performDebouncedSearch,
  multiFieldSearch,
  generateSuggestions,
  highlightMatch,
  sortByRelevance,
  clearSearch: clearAdvancedSearch,
  getSearchStats,
} = useAdvancedSearch({
  searchFields: ['title', 'description', 'category', 'brand', 'sku'],
  debounceDelay: 300,
  maxSuggestions: 8,
});

// Filter and search state
const selectedCategory = ref('');
const selectedCategories = ref([]);
const stockFilter = ref('');
const sortBy = ref('');
const categories = ref([]);
const showAdvancedFilters = ref(false);
const searchInputRef = ref(null);

// Sort configuration
const sortConfig = ref({
  field: '',
  order: 'asc' // 'asc' or 'desc'
});

// Price range filter
const priceRange = ref({
  min: 0,
  max: 5000
});

// Filter presets
const filterPresets = ref([
  {
    id: 1,
    name: 'Premium Products',
    description: 'High-value items over $500',
    filters: {
      priceRange: { min: 500, max: 5000 },
      categories: [],
      stockFilter: 'in-stock'
    }
  },
  {
    id: 2,
    name: 'Budget Friendly',
    description: 'Affordable items under $100',
    filters: {
      priceRange: { min: 0, max: 100 },
      categories: [],
      stockFilter: ''
    }
  },
  {
    id: 3,
    name: 'Low Stock Alert',
    description: 'Items that need restocking',
    filters: {
      priceRange: { min: 0, max: 5000 },
      categories: [],
      stockFilter: 'low-stock'
    }
  }
]);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Bulk selection state
const selectedProducts = ref([]);

// Export dropdown state
const showExportDropdown = ref(false);
const exportDropdownRef = ref(null);

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
 * Handle search input with debouncing and suggestions
 */
const handleSearchInput = () => {
  performDebouncedSearch(() => {
    generateSuggestions(productStore.products, searchQuery.value);
    currentPage.value = 1; // Reset to first page when searching
  });
};

/**
 * Apply a suggestion
 */
const applySuggestion = (suggestion) => {
  searchQuery.value = suggestion.text;
  showSuggestions.value = false;
  currentPage.value = 1;
};

/**
 * Clear search
 */
const handleClearSearch = () => {
  clearAdvancedSearch();
  currentPage.value = 1;
};

/**
 * Apply filters
 */
const applyFilters = () => {
  currentPage.value = 1;
};

/**
 * Reset all filters
 */
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedCategories.value = [];
  stockFilter.value = '';
  sortBy.value = '';
  sortConfig.value = { field: '', order: 'asc' };
  priceRange.value = { min: 0, max: 5000 };
  loadProducts();
};

/**
 * Check if there are active filters
 */
const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 || 
         priceRange.value.min > 0 || 
         priceRange.value.max < 5000 ||
         stockFilter.value !== '';
});

/**
 * Count active filters
 */
const activeFilterCount = computed(() => {
  let count = 0;
  if (selectedCategories.value.length > 0) count++;
  if (priceRange.value.min > 0 || priceRange.value.max < 5000) count++;
  if (stockFilter.value) count++;
  return count;
});

/**
 * Get product count for a category
 */
const getCategoryCount = (category) => {
  return productStore.products.filter(p => p.category === category).length;
};

/**
 * Apply a saved filter preset
 */
const applyPreset = (preset) => {
  priceRange.value = { ...preset.filters.priceRange };
  selectedCategories.value = [...preset.filters.categories];
  stockFilter.value = preset.filters.stockFilter;
  applyFilters();
  toast.success(`Applied preset: ${preset.name}`);
};

/**
 * Save current filters as a preset
 */
const saveCurrentFiltersAsPreset = () => {
  const presetName = prompt('Enter a name for this filter preset:');
  if (!presetName) return;

  const newPreset = {
    id: Date.now(),
    name: presetName,
    description: `Custom preset created on ${new Date().toLocaleDateString()}`,
    filters: {
      priceRange: { ...priceRange.value },
      categories: [...selectedCategories.value],
      stockFilter: stockFilter.value
    }
  };

  filterPresets.value.push(newPreset);
  localStorage.setItem('filterPresets', JSON.stringify(filterPresets.value));
  toast.success('Filter preset saved successfully!');
};

/**
 * Delete a filter preset
 */
const deletePreset = (presetId) => {
  if (!confirm('Are you sure you want to delete this preset?')) return;
  
  filterPresets.value = filterPresets.value.filter(p => p.id !== presetId);
  localStorage.setItem('filterPresets', JSON.stringify(filterPresets.value));
  toast.success('Preset deleted successfully');
};

/**
 * Filtered and sorted products with advanced search
 */
const filteredProducts = computed(() => {
  let products = [...productStore.products];

  // Apply multi-field search with relevance sorting
  if (searchQuery.value) {
    products = multiFieldSearch(products, searchQuery.value);
    products = sortByRelevance(products, searchQuery.value);
  }

  // Filter by category (legacy single select)
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value);
  }

  // Filter by multi-select categories
  if (selectedCategories.value.length > 0) {
    products = products.filter(p => selectedCategories.value.includes(p.category));
  }

  // Filter by price range
  products = products.filter(p => {
    const price = p.price || 0;
    return price >= priceRange.value.min && price <= priceRange.value.max;
  });

  // Filter by stock status
  if (stockFilter.value) {
    if (stockFilter.value === 'in-stock') {
      products = products.filter(p => p.stock > 20);
    } else if (stockFilter.value === 'low-stock') {
      products = products.filter(p => p.stock > 0 && p.stock <= 20);
    } else if (stockFilter.value === 'out-of-stock') {
      products = products.filter(p => p.stock === 0);
    }
  }

  // Apply sorting
  if (sortConfig.value.field) {
    const field = sortConfig.value.field;
    const order = sortConfig.value.order;
    
    products.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      // Handle string comparisons (case-insensitive)
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      // Handle null/undefined values
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Compare values
      let comparison = 0;
      if (aVal > bVal) {
        comparison = 1;
      } else if (aVal < bVal) {
        comparison = -1;
      }

      // Apply sort order
      return order === 'asc' ? comparison : -comparison;
    });
  }

  return products;
});

/**
 * Total number of pages
 */
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

/**
 * Paginated products for current page
 */
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

/**
 * Start index for current page
 */
const startIndex = computed(() => {
  if (filteredProducts.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

/**
 * End index for current page
 */
const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, filteredProducts.value.length);
});

/**
 * Go to specific page
 */
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * Go to previous page
 */
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * Go to next page
 */
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * Change items per page
 */
const changeItemsPerPage = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
};

/**
 * Sort products by column
 */
const sortByColumn = (field) => {
  // If clicking the same column, toggle the order
  if (sortConfig.value.field === field) {
    if (sortConfig.value.order === 'asc') {
      sortConfig.value.order = 'desc';
    } else {
      // If already descending, remove sort
      sortConfig.value.field = '';
      sortConfig.value.order = 'asc';
    }
  } else {
    // New column, default to ascending
    sortConfig.value.field = field;
    sortConfig.value.order = 'asc';
  }
  
  currentPage.value = 1; // Reset to first page when sorting
};

/**
 * Apply sorting
 */
const applySorting = () => {
  // Sorting is reactive via computed property
  currentPage.value = 1; // Reset to first page when sorting
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

/**
 * Get category badge color class
 */
const getCategoryClass = (category) => {
  const categoryLower = (category || '').toLowerCase();
  
  if (categoryLower.includes('electronic') || categoryLower.includes('tech')) {
    return 'bg-blue-100 text-blue-700';
  } else if (categoryLower.includes('grocer') || categoryLower.includes('food')) {
    return 'bg-purple-100 text-purple-700';
  } else if (categoryLower.includes('apparel') || categoryLower.includes('clothing')) {
    return 'bg-pink-100 text-pink-700';
  } else {
    return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Open product menu
 */
const openMenu = (productId) => {
  viewProduct(productId);
};

/**
 * Check if all products on current page are selected
 */
const isAllSelected = computed(() => {
  if (paginatedProducts.value.length === 0) return false;
  return paginatedProducts.value.every(p => selectedProducts.value.includes(p.id));
});

/**
 * Check if a product is selected
 */
const isSelected = (productId) => {
  return selectedProducts.value.includes(productId);
};

/**
 * Toggle selection of a single product
 */
const toggleSelection = (productId) => {
  const index = selectedProducts.value.indexOf(productId);
  if (index > -1) {
    selectedProducts.value.splice(index, 1);
  } else {
    selectedProducts.value.push(productId);
  }
};

/**
 * Toggle select all products on current page
 */
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Deselect all on current page
    const currentPageIds = paginatedProducts.value.map(p => p.id);
    selectedProducts.value = selectedProducts.value.filter(id => !currentPageIds.includes(id));
  } else {
    // Select all on current page
    const currentPageIds = paginatedProducts.value.map(p => p.id);
    const newSelections = currentPageIds.filter(id => !selectedProducts.value.includes(id));
    selectedProducts.value.push(...newSelections);
  }
};

/**
 * Clear all selections
 */
const clearSelection = () => {
  selectedProducts.value = [];
};

/**
 * Bulk delete selected products
 */
const bulkDeleteProducts = async () => {
  if (selectedProducts.value.length === 0) return;

  const confirmed = confirm(
    `Are you sure you want to delete ${selectedProducts.value.length} product${selectedProducts.value.length > 1 ? 's' : ''}? This action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    // Delete each selected product
    const deletePromises = selectedProducts.value.map(id => 
      productStore.deleteProduct(id)
    );
    
    await Promise.all(deletePromises);
    
    toast.success(`Successfully deleted ${selectedProducts.value.length} product${selectedProducts.value.length > 1 ? 's' : ''}`);
    selectedProducts.value = [];
    
    // Reload products
    await loadProducts();
  } catch (error) {
    toast.error('Failed to delete some products. Please try again.');
  }
};

/**
 * Toggle export dropdown
 */
const toggleExportDropdown = () => {
  showExportDropdown.value = !showExportDropdown.value;
};

/**
 * Convert products to CSV format
 */
const convertToCSV = (products) => {
  if (products.length === 0) return '';

  // Define headers
  const headers = ['ID', 'Title', 'Description', 'Price', 'Category', 'Brand', 'Stock', 'Rating', 'Discount %'];
  
  // Create CSV rows
  const rows = products.map(product => [
    product.id,
    `"${(product.title || '').replace(/"/g, '""')}"`,
    `"${(product.description || '').replace(/"/g, '""')}"`,
    product.price || 0,
    `"${formatCategory(product.category)}"`,
    `"${product.brand || 'N/A'}"`,
    product.stock || 0,
    product.rating || 0,
    product.discountPercentage || 0
  ]);

  // Combine headers and rows
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

/**
 * Download CSV file
 */
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export products to CSV
 */
const exportToCSV = (type) => {
  let productsToExport = [];
  let filename = '';

  switch (type) {
    case 'all':
      productsToExport = filteredProducts.value;
      filename = `products_all_${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'page':
      productsToExport = paginatedProducts.value;
      filename = `products_page${currentPage.value}_${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'selected':
      productsToExport = filteredProducts.value.filter(p => selectedProducts.value.includes(p.id));
      filename = `products_selected_${new Date().toISOString().split('T')[0]}.csv`;
      break;
  }

  if (productsToExport.length === 0) {
    toast.error('No products to export');
    return;
  }

  const csvContent = convertToCSV(productsToExport);
  downloadCSV(csvContent, filename);
  
  showExportDropdown.value = false;
  toast.success(`Exported ${productsToExport.length} product${productsToExport.length > 1 ? 's' : ''} to ${filename}`);
};

/**
 * Close export dropdown when clicking outside
 */
onMounted(async () => {
  await loadProducts();
  await loadCategories();
  
  // Load saved filter presets from localStorage
  const savedPresets = localStorage.getItem('filterPresets');
  if (savedPresets) {
    try {
      const parsed = JSON.parse(savedPresets);
      // Merge with default presets, keeping custom ones
      const customPresets = parsed.filter(p => p.id > 10);
      if (customPresets.length > 0) {
        filterPresets.value = [...filterPresets.value, ...customPresets];
      }
    } catch (error) {
      console.error('Failed to load filter presets:', error);
    }
  }
  
  // Close dropdown on outside click
  const handleClickOutside = (event) => {
    if (exportDropdownRef.value && !exportDropdownRef.value.contains(event.target)) {
      showExportDropdown.value = false;
    }
    // Close search suggestions when clicking outside
    if (searchInputRef.value && !searchInputRef.value.contains(event.target)) {
      showSuggestions.value = false;
    }
  };
  
  document.addEventListener('click', handleClickOutside);
  
  // Cleanup
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});

// Watch for search query changes to generate suggestions
watch(searchQuery, (newValue) => {
  if (newValue) {
    generateSuggestions(productStore.products, newValue);
  } else {
    suggestions.value = [];
  }
});
</script>
