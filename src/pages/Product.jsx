import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "../components/ProductCard";
import CategoryService from "../services/CategoryService";
import useFetchList from "../core/hooks/useFetchList";
import { useDebouncedSearch } from "../core/hooks/useDebouncedSearch";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import ChatPage from '../pages/ChatPage';

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
  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      CategoryService.getAllCategories().then((res) =>
        res.data.data.map((cat) => ({
          value: cat.categoryId,
          label: cat.name,
        }))
      ),
  });

  useEffect(() => {
    if (!allCategories) return;
    setCategories(
      allCategories.map((cat) => ({
        value: cat.categoryId,
        label: cat.name,
      }))
    );
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
  const totalPages = Math.ceil((meta.totalCount ?? 0) / (meta.pageSize ?? 12));
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

  // Fetch seasonal products using useQuery
  const springQuery = useQuery({
    queryKey: ["products", "seasonal", "Spring", reloadTrigger],
    queryFn: () =>
      useFetchList("products/sellable", {
        ...DEFAULT_QUERY,
        Filter: { ...DEFAULT_QUERY.Filter, Season: "Spring" },
        PageSize: 16,
      }).then((res) => res.response),
  });

  const summerQuery = useQuery({
    queryKey: ["products", "seasonal", "Summer", reloadTrigger],
    queryFn: () =>
      useFetchList("products/sellable", {
        ...DEFAULT_QUERY,
        Filter: { ...DEFAULT_QUERY.Filter, Season: "Summer" },
        PageSize: 16,
      }).then((res) => res.response),
  });

  const fallQuery = useQuery({
    queryKey: ["products", "seasonal", "Fall", reloadTrigger],
    queryFn: () =>
      useFetchList("products/sellable", {
        ...DEFAULT_QUERY,
        Filter: { ...DEFAULT_QUERY.Filter, Season: "Fall" },
        PageSize: 16,
      }).then((res) => res.response),
  });

  const winterQuery = useQuery({
    queryKey: ["products", "seasonal", "Winter", reloadTrigger],
    queryFn: () =>
      useFetchList("products/sellable", {
        ...DEFAULT_QUERY,
        Filter: { ...DEFAULT_QUERY.Filter, Season: "Winter" },
        PageSize: 16,
      }).then((res) => res.response),
  });

  // Tạo seasonalProducts cố định
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
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-[#fffaf3] text-gray-700">
      <Header />
      <main className="w-full px-8 py-6 mx-auto max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-amber-600">Sản Phẩm Của Chúng Tôi</h2>

        {/* Filters */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="col-span-12 p-2 border rounded lg:col-span-3"
          />
          <select
            className="col-span-12 p-2 border rounded lg:col-span-3"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            className="col-span-12 p-2 border rounded lg:col-span-3"
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
            className="col-span-12 p-2 border rounded lg:col-span-3"
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
            <button onClick={handleClearFilters} className="px-3 py-2 border rounded-md hover:bg-amber-100">
              Bỏ lọc
            </button>
            <button
              onClick={() => setReloadTrigger((prev) => !prev)}
              className="px-3 py-2 border rounded-md hover:bg-amber-100"
            >
              Lọc và sắp xếp
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 border rounded-md hover:bg-amber-100 ${
                viewMode === "grid" ? "bg-amber-200" : ""
              }`}
            >
              Dạng lưới
            </button>
            <button
              onClick={() => setViewMode("blog")}
              className={`px-3 py-2 border rounded-md hover:bg-amber-100 ${
                viewMode === "blog" ? "bg-amber-200" : ""
              }`}
            >
              Dạng blog
            </button>
          </div>
        </div>

        {/* Product List */}
        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : error ? (
          <p className="text-red-500">Lỗi: {error.message}</p>
        ) : apiResponse?.data?.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8"
                : "flex flex-col gap-6 mb-8"
            }
          >
            {apiResponse.data.map((p) => (
              <ProductCard
                key={p.productId}
                product={p}
                viewMode={viewMode}
                isFavorite={favorites.some((fav) => fav.productId === p.productId)}
                onAddFavorite={() =>
                  favorites.some((fav) => fav.productId === p.productId)
                    ? removeFromFavorites(p.productId)
                    : addToFavorites(p)
                }
              />
            ))}
          </div>
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-10">
            <button
              disabled={isFirstPage}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ← Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage ? "bg-amber-600 text-white" : "hover:bg-amber-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={isLastPage}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Tiếp →
            </button>
          </div>
        )}

        {/* Favorite Products */}
        <section>
          <h3 className="mb-4 text-2xl font-semibold text-amber-600">❤️ Sản phẩm yêu thích</h3>
          {favorites.length === 0 ? (
            <p>Bạn chưa có sản phẩm yêu thích nào.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {favorites.map((p) => (
                <div key={p.productId} className="relative">
                  <ProductCard
                    product={p}
                    viewMode="grid"
                    isFavorite={true}
                    onAddFavorite={() => removeFromFavorites(p.productId)}
                  />
                  <button
                    onClick={() => removeFromFavorites(p.productId)}
                    className="absolute px-2 py-1 text-white bg-red-500 rounded top-2 right-2 hover:bg-red-600"
                    title="Xóa khỏi yêu thích"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
       
      </main>
      <Footer />
    </div>
  );
}