import { Link } from 'react-router-dom'

export function ProductCard({ product }) {
  const {
    productId,
    name,
    unitPrice,
    imgs,
    description,
    author = {
      name: 'Handsome Administrator',
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&w=256&q=80',
    },
    rating = 4,
    reviews = 34,
    createdDate = 'Feb 12, 2020',
  } = product;

  return (
    <div className="antialiased text-gray-900 cursor-pointer flex flex-col h-full min-h-[400px] transition-[margin] duration-200">
      <div className="bg-white rounded-lg overflow-hidden shadow-2xl group transition-transform duration-300 hover:translate-y-[-10px]">
        
        {/* Image with price overlay */}
        <Link to={`/products/${productId}`} className="relative block overflow-hidden">
          <img
            src={imgs || '/placeholder.jpg'}
            alt={name}
            className="object-cover w-full transition-transform duration-300 h-60 group-hover:scale-110"
          />
          {/* Price overlay */}
          <div className="absolute px-2 py-1 text-sm font-semibold text-yellow-700 rounded-md shadow-md top-2 left-2 bg-white/80 backdrop-blur-sm">
            {unitPrice.toFixed(2)}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 pb-4 transition-colors duration-300 group-hover:bg-gray-100">
          
          {/* Product name: expand on hover */}
          <h3 className="mt-1 font-bold leading-tight transition-all duration-300 text-amber-600 group-hover:text-amber-700 line-clamp-1 group-hover:line-clamp-none">
            {name}
          </h3>

          {/* Author */}
          <div className="flex items-center mt-4">
            <img
              className="w-10 h-8 rounded-full"
              src={author.img}
              alt={author.name}
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-600 hover:underline">
                {author.name}
              </p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={createdDate}>{createdDate}</time>
                <span aria-hidden="true">·</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-amber-500">
              {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
            </span>
            <span className="text-sm text-gray-600">{reviews} reviews</span>
          </div>

          {/* Button */}
          <Link
            to={`/products/${productId}`}
            className="px-4 py-2 mt-4 text-sm font-medium text-center text-white transition-all bg-amber-500 rounded-lg hover:bg-amber-600 hover:scale-105 active:scale-95"
          >
            Xem Chi Tiết
          </Link>

        </div>
      </div>
    </div>
  )
}
