import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import RatingService from "../services/RatingService";

export function ProductCard({
  product,
  viewMode,
  onAddFavorite,
  isFavorite,
  className,
}) {
  const {
    productId,
    name,
    unitPrice,
    finalUnitPrice,
    imgs = ["/placeholder.jpg"],
    description = "",
    createdDate = "Feb 12, 2020",
  } = product;

  const discountPercent = unitPrice > finalUnitPrice
  ? Math.round(((unitPrice - finalUnitPrice) / unitPrice) * 100)
  : 0;

  // Giả sử token được lấy từ context hoặc state
  const token = "your-auth-token"; // TODO: Thay bằng logic lấy token thực tế

  // Fetch product rating and review count
  const {
    data: ratingData,
    isLoading: ratingLoading,
    error: ratingError,
  } = useQuery({
    queryKey: ["productRating", productId],
    queryFn: async () => {
      const response = await RatingService.getRatingsByProduct(productId, token);
      const ratings = response.data?.data || [];
      const reviewCount = ratings.length;
      const averageRating =
        reviewCount > 0
          ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
          : 0;
      return { averageRating, reviewCount };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Thử lại 1 lần nếu thất bại
  });

  // Đảm bảo averageRating trong khoảng 0-5
  const averageRating = Math.min(Math.max(ratingData?.averageRating || 0, 0), 5);
  const reviewCount = ratingData?.reviewCount || 0;

  // Track viewed products
  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem("viewedProducts") || "[]");
      const alreadyExists = viewed.find((p) => p.productId === productId);
      if (!alreadyExists) {
        const updated = [
          ...viewed.slice(-9),
          {
            productId,
            name,
            unitPrice,
            finalUnitPrice,
            imgs,
            averageRating,
            reviewCount,
            createdDate,
          },
        ];
        localStorage.setItem("viewedProducts", JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Error updating viewedProducts:", error);
    }
  }, [
    productId,
    name,
    unitPrice,
    finalUnitPrice,

    imgs,
    averageRating,
    reviewCount,
    createdDate,
  ]);

  const productImg =
    Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : "/placeholder.jpg";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddFavorite) onAddFavorite();
  };

  const heartClassName = `${
  isFavorite ? "text-amber-500" : "text-gray-400"
} text-xl transition-colors duration-300`;

  if (viewMode === "grid") {
    return (
      <div
        className={`relative flex flex-col h-full min-h-[420px] max-w-sm rounded-xl bg-white border-2 border-amber-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${className}`}
      >
        <Link
          to={`/products/${productId}`}
          className="relative block overflow-hidden rounded-t-xl h-60"
        >
          <img
            src={productImg}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 px-3 py-1.5 text-base font-semibold text-amber-700 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-amber-300">
{typeof finalUnitPrice === "number" ? `${finalUnitPrice.toFixed(0)}₫` : ""}
          </div>
         <button
  onClick={handleFavoriteClick}
  className={`absolute top-3 right-3 w-5 h-5 rounded-full border transition-all duration-200
    ${isFavorite
      ? "bg-amber-500 border-amber-500"
      : "bg-white border-gray-300 hover:border-amber-500 hover:shadow-md"
    }`}
  aria-label={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
></button>



        </Link>
        <div className="flex flex-col flex-1 p-5">
         <h3 className="flex items-center justify-between text-lg font-bold text-amber-600 truncate">
          <span className="truncate block">
            {name}
          </span>
          {discountPercent > 0 && (
            <span className="discount-badge ml-2">
              -{discountPercent}%
            </span>
          )}
        </h3>



          <div className="flex items-center justify-between mt-3">
            {ratingLoading ? (
              <span className="text-base text-gray-500">Đang tải...</span>
            ) : ratingError ? (
              <span className="text-base text-red-500">Lỗi tải rating</span>
            ) : (
              <span className="text-base font-semibold text-amber-500">
                {"★".repeat(Math.round(averageRating)) +
                  "☆".repeat(5 - Math.round(averageRating))}
              </span>
            )}
            <span className="text-sm text-gray-500">
              {ratingLoading ? "Đang tải..." : `${reviewCount} đánh giá`}
            </span>
          </div>
          <Link
            to={`/products/${productId}`}
            className="px-4 py-2 mt-4 text-sm font-semibold text-white transition-all duration-300 rounded-lg shadow-sm bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95"
          >
            Xem Chi Tiết
          </Link>
        </div>
      </div>
    );
  }

  // Blog view
  return (
    <div
      className={`relative flex flex-row w-full max-w-full overflow-hidden bg-white rounded-xl border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}
    >
      <Link
        to={`/products/${productId}`}
        className="relative block w-1/2 overflow-hidden rounded-l-xl h-80"
      >
        <img
          src={productImg}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 px-3 py-1.5 text-base font-semibold text-amber-700 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-amber-300">
{typeof finalUnitPrice === "number" ? `${finalUnitPrice.toFixed(0)}₫` : ""}
        </div>
          <button
  onClick={handleFavoriteClick}
  className={`absolute top-3 right-3 w-5 h-5 rounded-full border transition-all duration-200
    ${isFavorite
      ? "bg-amber-500 border-amber-500"
      : "bg-white border-gray-300 hover:border-amber-500 hover:shadow-md"
    }`}
  aria-label={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
></button>
      </Link>
      <div className="flex flex-col w-1/2 p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-amber-600 truncate">
        <span className="truncate block max-w-[calc(100%-60px)]">
          {name}
        </span>
        {discountPercent > 0 && (
          <span className="discount-badge flex-shrink-0">
            -{discountPercent}%
          </span>
        )}
      </h3>


        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          {ratingLoading ? (
            <span className="text-lg text-gray-500">Đang tải...</span>
          ) : ratingError ? (
            <span className="text-lg text-red-500">Lỗi tải rating</span>
          ) : (
            <span className="text-lg font-semibold text-amber-500">
              {"★".repeat(Math.round(averageRating)) +
                "☆".repeat(5 - Math.round(averageRating))}
            </span>
          )}
          <span className="text-base text-gray-500">
            {ratingLoading ? "Đang tải..." : `${reviewCount} đánh giá`}
          </span>
        </div>
        <Link
          to={`/products/${productId}`}
          className="w-40 px-4 py-2 mt-6 text-base font-semibold text-white transition-all duration-300 rounded-lg shadow-sm bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95"
        >
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );
}