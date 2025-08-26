import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductCard } from "../components/ProductCard";
import CategoryService from "../services/CategoryService";
import useFetchList from "../core/hooks/useFetchList";
import { useDebouncedSearch } from "../core/hooks/useDebouncedSearch";
import FavoriteService from "../services/FavoriteService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { useSearchParams } from "react-router-dom";

export function ProductPage() {
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  // const [totalPrice, setTotalPrice] = useState(0); // Thêm state cho tổng giá

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      setProductQuery((prev) => ({
        ...prev,
        Filter: {
          ...prev.Filter,
          CategoryId: categoryId,
        },
      }));
    }
    setSelectedCategory(categoryId);
  }, [searchParams]);

  const queryClient = useQueryClient();

  const { data: favoritesData, isLoading: favoritesLoading, refetch: refetchFavorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => FavoriteService.getFavorites().then((res) => res.data.data),
  });
  // const { data: favoritesData, isLoading: favoritesLoading } = useFetchList("/favorites", productQuery, { reloadTrigger });
  
  useEffect(() => {
refetchFavorites();
  }, [])

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
    favoritesData? favoritesData.some((fav) => fav.productId === productId): false;

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
    // if (apiResponse?.data) {
    //   const total = apiResponse.data.reduce(
    //     (sum, p) => sum + (p.UnitPrice || 0),
    //     0
    //   );
    //   setTotalPrice(total);
    // }
  };

  // const [productUrl, setProductUrl] = useState("products/sellable");
  // const [isGetFavorite, setIsGetFavorite] = useState(true);
  // useEffect(() => {
  //   if (isGetFavorite == true)
  //     setProductUrl("favorites");
  //   else
  //     setProductUrl("favorites");
  // }, [isGetFavorite])
  const {
    response: apiResponse,
    loading,
    error,
  } = useFetchList("products/sellable", productQuery, { reloadTrigger });

  // Tính tổng giá khi dữ liệu sản phẩm thay đổi
  // useEffect(() => {
  //   if (apiResponse?.data) {
  //     const total = apiResponse.data.reduce(
  //       (sum, p) => sum + (p.UnitPrice || 0),
  //       0
  //     );
  //     setTotalPrice(total);
  //   }
  // }, [apiResponse?.data]);

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
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-[#5A3E2B]">
      <Header />
      <div className="min-h-[100vh]">
        <div className="bg-amber-500 py-12 text-center shadow-md">
          <h1 className="text-4xl font-extrabold font-[inter] !text-white drop-shadow">
            Khám Phá thế giới ẩm thực hấp dẫn
          </h1>
          <p className="mt-2 text-lg text-[#FFF9F4] opacity-90">
            Hương vị ngọt ngào - Phong cách hiện đại
          </p>
        </div>

        <main className="w-full px-6 py-10 mx-auto max-w-7xl">
          {/* Bộ lọc trong card */}
          <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
            <div className="grid grid-cols-12 gap-4">
              <div className="relative col-span-12 lg:col-span-4">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-[#A47449]"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-10 p-3 border border-[#F4C78A] rounded-xl shadow-sm bg-[#FFFDF9] focus:ring-2 focus:ring-[#FFD5A1]"
                />
              </div>
              <select
                className="col-span-12 p-3 border border-[#F4C78A] rounded-xl shadow-sm lg:col-span-4 bg-[#FFFDF9] focus:ring-2 focus:ring-[#FFD5A1]"
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
                className="col-span-12 p-3 border border-[#F4C78A] rounded-xl shadow-sm lg:col-span-4 bg-[#FFFDF9] focus:ring-2 focus:ring-[#FFD5A1]"
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
            <div className="flex flex-wrap justify-between gap-3 mt-6">
              <div className="flex gap-2">
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2 bg-[#FFEBD2] border border-[#F4C78A] rounded-2xl hover:bg-[#FFD9B3] transition shadow-sm flex items-center gap-2"
                >
                  <i className="fa-solid fa-rotate-left"></i> Bỏ lọc
                </button>
                <button className="px-5 py-2 bg-[#FFEBD2] border border-[#F4C78A] rounded-2xl hover:bg-[#FFD9B3] transition shadow-sm flex items-center gap-2">
                  <i className="fa-solid fa-sliders"></i> Lọc & Sắp xếp
                </button>
                <button
                  onClick={() => setShowFavoritesOnly((prev) => !prev)}
                  className={`px-5 py-2 rounded-2xl shadow-sm transition flex items-center gap-2 ${
                    showFavoritesOnly
                      ? "bg-[#F4A261] text-white shadow-md"
                      : "bg-[#FFEBD2] border border-[#F4C78A] hover:bg-[#FFD9B3]"
                  }`}
                >
                  <i className="fa-solid fa-heart"></i> Yêu thích
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-5 py-2 rounded-2xl transition shadow-sm flex items-center gap-2 ${
                    viewMode === "grid"
                      ? "bg-[#F4A261] text-white shadow-md"
                      : "bg-[#FFEBD2] border border-[#F4C78A] hover:bg-[#FFD9B3]"
                  }`}
                >
                  <i className="fa-solid fa-grip"></i> Lưới
                </button>
                <button
                  onClick={() => setViewMode("blog")}
                  className={`px-5 py-2 rounded-2xl transition shadow-sm flex items-center gap-2 ${
                    viewMode === "blog"
                      ? "bg-[#F4A261] text-white shadow-md"
                      : "bg-[#FFEBD2] border border-[#F4C78A] hover:bg-[#FFD9B3]"
                  }`}
                >
                  <i className="fa-solid fa-bars"></i> Blog
                </button>
              </div>
            </div>
          </div>

          {/* Tổng giá floating */}
          {/* {totalPrice > 0 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
              <div className="px-6 py-3 bg-[#FFD9B3] text-[#5A3E2B] font-bold rounded-full shadow-lg flex items-center gap-2">
                <i className="fa-solid fa-sack-dollar"></i>
                Tổng giá: {totalPrice.toLocaleString()} VNĐ
              </div>
            </div>
          )} */}

          {/* Product List */}
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="text-[#A47449]">Lỗi: {error.message}</p>
          ) : apiResponse?.data?.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8"
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

          {/* Pagination với icon */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-16 mb-10">
              <button
                disabled={isFirstPage}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFEBD2] border border-[#F4C78A] shadow-sm disabled:opacity-50 hover:bg-[#FFD9B3]"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <span className="px-4 py-2 rounded-full bg-[#F4A261] text-white font-semibold shadow">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={isLastPage}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFEBD2] border border-[#F4C78A] shadow-sm disabled:opacity-50 hover:bg-[#FFD9B3]"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </main>
      </div>
      {/* Banner */}

      <Footer />
    </div>
  );
}
