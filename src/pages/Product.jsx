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
import ChatPage from "./ChatPage"; // Import ChatPage component

export function ProductPage() {
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0); // Thêm state cho tổng giá

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
      queryClient.invalidateQueries(["favorites"]);
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (productId) => FavoriteService.removeFavorites([productId]),
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
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
    Filter: { CategoryId: "" },
    PageSize: 16,
    PageIndex: 1,
  };

  const [selectedSort, setSelectedSort] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState("");
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
    setInputValue("");
    setShowFavoritesOnly(false);
    // Tính lại tổng giá khi bỏ lọc
    if (apiResponse?.data) {
      const total = apiResponse.data.reduce((sum, p) => sum + (p.UnitPrice || 0), 0);
      setTotalPrice(total);
    }
  };

  const { response: apiResponse, loading, error } = useFetchList(
    "products/sellable",
    productQuery,
    { reloadTrigger }
  );

  // Tính tổng giá khi dữ liệu sản phẩm thay đổi
  useEffect(() => {
    if (apiResponse?.data) {
      const total = apiResponse.data.reduce((sum, p) => sum + (p.UnitPrice || 0), 0);
      setTotalPrice(total);
    }
  }, [apiResponse?.data]);

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
    { value: "0", label: "Tất cả giá" },
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

  return (
  <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFFDF9] text-[#7B4F2C]">
    <Header />

    {/* Banner */}
    <div className="bg-gradient-to-r from-[#FFE6CC] to-[#FFB347] py-16 text-center shadow-lg">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
        Khám Phá Sản Phẩm
      </h1>
      <p className="mt-3 text-lg text-[#FFFDF9] opacity-90">
        Hương vị ngọt ngào - Phong cách hiện đại
      </p>
    </div>

    <main className="w-full px-6 py-12 mx-auto max-w-7xl">
      {/* Bộ lọc */}
      <div className="p-6 bg-white rounded-3xl shadow-lg border border-[#FFE6CC] mb-10">
        <div className="grid grid-cols-12 gap-4">
          {/* Ô tìm kiếm */}
          <div className="relative col-span-12 lg:col-span-4">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-[#7B4F2C]"></i>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-12 p-3 border border-[#FFD9B3] rounded-2xl shadow-sm bg-[#FFFCF7] 
                         focus:ring-2 focus:ring-[#FFB347] outline-none transition"
            />
          </div>

          {/* Chọn danh mục */}
          <select
            className="col-span-12 p-3 border border-[#FFD9B3] rounded-2xl shadow-sm lg:col-span-4 bg-[#FFFCF7] 
                       focus:ring-2 focus:ring-[#FFB347] outline-none transition"
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

          {/* Sắp xếp */}
          <select
            className="col-span-12 p-3 border border-[#FFD9B3] rounded-2xl shadow-sm lg:col-span-4 bg-[#FFFCF7] 
                       focus:ring-2 focus:ring-[#FFB347] outline-none transition"
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

        {/* Action buttons */}
        <div className="flex flex-wrap justify-between gap-3 mt-8">
          <div className="flex gap-3">
            <button
              onClick={handleClearFilters}
              className="px-5 py-2 bg-white border border-[#FFD9B3] rounded-full 
                         hover:bg-gradient-to-r hover:from-[#FFE6CC] hover:to-[#FFB347] 
                         hover:text-white transition-all duration-300 shadow"
            >
              <i className="fa-solid fa-rotate-left"></i> Bỏ lọc
            </button>

            <button
              className="px-5 py-2 bg-white border border-[#FFD9B3] rounded-full 
                         hover:bg-gradient-to-r hover:from-[#FFE6CC] hover:to-[#FF9E62] 
                         hover:text-white transition-all duration-300 shadow"
            >
              <i className="fa-solid fa-sliders"></i> Lọc & Sắp xếp
            </button>

            <button
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
              className={`px-5 py-2 rounded-full shadow transition-all duration-300 ${
                showFavoritesOnly
                  ? "bg-gradient-to-r from-[#FFB347] to-[#FF9E62] text-white shadow-lg scale-105"
                  : "bg-white border border-[#FFD9B3] hover:bg-[#FFE6CC]"
              }`}
            >
              <i className="fa-solid fa-heart"></i> Yêu thích
            </button>
          </div>
          </div>
          </div>

      {/* Floating tổng giá */}
      {totalPrice > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="px-6 py-3 bg-[#FFB347] text-white font-bold rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <i className="fa-solid fa-sack-dollar"></i>
            Tổng giá: {totalPrice.toLocaleString()} VNĐ
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <p className="text-center text-[#7B4F2C]">Đang tải sản phẩm...</p>
      ) : error ? (
        <p className="text-center text-red-500">Lỗi: {error.message}</p>
      ) : apiResponse?.data?.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10"
              : "flex flex-col gap-6 mb-10"
          }
        >
          {(showFavoritesOnly
            ? apiResponse.data.filter((p) => isFavorite(p.productId))
            : apiResponse.data
          ).map((p) => (
            <div className="transform transition hover:scale-105">
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[#7B4F2C]">Không có sản phẩm nào.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-16 mb-10">
          <button
            disabled={isFirstPage}
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#FFD9B3] 
                       shadow disabled:opacity-50 hover:bg-[#FFE6CC] transition"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="px-5 py-2 rounded-full bg-[#FFB347] text-white font-semibold shadow-md">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={isLastPage}
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#FFD9B3] 
                       shadow disabled:opacity-50 hover:bg-[#FFE6CC] transition"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </main>

    <Footer />
  </div>
);




}