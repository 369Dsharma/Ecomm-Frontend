import { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import api from "../utils/api";

const Items = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState({
    minPrice: 0,
    maxPrice: 10000,
  });

  // Debounce search function
  const debounceSearch = useCallback((searchTerm) => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchTerm,
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // Handle search input change
  useEffect(() => {
    const cleanup = debounceSearch(searchInput);
    return cleanup;
  }, [searchInput, debounceSearch]);

  // Load items when filters change (excluding search input)
  useEffect(() => {
    loadItems();
  }, [filters]);

  // Load price range only once
  useEffect(() => {
    loadPriceRange();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key] !== "all") {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/items?${params}`);
      setItems(response.data.items);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPriceRange = async () => {
    try {
      const response = await api.get("/items/stats/price-range");
      setPriceRange(response.data);
    } catch (error) {
      console.error("Error loading price range:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchChange = (value) => {
    setSearchInput(value); // Update input immediately for UI responsiveness
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchInput(""); // Clear search input too
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-black">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-4">Products</h1>

        {/* Filters */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search with debounce */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
              {searchInput !== filters.search && (
                <p className="text-xs text-gray-500 mt-1">Searching...</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder={`Min: $${priceRange.minPrice}`}
                className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder={`Max: $${priceRange.maxPrice}`}
                className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-black">Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>

              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                className="px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-black">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Items;
