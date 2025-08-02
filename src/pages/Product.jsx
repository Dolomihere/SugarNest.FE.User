import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductCard } from "../components/ProductCard";
import CategoryService from "../services/CategoryService";
import useFetchList from "../core/hooks/useFetchList";
import { useDebouncedSearch } from "../core/hooks/useDebouncedSearch";
import FavoriteService from "../services/FavoriteService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import RatingService from "../services/RatingService";

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
    queryFn: () =>
      CategoryService.getAllCategories().then((res) =>
        res.data.data.map((cat) => ({
          value: cat.categoryId,
          label: cat.name,
        }))
      ),
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
  const totalPages = Math.ceil((meta.totalCount ?? 0) / (meta.pageSize ?? 12));
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
    { value: "1", label: "Giá (thấp - cao)" },
    { value: "2", label: "Giá (cao - thấp)" },
    { value: "3", label: "Tên (a - z)" },
    { value: "4", label: "Tên (z - a)" },
   
  ];

  const handleSortChange = (value) => {
    setSelectedSort(value);
    let sortBy = "CreatedAt";
    let sortDescending = true;
    switch (value) {
        case "1":
        sortBy = "UnitPrice";
        sortDescending = false;
        break;
      case "2":
        sortBy = "UnitPrice";
        sortDescending = true;
        break;
      case "3":
        sortBy = "Name";
        sortDescending = false;
        break;
      case "4":
        sortBy = "Name";
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
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-[#5A3E2B]">
  <Header />
  <main className="w-full px-8 py-6 mx-auto max-w-7xl">
    <h2 className="mb-6 text-3xl font-bold text-center text-[#E8B273]">
      Sản Phẩm Của Chúng Tôi
    </h2>

    {/* Filters */}
    <div className="grid grid-cols-12 gap-4 mb-6">
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="col-span-12 p-2 border border-[#C8A079] rounded lg:col-span-3 bg-white text-[#5A3E2B]"
      />
      <select
        className="col-span-12 p-2 border border-[#C8A079] rounded lg:col-span-3 bg-white text-[#5A3E2B]"
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
        className="col-span-12 p-2 border border-[#C8A079] rounded lg:col-span-3 bg-white text-[#5A3E2B]"
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
        className="col-span-12 p-2 border border-[#C8A079] rounded lg:col-span-3 bg-white text-[#5A3E2B]"
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
        <button className="px-3 py-2 border border-[#C8A079] rounded-md hover:bg-[#F5D7A1] transition-colors duration-200">
          Bỏ lọc
        </button>
        <button className="px-3 py-2 border border-[#C8A079] rounded-md hover:bg-[#F5D7A1] transition-colors duration-200">
          Lọc và sắp xếp
        </button>
        <button
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
          className={`px-3 py-2 border rounded-md transition-colors duration-200 ${
            showFavoritesOnly
              ? "bg-[#FDEBD0] border-[#E8B273] text-[#A47449]"
              : "border-[#C8A079] hover:bg-[#F5D7A1]"
          }`}
        >
          Yêu thích
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-2 border rounded-md transition-colors duration-200 ${
            viewMode === "grid"
              ? "bg-[#F4C78A] border-[#C8A079]"
              : "border-[#C8A079] hover:bg-[#F5D7A1]"
          }`}
        >
          Dạng lưới
        </button>
        <button
          onClick={() => setViewMode("blog")}
          className={`px-3 py-2 border rounded-md transition-colors duration-200 ${
            viewMode === "blog"
              ? "bg-[#F4C78A] border-[#C8A079]"
              : "border-[#C8A079] hover:bg-[#F5D7A1]"
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
      <p className="text-[#A47449]">Lỗi: {error.message}</p>
    ) : apiResponse?.data?.length > 0 ? (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8"
            : "flex flex-col gap-6 mb-8"
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
      <p>Không có sản phẩm nào.</p>
    )}

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center gap-2 mb-10">
        <button
          disabled={isFirstPage}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 border border-[#C8A079] rounded disabled:opacity-50 hover:bg-[#F5D7A1]"
        >
          ← Trước
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border border-[#C8A079] rounded ${
              page === currentPage
                ? "bg-[#E8B273] text-white"
                : "hover:bg-[#F5D7A1]"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={isLastPage}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 border border-[#C8A079] rounded disabled:opacity-50 hover:bg-[#F5D7A1]"
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
