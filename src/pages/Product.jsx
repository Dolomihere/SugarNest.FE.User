import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "../components/ProductCard";
import CategoryService from "../services/CategoryService";
import useFetchList from "../core/hooks/useFetchList";
import { useDebouncedSearch } from "../core/hooks/useDebouncedSearch";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

export function ProductPage() {
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState(() => {
    try {
      const favs = localStorage.getItem("favoriteProducts");
      return favs ? JSON.parse(favs) : [];
    } catch {
      return [];
    }
  });

  // Categories
  const {
    data: allCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await CategoryService.getAllCategories();
        console.log("Category API response:", res); // Debug raw response
        if (!res.data?.data) {
          console.warn("Unexpected category response structure:", res);
          return [];
        }
        return res.data.data.map((cat) => ({
          value: cat.categoryId,
          label: cat.name,
        }));
      } catch (err) {
        console.error("Category API error:", err.message, err.response?.data);
        throw err; // Let useQuery handle the error
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    console.log("allCategories:", allCategories); // Debug transformed data
    setCategories(allCategories);
  }, [allCategories]);

  // Query state
  const DEFAULT_QUERY = {
    SearchTerm: "",
    SortBy: "CreatedAt",
    SortDescending: true,
    Filter: { CategoryId: "", Season: "" },
    PageSize: 16,
    PageIndex: 1,
  };

  const [selectedSort, setSelectedSort] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [productQuery, setProductQuery] = useState(DEFAULT_QUERY);
  const [reloadTrigger, setReloadTrigger] = useState(false);

  // Debounced search
  const { inputValue, setInputValue } = useDebouncedSearch(500, (value) => {
    setProductQuery((prev) => ({
      ...prev,
      SearchTerm: value,
      PageIndex: 1,
    }));
  });

  // Clear filters
  const handleClearFilters = () => {
    setProductQuery(DEFAULT_QUERY);
    setSelectedSort("0");
    setSelectedCategory("");
    setSelectedSeason("");
    setInputValue("");
  };

  // Fetch products
  const { response: apiResponse, loading, error } = useFetchList(
    "products/sellable",
    productQuery,
    { reloadTrigger }
  );

  const meta = apiResponse?.meta ?? {};
  const totalPages = Math.ceil((meta.totalCount ?? 0) / (meta.pageSize ?? 16));
  const currentPage = productQuery.PageIndex;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setProductQuery((prev) => ({
      ...prev,
      PageIndex: newPage,
    }));
  };

  // Sort change
  const sortOptions = [
    { value: "0", label: "Ngày tạo (mới - cũ)" },
    { value: "1", label: "Ngày tạo (cũ - mới)" },
    { value: "2", label: "Tên (a - z)" },
    { value: "3", label: "Tên (z - a)" },
    { value: "4", label: "Giá (thấp - cao)" },
    { value: "5", label: "Giá (cao - thấp)" },
  ];

  const handleSortChange = (value) => {
    setSelectedSort(value);
    let sortBy = "CreatedAt";
    let sortDescending = true;
    switch (value) {
      case "1":
        sortDescending = false;
        break;
      case "2":
        sortBy = "Name";
        sortDescending = false;
        break;
      case "3":
        sortBy = "Name";
        sortDescending = true;
        break;
      case "4":
        sortBy = "UnitPrice";
        sortDescending = false;
        break;
      case "5":
        sortBy = "UnitPrice";
        sortDescending = true;
        break;
      default:
        break;
    }
    setProductQuery((prev) => ({
      ...prev,
      SortBy: sortBy,
      SortDescending: sortDescending,
      PageIndex: 1,
    }));
  };

  // Category filter
  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
    setProductQuery((prev) => ({
      ...prev,
      Filter: { ...prev.Filter, CategoryId: id },
      PageIndex: 1,
    }));
  };

  // Season filter
  const seasonOptions = [
    { value: "", label: "Tất cả mùa" },
    { value: "Spring", label: "Xuân" },
    { value: "Summer", label: "Hè" },
    { value: "Fall", label: "Thu" },
    { value: "Winter", label: "Đông" },
  ];

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    setProductQuery((prev) => ({
      ...prev,
      Filter: { ...prev.Filter, Season: season },
      PageIndex: 1,
    }));
  };

  // Fetch seasonal products
  const fetchSeasonalProducts = (season) =>
    useFetchList("products/sellable", {
      ...DEFAULT_QUERY,
      Filter: { ...DEFAULT_QUERY.Filter, Season: season },
      PageSize: 16,
    }).then((res) => res.response);

  const springQuery = useQuery({
    queryKey: ["products", "seasonal", "Spring", reloadTrigger],
    queryFn: () => fetchSeasonalProducts("Spring"),
    staleTime: 5 * 60 * 1000,
  });

  const summerQuery = useQuery({
    queryKey: ["products", "seasonal", "Summer", reloadTrigger],
    queryFn: () => fetchSeasonalProducts("Summer"),
    staleTime: 5 * 60 * 1000,
  });

  const fallQuery = useQuery({
    queryKey: ["products", "seasonal", "Fall", reloadTrigger],
    queryFn: () => fetchSeasonalProducts("Fall"),
    staleTime: 5 * 60 * 1000,
  });

  const winterQuery = useQuery({
    queryKey: ["products", "seasonal", "Winter", reloadTrigger],
    queryFn: () => fetchSeasonalProducts("Winter"),
    staleTime: 5 * 60 * 1000,
  });

  // Seasonal products
  const seasonalProducts = useMemo(() => {
    return [
      {
        season: { value: "Spring", label: "Xuân" },
        products: springQuery.data?.data?.slice(0, 4) || [],
        loading: springQuery.isLoading,
        error: springQuery.error,
      },
      {
        season: { value: "Summer", label: "Hè" },
        products: summerQuery.data?.data?.slice(0, 4) || [],
        loading: summerQuery.isLoading,
        error: summerQuery.error,
      },
      {
        season: { value: "Fall", label: "Thu" },
        products: fallQuery.data?.data?.slice(0, 4) || [],
        loading: fallQuery.isLoading,
        error: fallQuery.error,
      },
      {
        season: { value: "Winter", label: "Đông" },
        products: winterQuery.data?.data?.slice(0, 4) || [],
        loading: winterQuery.isLoading,
        error: winterQuery.error,
      },
    ];
  }, [springQuery.data, summerQuery.data, fallQuery.data, winterQuery.data]);

  // Favorites
  const addToFavorites = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.productId === product.productId);
      if (exists) return prev;
      const updated = [...prev, product];
      try {
        localStorage.setItem("favoriteProducts", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
      return updated;
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => {
      const updated = prev.filter((p) => p.productId !== productId);
      try {
        localStorage.setItem("favoriteProducts", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-amber-50 to-amber-100 text-gray-800">
      <Header />
      <main className="w-full px-4 py-8 mx-auto max-w-7xl md:px-8">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-amber-700 drop-shadow-md md:text-4xl">
          Sản Phẩm Của Chúng Tôi
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="p-3 transition-all duration-300 bg-white border-2 rounded-lg shadow-sm border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <select
            className="p-3 transition-all duration-300 bg-white border-2 rounded-lg shadow-sm border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={categoriesLoading || categoriesError}
          >
            <option value="">Tất cả danh mục</option>
            {categoriesLoading ? (
              <option disabled>Đang tải danh mục...</option>
            ) : categoriesError || categories.length === 0 ? (
              <option disabled>Không có danh mục</option>
            ) : (
              categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))
            )}
          </select>
          <select
            className="p-3 transition-all duration-300 bg-white border-2 rounded-lg shadow-sm border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(e.target.value)}
          >
            {seasonOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="p-3 transition-all duration-300 bg-white border-2 rounded-lg shadow-sm border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <div className="flex gap-3">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 font-medium transition-all duration-300 bg-white border-2 rounded-lg shadow-sm border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-amber-700"
            >
              Bỏ lọc
            </button>
            <button
              onClick={() => setReloadTrigger((prev) => !prev)}
              className="px-4 py-2 font-medium text-white transition-all duration-300 border-2 rounded-lg shadow-sm bg-amber-500 border-amber-600 hover:bg-amber-600 hover:border-amber-700"
            >
              Lọc và sắp xếp
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 border-2 rounded-lg shadow-sm transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-amber-500 border-amber-600 text-white"
                  : "bg-white border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
              }`}
            >
              Dạng lưới
            </button>
            <button
              onClick={() => setViewMode("blog")}
              className={`px-4 py-2 border-2 rounded-lg shadow-sm transition-all duration-300 ${
                viewMode === "blog"
                  ? "bg-amber-500 border-amber-600 text-white"
                  : "bg-white border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
              }`}
            >
              Dạng blog
            </button>
          </div>
        </div>

        {/* Product List */}
        {loading ? (
          <p className="text-center text-amber-600">Đang tải sản phẩm...</p>
        ) : error ? (
          <p className="text-center text-red-500">Lỗi: {error.message}</p>
        ) : apiResponse?.data?.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10"
                : "flex flex-col gap-6 mb-10"
            }
          >
            {apiResponse.data.map((p) => (
              <div key={p.productId} className="relative group">
                <ProductCard
                  product={p}
                  viewMode={viewMode}
                  isFavorite={favorites.some((fav) => fav.productId === p.productId)}
                  onAddFavorite={() =>
                    favorites.some((fav) => fav.productId === p.productId)
                      ? removeFromFavorites(p.productId)
                      : addToFavorites(p)
                  }
                  className="transition-transform duration-300 transform group-hover:scale-105 group-hover:shadow-lg group-hover:border-amber-400"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-amber-600">Không có sản phẩm nào.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mb-10">
            <button
              disabled={isFirstPage}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 transition-all duration-300 bg-white border-2 rounded-lg shadow-sm border-amber-300 disabled:opacity-50 hover:bg-amber-50 hover:border-amber-400 text-amber-700"
            >
              ← Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border-2 rounded-lg shadow-sm transition-all duration-300 ${
                  page === currentPage
                    ? "bg-amber-600 border-amber-700 text-white"
                    : "bg-white border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={isLastPage}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 transition-all duration-300 bg-white border-2 rounded-lg shadow-sm border-amber-300 disabled:opacity-50 hover:bg-amber-50 hover:border-amber-400 text-amber-700"
            >
              Tiếp →
            </button>
          </div>
        )}

        {/* Seasonal Products */}
      </main>
      <Footer />
    </div>
  );
}
