import { Link } from "react-router-dom";

export function ProductCard({ product, viewMode }) {
  const {
    productId,
    name,
    unitPrice,
    imgs,
    description,
    author = {
      name: "Handsome Administrator",
      img:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&w=256&q=80",
    },
    rating = 4,
    reviews = 34,
    createdDate = "Feb 12, 2020",
  } = product;

  if (viewMode === "grid") {
    return (
      <div className="flex flex-col h-full min-h-[420px] max-w-sm rounded-lg bg-white shadow hover:-translate-y-1 transition-transform duration-300">
        <Link to={`/products/${productId}`} className="relative block overflow-hidden rounded-t-lg h-60">
          <img
            src={imgs || "/placeholder.jpg"}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-2 left-2 px-3 py-1.5 text-base font-semibold text-yellow-700 bg-white/80 backdrop-blur-sm rounded-md shadow-md">
            {unitPrice.toFixed(0)}₫
          </div>
        </Link>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-lg font-bold transition-all text-amber-600 line-clamp-1 hover:line-clamp-none">
            {name}
          </h3>
          <div className="flex items-center mt-4">
            <img
              src={author.img}
              alt={author.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-600 hover:underline">
                {author.name}
              </p>
              <time className="text-xs text-gray-500" dateTime={createdDate}>
                {createdDate}
              </time>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base font-semibold text-amber-500">
              {"★".repeat(rating) + "☆".repeat(5 - rating)}
            </span>
            <span className="text-sm text-gray-600">{reviews} reviews</span>
          </div>
          <Link
            to={`/products/${productId}`}
            className="px-4 py-2 mt-4 text-sm font-medium text-center text-white transition-all rounded-lg bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95"
          >
            Xem Chi Tiết
          </Link>
        </div>
      </div>
    );
  }

  // viewMode === "blog"
  return (
    <div className="flex flex-row w-full max-w-full overflow-hidden bg-white rounded-lg shadow-md">
      <Link to={`/products/${productId}`} className="relative block w-1/2 overflow-hidden rounded-l-lg h-80">
        <img
          src={imgs || "/placeholder.jpg"}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-2 left-2 px-3 py-1.5 text-base font-semibold text-yellow-700 bg-white/80 backdrop-blur-sm rounded-md shadow-md">
          {unitPrice.toFixed(0)}₫
        </div>
      </Link>
      <div className="flex flex-col w-1/2 p-6">
        <h3 className="mb-2 text-2xl font-bold text-amber-600">{name}</h3>
        {description && (
          <p className="mt-2 text-gray-600 line-clamp-3">{description}</p>
        )}
        <div className="flex items-center mt-6">
          <img
            src={author.img}
            alt={author.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-3">
            <p className="text-base font-semibold text-gray-600 hover:underline">
              {author.name}
            </p>
            <time className="text-sm text-gray-500" dateTime={createdDate}>
              {createdDate}
            </time>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-semibold text-amber-500">
            {"★".repeat(rating) + "☆".repeat(5 - rating)}
          </span>
          <span className="text-base text-gray-600">{reviews} reviews</span>
        </div>
        <Link
          to={`/products/${productId}`}
          className="w-40 px-4 py-2 mt-6 text-base font-medium text-center text-white transition-all rounded-lg bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95"
        >
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );
}
