import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { ProductCard } from "../components/ProductCard";

import CategoryService from "../services/CategoryService";
import useFetchList from "../core/hooks/useFetchList";
import { useDebouncedSearch } from "../core/hooks/useDebouncedSearch";

export function ProductPage() {
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  // Lấy danh sách danh mục
  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories().then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!allCategories) return;
    const options = allCategories.map((cat) => ({
      value: cat.categoryId,
      label: cat.name,
    }));
    setCategories(options);
  }, [allCategories]);

  const DEFAULT_ProductQuery = {
    SearchTerm: "",
    SortBy: "CreatedAt",
    SortDescending: true,
    Filter: { CategoryId: "" },
    PageSize: 12,
    PageIndex: 1,
  };

  const [selectedSort, setSelectedSort] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productQuery, setProductQuery] = useState(DEFAULT_ProductQuery);

  const { inputValue, setInputValue } = useDebouncedSearch(500, (value) => {
    setProductQuery((prev) => ({
      ...prev,
      SearchTerm: value,
      PageIndex: 1,
    }));
  });

  const handleClearFilters = () => {
    setProductQuery(DEFAULT_ProductQuery);
    setInputValue("");
    setSelectedSort("0");
    setSelectedCategory("");
  };

  const { response: apiResponse, loading, error } = useFetchList(
    "products/sellable",
    productQuery,
    {}
  );

  const meta = apiResponse?.meta ?? {};
  const totalPages = Math.ceil((meta.totalCount ?? 0) / (meta.pageSize ?? 12));
  const currentPage = productQuery.PageIndex;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const visiblePages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

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
    { value: "4", label: "Giá (nhỏ - lớn)" },
    { value: "5", label: "Giá (lớn - nhỏ)" },
  ];

  const handleCategoryChange = (newId) => {
    setSelectedCategory(newId);
    setProductQuery((prev) => ({
      ...prev,
      Filter: { ...prev.Filter, CategoryId: newId },
      PageIndex: 1,
    }));
  };

  const handleSortChange = (selectedValue) => {
    setSelectedSort(selectedValue);
    let sortBy = "CreatedAt";
    let sortDescending = true;
    switch (selectedValue) {
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

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-[#fffaf3] text-gray-700">
      <Header />
      <main className="px-[40px] mx-auto flex flex-col gap-5 max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold mt-18 text-amber-600">Sản Phẩm Của Chúng Tôi</h2>
          <p>Khám phá các loại bánh thơm ngon, được làm thủ công mỗi ngày</p>
        </div>

        <div className="mb-10 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="col-span-12 px-4 py-2 border rounded-md lg:col-span-4 focus:ring-amber-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="col-span-12 px-4 py-2 border rounded-md lg:col-span-4 focus:ring-amber-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="col-span-12 px-4 py-2 border rounded-md lg:col-span-4 focus:ring-amber-500"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 border rounded-md hover:bg-amber-100"
              >
                Bỏ lọc
              </button>
              <button
                onClick={() => setReloadTrigger(!reloadTrigger)}
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
        </div>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : error ? (
          <p className="text-red-500">Lỗi: {error}</p>
        ) : Array.isArray(apiResponse?.data) && apiResponse.data.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {apiResponse.data.map((p) => (
                <ProductCard key={p.productId} product={p} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {apiResponse.data.map((p) => (
                <ProductCard key={p.productId} product={p} viewMode="blog" />
              ))}
            </div>
          )
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}

        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isFirstPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Trước
          </button>
          {visiblePages.map((page) => (
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLastPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Tiếp →
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
