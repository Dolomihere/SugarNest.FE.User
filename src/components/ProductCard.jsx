import { Link } from "react-router-dom";
import { useEffect } from "react";

export function ProductCard({ product, viewMode, onAddFavorite, isFavorite }) {
  const {
    productId,
    name,
    unitPrice,
    imgs = ["/placeholder.jpg"],
    description = "",
    rating = 4,
    reviews = 34,
    createdDate = "Feb 12, 2020",
  } = product;

  // Track viewed products
  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem("viewedProducts") || "[]");
      const alreadyExists = viewed.find((p) => p.productId === productId);
      if (!alreadyExists) {
        const updated = [...viewed.slice(-9), { productId, name, unitPrice, imgs, rating, reviews, createdDate }];
        localStorage.setItem("viewedProducts", JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Error updating viewedProducts:", error);
    }
  }, [productId, name, unitPrice, imgs, rating, reviews, createdDate]);

  const productImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : "/placeholder.jpg";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddFavorite) onAddFavorite();
  };

  const heartClassName = `text-2xl ${
    isFavorite ? "text-amber-500" : "text-gray-400 hover:text-amber-500"
  } transition-colors duration-300`;

  if (viewMode === "grid") {
    return (
      <div className="relative flex flex-col h-full min-h-[420px] max-w-sm rounded-lg bg-white shadow hover:-translate-y-1 transition-transform duration-300">
        <Link
          to={`/products/${productId}`}
          className="relative block overflow-hidden rounded-t-lg h-60"
        >
          <img
            src={productImg}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-2 left-2 px-3 py-1.5 text-base font-semibold text-yellow-700 bg-white/80 backdrop-blur-sm rounded-md shadow-md">
            {unitPrice.toFixed(0)}₫
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-0.5"
            style={{ background: "none", border: "none" }}
            aria-label={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <i className={`fa-solid fa-heart ${heartClassName}`}></i>
          </button>
        </Link>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-lg font-bold transition-all text-amber-600 line-clamp-1 hover:line-clamp-none">
            {name}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <span className="text-base font-semibold text-amber-500">
              {"★".repeat(rating) + "☆".repeat(5 - rating)}
            </span>
            <span className="text-sm text-gray-600">{reviews} reviews</span>
          </div>
          <Link
            to={`/products/${productId}`}
            className="px-4 py-2 mt-4 text-sm font-medium text-center text-white rounded-lg bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95"
          >
            Xem Chi Tiết
          </Link>
        </div>
      </div>
    );
  }

  // Blog view
  return (
    <div className="relative flex flex-row w-full max-w-full overflow-hidden bg-white rounded-lg shadow-md">
      <Link to={`/products/${productId}`} className="relative block w-1/2 overflow-hidden rounded-l-lg h-80">
        <img
          src={productImg}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-2 left-2 px-3 py-1.5 text-base font-semibold text-yellow-700 bg-white/80 backdrop-blur-sm rounded-md shadow-md">
          {unitPrice.toFixed(0)}₫
        </div>
        <button
          onClick={handleFavoriteClick}
          className="absolute p-1 transition-colors rounded-full shadow-md top-2 right-2 hover:bg-amber-100"
          aria-label={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        >
          <i className={isFavorite ? `fa-solid fa-heart ${heartClassName}` : `fa-regular fa-heart ${heartClassName}`}></i>
        </button>
      </Link>
      <div className="flex flex-col w-1/2 p-6">
        <h3 className="mb-2 text-2xl font-bold text-amber-600">{name}</h3>
        {description && <p className="mt-2 text-gray-600 line-clamp-3">{description}</p>}

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-semibold text-amber-500">
            {"★".repeat(rating) + "☆".repeat(5 - rating)}
          </span>
          <span className="text-base text-gray-600">{reviews} reviews</span>
        </div>
        <Link
          to={`/products/${productId}`}
          className="w-40 px-4 py-2 mt-6 text-base font-medium text-center text-white rounded-lg bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95"
        >
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );
}