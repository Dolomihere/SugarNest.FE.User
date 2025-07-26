import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductCard } from "../components/ProductCard";
import CategoryService from "../services/CategoryService";
import useFetchList from "../core/hooks/useFetchList";
import { useDebouncedSearch } from "../core/hooks/useDebouncedSearch";
import FavoriteService from "../services/FavoriteService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

export function ProductPage() {
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: favoritesData,
    isLoading: favoritesLoading,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => FavoriteService.getFavorites().then((res) => res.data.data),
  });

const addFavoriteMutation = useMutation({
  mutationFn: (productId) => FavoriteService.addFavorites([productId]),
  onSuccess: () => {
    queryClient.invalidateQueries(["favorites"]); // ✅ refetch
  },
});

const removeFavoriteMutation = useMutation({
  mutationFn: (productId) => FavoriteService.removeFavorites([productId]),
  onSuccess: () => {
    queryClient.invalidateQueries(["favorites"]); // ✅ refetch
  },
});

const isFavorite = (productId) =>
  favoritesData.some((fav) => fav.productId === productId);

  const addToFavorites = (productId) => {
    addFavoriteMutation.mutate(productId);
  };

  const removeFromFavorites = (productId) => {
    removeFavoriteMutation.mutate(productId);
  };

  const { data: allCategories = [] } = useQuery({

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

    setCategories(allCategories);
  }, [allCategories]);

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

  const { inputValue, setInputValue } = useDebouncedSearch(500, (value) => {
    setProductQuery((prev) => ({
      ...prev,
      SearchTerm: value,
      PageIndex: 1,
    }));
  });

  const handleClearFilters = () => {
    setProductQuery(DEFAULT_QUERY);
    setSelectedSort("0");
    setSelectedCategory("");
    setSelectedSeason("");
    setInputValue("");
    setShowFavoritesOnly(false);
  };

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

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setProductQuery((prev) => ({
      ...prev,
      PageIndex: newPage,
    }));
  };

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

  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
    setProductQuery((prev) => ({
      ...prev,
      Filter: { ...prev.Filter, CategoryId: id },
      PageIndex: 1,
    }));
  };

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


  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-amber-50 to-amber-100 text-gray-800">
      <Header />
      <main className="w-full px-8 py-6 mx-auto max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-amber-600">

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
        <div className="flex flex-wrap justify-between gap-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 border rounded-md hover:bg-amber-100"

            >
              Bỏ lọc
            </button>
            <button
              onClick={() => setReloadTrigger((prev) => !prev)}
              className="px-4 py-2 font-medium text-white transition-all duration-300 border-2 rounded-lg shadow-sm bg-amber-500 border-amber-600 hover:bg-amber-600 hover:border-amber-700"
            >
              Lọc và sắp xếp
            </button>
            <button
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
              className={`px-3 py-2 border rounded-md hover:bg-amber-100 ${
                showFavoritesOnly
                  ? "bg-red-100 border-red-400 text-red-600"
                  : ""
              }`}
            >
              Yêu thích
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
            {(showFavoritesOnly
              ? apiResponse.data.filter((p) => isFavorite(p.productId))
              : apiResponse.data
            ).map((p) => (
              <ProductCard
                key={p.productId}
                product={p}
                viewMode={viewMode}
                isFavorite={isFavorite(p.productId)}
                onAddFavorite={() =>
                  isFavorite(p.productId)
                    ? removeFromFavorites(p.productId)
                    : addToFavorites(p.productId)
                }
              />

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
                className={`px-3 py-1 border rounded ${
                  page === currentPage
                    ? "bg-amber-600 text-white"
                    : "hover:bg-amber-100"

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

      </main>
      <Footer />
    </div>
  );
}
