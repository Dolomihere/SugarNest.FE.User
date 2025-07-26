import { Link } from 'react-router-dom';
import StarRating from '../StarRating';

export default function ProductCard(item, viewMode = "grid") {

  if (viewMode === "grid") {
    return (
      <div className={`relative flex flex-col h-full min-h-[420px] max-w-sm rounded-xl bg-white border-2 border-amber-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>

        <Link
          to={`/products/${item.productId}`}
          className="relative block overflow-hidden rounded-t-xl h-60"
        >
          <img
            src={item.productImg[0]}
            alt={item.name}
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
          ></button>

        </Link>

        <div className="flex flex-col flex-1 p-5">
         <h3 className="flex items-center justify-between text-lg font-bold text-amber-600 truncate">

          <span className="truncate block">{item.name}</span>

            {discountPercent > 0 && (
              <span className="discount-badge ml-2">
                -{discountPercent}%
              </span>
            )}

          </h3>

          {/* <div className="flex items-center justify-between mt-3">
            {ratingLoading ? (
              <span className="text-base text-gray-500">Đang tải...</span>
            ) : ratingError ? (
              <span className="text-base text-red-500">Lỗi tải rating</span>
            ) : (
              <span className="text-base font-semibold text-amber-500">
                <StarRating averageRating={data?.averageRatingPoint ?? 0} />
              </span>
            )}
            <span className="text-sm text-gray-500">
              {ratingLoading ? "Đang tải..." : `${reviewCount} đánh giá`}
            </span>
          </div> */}

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
