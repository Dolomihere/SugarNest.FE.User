import { Link } from 'react-router-dom'

export function ProductCard({ product }) {
  const {
    productId,
    name,
    unitPrice,
    imgs,
    description,
  } = product;

  return (
    <div className="border flex flex-col rounded-lg overflow-hidden hover:shadow-md transition">

      <Link to={`/products/${productId}`}>
        <img
          src={imgs || '/placeholder.jpg'}
          alt={name}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="flex flex-col flex-1 justify-between p-4 gap-2">

        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2">{description}</p>
        </div>

        <div className="flex justify-between items-end">
          <p className="text-amber-600 font-bold">${unitPrice.toFixed(2)}</p>

          <Link
            to={`/products/${productId}`}
            className="mt-2 bg-amber-500 text-white text-center py-2 px-4 rounded hover:bg-amber-600 transition"
          >
            Xem Chi Tiết
          </Link>
        </div>

      </div>

    </div>
  )
}
