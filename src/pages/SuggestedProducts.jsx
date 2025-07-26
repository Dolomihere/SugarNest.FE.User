import { Link } from "react-router-dom";

function SuggestedProducts({ suggestions }) {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-800">Sản phẩm gợi ý</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {suggestions.map((p) => (
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
      <div className="text-center">
        <Link
          to="/products"
          className="inline-block px-6 py-3 text-white transition rounded-lg bg-amber-600 hover:bg-amber-700"
        >
          Xem thêm sản phẩm
        </Link>
      </div>
    </div>
  );
}

export { SuggestedProducts };