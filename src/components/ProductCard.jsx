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
    <div className="flex flex-col overflow-hidden transition border rounded-lg hover:shadow-md">

      <Link to={`/products/${productId}`}>
        <img
          src={imgs || '/placeholder.jpg'}
          alt={name}
          className="object-cover w-full h-48"
        />
      </Link>

      <div className="flex flex-col justify-between flex-1 gap-2 p-4">

        <div>
          <h3 className="font-semibold text-gray-600">{name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>

        <div className="flex items-end justify-between">
          <p className="font-bold text-yellow-600">${unitPrice.toFixed(2)}</p>

          <Link
            to={`/products/${productId}`}
            className="px-4 py-2 mt-2 text-center text-white transition bg-yellow-600 rounded hover:bg-yellow-700"
          >
            Xem Chi Tiết
          </Link>
        </div>

      </div>

    </div>
  )
}
