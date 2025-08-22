import { Link } from "react-router-dom";
import { useMemo } from "react";
import useFetchList from "../core/hooks/useFetchList";

function SuggestedProducts({ categoryId, categoryName }) {
  // Memoize productQuery để tránh thay đổi không cần thiết
  const productQuery = useMemo(
    () => ({
      SearchTerm: "",
      SortBy: "CreatedAt",
      SortDescending: true,
      Filter: { CategoryId: categoryId },
      PageSize: 4, // Chỉ lấy 4 sản phẩm
      PageIndex: 1,
    }),
    [categoryId]
  );

  const { response: apiResponse, loading, error } = useFetchList(
    "products/sellable",
    productQuery
  );

  const products = apiResponse?.data || [];

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-800">
        {categoryName ? `Sản phẩm liên quan trong danh mục ${categoryName}` : "Sản phẩm liên quan"}
      </h3>
      {loading ? (
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-t-amber-600 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Đang tải sản phẩm...</p>
        </div>
      ) : error ? (
        <p className="text-center text-[#A47449]">Lỗi: {error.message}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.productId}
              to={`/products/${p.productId}`}
              className="block transition-transform duration-300 hover:scale-105"
            >
              <div className="p-4 transition-all duration-300 bg-white border rounded-lg shadow-md border-amber-200 hover:shadow-lg">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={p.imgs?.[0] || "/images/placeholder.png"}
                    alt={p.name}
                    className="object-cover w-full h-40 transition-all duration-300 border rounded-lg border-amber-200 hover:border-amber-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h4 className="text-lg font-semibold text-gray-800 transition-colors duration-200 hover:text-amber-600">
                    {p.name}
                  </h4>
                  <p className="mt-2 font-medium text-amber-600">
                    {Number(p.unitPrice).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Không có sản phẩm nào trong danh mục này.
        </p>
      )}
      <div className="text-center">
        <Link
          to={`/categories/${categoryId || ""}`}
          className="inline-block px-6 py-3 text-white transition rounded-lg bg-amber-600 hover:bg-amber-700"
        >
          Xem toàn bộ danh mục {categoryName || ""}
        </Link>
      </div>
    </div>
  );
}

export default SuggestedProducts;