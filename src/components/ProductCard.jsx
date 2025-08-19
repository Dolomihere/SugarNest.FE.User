import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as regularHeart,
  faStar as regularStar,
} from "@fortawesome/free-regular-svg-icons";
import RatingService from "../services/RatingService";

export function ProductCard({
  product,
  viewMode,
  onAddFavorite,
  isFavorite,
  className,
  hidePrice = false,
}) {
  const {
    productId,
    name,
    unitPrice = 0,
    finalUnitPrice = 0,
    imgs = ["/placeholder.jpg"],
    description = "",
    createdDate = "Feb 12, 2020",
  } = product;

  const discountPercent =
    unitPrice > finalUnitPrice
      ? Math.round(((unitPrice - finalUnitPrice) / unitPrice) * 100)
      : 0;

  const token = "your-auth-token"; // TODO: thay bằng token thực tế
  const formatCurrency = (value) =>
    typeof value === "number" ? value.toLocaleString("vi-VN") + "₫" : "0₫";

  const { data: ratingData, isLoading: ratingLoading } = useQuery({
    queryKey: ["productRating", productId],
    queryFn: async () => {
      try {
        const response = await RatingService.getRatingsByProduct(
          productId,
          token
        );
        const ratings = response.data?.data || [];
        const reviewCount = ratings.length;
        const averageRating =
          reviewCount > 0
            ? ratings.reduce((sum, r) => sum + (r.ratingPoint || 0), 0) /
              reviewCount
            : 0;
        return { averageRating, reviewCount };
      } catch (error) {
        return { averageRating: 0, reviewCount: 0 };
      }
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

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
  }, [productId, name, unitPrice, finalUnitPrice, imgs, averageRating, reviewCount, createdDate]);

  const productImg =
    Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : "/placeholder.jpg";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddFavorite) onAddFavorite();
  };

  // Rating stars with FontAwesome
  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={i < Math.round(averageRating) ? solidStar : regularStar}
        className={`${
          i < Math.round(averageRating)
            ? "text-[#FBBF77] drop-shadow-sm"
            : "text-gray-300"
        }`}
      />
    ));

  // Badge giảm giá pastel
  const DiscountBadge = () =>
    discountPercent > 0 ? (
      <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white rounded-full shadow-md bg-gradient-to-r from-[#FBBF77] to-[#FCD19C] animate-bounce">
        -{discountPercent}%
      </span>
    ) : null;

  // --- CARD GRID MODE ---
  if (viewMode === "grid") {
    return (
      <div
        className={`relative flex flex-col h-full min-h-[420px] max-w-sm rounded-2xl bg-white border border-[#FCD19C] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group ${className}`}
      >
        <Link
          to={`/products/${productId}`}
          className="relative block overflow-hidden rounded-t-2xl h-60"
        >
          <img
            src={productImg}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <DiscountBadge />

          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition-all duration-300"
            aria-label={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <FontAwesomeIcon
              icon={isFavorite ? solidHeart : regularHeart}
              className={`w-5 h-5 ${
                isFavorite
                  ? "text-[#FBBF77]"
                  : "text-gray-400 hover:text-[#FBBF77]"
              }`}
            />
          </button>
        </Link>

        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-lg font-bold text-[#e5873d] truncate">
            {name}
          </h3>

          {!hidePrice && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-bold text-[#f97316]">
                {formatCurrency(finalUnitPrice)}
              </span>
              {unitPrice > finalUnitPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {unitPrice.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            {ratingLoading ? (
              <span className="text-sm text-gray-400">Đang tải...</span>
            ) : (
              <div className="flex items-center gap-1">
                {renderStars()}
                <span className="ml-2 text-xs text-gray-500">
                  ({reviewCount})
                </span>
              </div>
            )}
          </div>

          <Link
            to={`/products/${productId}`}
            className="px-4 py-2 mt-4 text-sm font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-[#FBBF77] to-[#FCD19C] hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Xem Chi Tiết
          </Link>
        </div>
      </div>
    );
  }

  // --- CARD LIST MODE ---
  return (
    <div
      className={`relative flex flex-row w-full max-w-full overflow-hidden bg-white rounded-2xl border border-[#FCD19C] shadow-sm hover:shadow-md transition-all duration-300 group ${className}`}
    >
      <Link
        to={`/products/${productId}`}
        className="relative block w-1/2 overflow-hidden rounded-l-2xl h-80"
      >
        <img
          src={productImg}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <DiscountBadge />

        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition-all duration-300"
          aria-label={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        >
          <FontAwesomeIcon
            icon={isFavorite ? solidHeart : regularHeart}
            className={`w-5 h-5 ${
              isFavorite
                ? "text-[#FBBF77]"
                : "text-gray-400 hover:text-[#FBBF77]"
            }`}
          />
        </button>
      </Link>

      <div className="flex flex-col w-1/2 p-6">
        <h3 className="text-lg font-bold text-[#e5873d] truncate">
          {name}
        </h3>

        {!hidePrice && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-[#f97316]">
              {formatCurrency(finalUnitPrice)}
            </span>
            {unitPrice > finalUnitPrice && (
              <span className="text-sm text-gray-400 line-through">
                {unitPrice.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
        )}

        {description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-3">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          {ratingLoading ? (
            <span className="text-sm text-gray-400">Đang tải...</span>
          ) : (
            <div className="flex items-center gap-1">
              {renderStars()}
              <span className="ml-2 text-xs text-gray-500">
                ({reviewCount})
              </span>
            </div>
          )}
        </div>

        <Link
          to={`/products/${productId}`}
          className="w-40 px-4 py-2 mt-6 text-sm font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-[#FBBF77] to-[#FCD19C] hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );
}
