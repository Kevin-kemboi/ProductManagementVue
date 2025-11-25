import { ref } from 'vue';

/**
 * Composable for advanced search functionality
 * Provides debounced search, suggestions, and multi-field filtering
 */
export function useAdvancedSearch(options = {}) {
  const {
    searchFields = ['title', 'description', 'category', 'brand'],
    debounceDelay = 300,
    maxSuggestions = 5,
  } = options;

  const searchQuery = ref('');
  const searchResults = ref([]);
  const suggestions = ref([]);
  const isSearching = ref(false);
  const showSuggestions = ref(false);

  let debounceTimeout = null;

  /**
   * Debounced search function
   */
  const debouncedSearch = (callback) => {
    clearTimeout(debounceTimeout);
    isSearching.value = true;

    debounceTimeout = setTimeout(() => {
      callback();
      isSearching.value = false;
    }, debounceDelay);
  };

  /**
   * Search across multiple fields
   */
  const multiFieldSearch = (items, query) => {
    if (!query || !query.trim()) {
      return items;
    }

    const lowerQuery = query.toLowerCase().trim();
    const queryTerms = lowerQuery.split(/\s+/);

    return items.filter(item => {
      return queryTerms.every(term => {
        return searchFields.some(field => {
          const fieldValue = getNestedValue(item, field);
          if (fieldValue == null) return false;
          
          const lowerValue = String(fieldValue).toLowerCase();
          return lowerValue.includes(term);
        });
      });
    });
  };

  /**
   * Get nested object value by path (e.g., 'user.name')
   */
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  /**
   * Generate search suggestions based on query
   */
  const generateSuggestions = (items, query) => {
    if (!query || !query.trim()) {
      suggestions.value = [];
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const suggestionSet = new Set();

    items.forEach(item => {
      searchFields.forEach(field => {
        const fieldValue = getNestedValue(item, field);
        if (fieldValue) {
          const lowerValue = String(fieldValue).toLowerCase();
          
          // Add exact field matches
          if (lowerValue.includes(lowerQuery)) {
            // Add the field value if it starts with the query
            if (lowerValue.startsWith(lowerQuery)) {
              suggestionSet.add({
                text: String(fieldValue),
                field: field,
                type: 'exact',
                item: item
              });
            }
            // Add the full value if it contains the query
            else {
              suggestionSet.add({
                text: String(fieldValue),
                field: field,
                type: 'contains',
                item: item
              });
            }
          }
        }
      });
    });

    // Convert to array and sort by relevance
    suggestions.value = Array.from(suggestionSet)
      .sort((a, b) => {
        // Prioritize exact matches over contains
        if (a.type === 'exact' && b.type !== 'exact') return -1;
        if (a.type !== 'exact' && b.type === 'exact') return 1;
        // Then sort alphabetically
        return a.text.localeCompare(b.text);
      })
      .slice(0, maxSuggestions);
  };

  /**
   * Highlight matching text in a string
   */
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const queryTerms = lowerQuery.split(/\s+/);

    let highlightedText = text;

    queryTerms.forEach(term => {
      if (term.length > 0) {
        const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 font-semibold">$1</mark>');
      }
    });

    return highlightedText;
  };

  /**
   * Escape special regex characters
   */
  const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  /**
   * Calculate relevance score for search results
   */
  const calculateRelevance = (item, query) => {
    if (!query) return 0;

    const lowerQuery = query.toLowerCase().trim();
    let score = 0;

    searchFields.forEach((field, index) => {
      const fieldValue = getNestedValue(item, field);
      if (fieldValue) {
        const lowerValue = String(fieldValue).toLowerCase();
        
        // Exact match: highest score
        if (lowerValue === lowerQuery) {
          score += 100 - (index * 10);
        }
        // Starts with query: high score
        else if (lowerValue.startsWith(lowerQuery)) {
          score += 50 - (index * 5);
        }
        // Contains query: medium score
        else if (lowerValue.includes(lowerQuery)) {
          score += 20 - (index * 2);
        }
        
        // Word boundary match: bonus points
        const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(lowerQuery)}`, 'i');
        if (wordBoundaryRegex.test(lowerValue)) {
          score += 10;
        }
      }
    });

    return score;
  };

  /**
   * Sort results by relevance
   */
  const sortByRelevance = (items, query) => {
    return items
      .map(item => ({
        ...item,
        _relevanceScore: calculateRelevance(item, query)
      }))
      .sort((a, b) => b._relevanceScore - a._relevanceScore)
      .map(({ _relevanceScore, ...item }) => item);
  };

  /**
   * Clear search
   */
  const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
    suggestions.value = [];
    showSuggestions.value = false;
    clearTimeout(debounceTimeout);
  };

  /**
   * Get search statistics
   */
  const getSearchStats = (totalItems) => {
    return {
      total: totalItems,
      results: searchResults.value.length,
      hasResults: searchResults.value.length > 0,
      percentage: totalItems > 0 ? (searchResults.value.length / totalItems * 100).toFixed(1) : 0,
    };
  };

  return {
    searchQuery,
    searchResults,
    suggestions,
    isSearching,
    showSuggestions,
    debouncedSearch,
    multiFieldSearch,
    generateSuggestions,
    highlightMatch,
    calculateRelevance,
    sortByRelevance,
    clearSearch,
    getSearchStats,
  };
}
