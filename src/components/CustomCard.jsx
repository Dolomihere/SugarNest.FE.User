import { Link } from 'react-router-dom';

export function CustomCard({ product, tag }) {
  // Handle multiple possible image fields
  const imageUrl = Array.isArray(product.imgs) && product.imgs.length > 0
    ? product.imgs[0]
    : product.img && product.img.trim() !== ''
    ? product.img
    : product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : 'https://i.pinimg.com/736x/19/33/80/1933806d5ccb3e262fae2feadabe593a.jpg';

  // Convert rating (0–5) to star representation
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
    return stars;
  };

  return (
    <Link to={`/products/${product.productId}`} className="antialiased text-gray-900 cursor-pointer">
      <div className="bg-white rounded-lg overflow-hidden shadow-2xl group transition-transform duration-300 hover:translate-y-[-10px]">
        <div className="relative w-full h-32 overflow-hidden">
          <img
            className="h-full w-full object-cover transform overflow-hidden transition-transform duration-[300ms] hover:scale-115 object-end"
            src={imageUrl}
            alt={product.name || 'Product'}
            onError={(e) => {
              e.target.src = 'https://i.pinimg.com/736x/19/33/80/1933806d5ccb3e262fae2feadabe593a.jpg';
            }}
          />
          <span className="absolute px-2 py-1 text-xs font-semibold text-white rounded-full top-2 left-2 bg-amber-500">
            {tag}
          </span>
        </div>

        <div className="p-6 pb-4 group-hover:bg-gray-100 duration-[0.3s]">
          <div className="mt-1 group-hover:text-gray-800">
            <span className="text-2xl font-semibold group-hover:text-inherit">
              {Number(product.unitPrice || 0).toFixed(2)}đ
            </span>
          </div>

          <h4 className="mt-1 font-bold text-xl leading-tight truncate text-amber-600 shadow-gray-300 duration-[0.3s]">
            {product.name || 'Unnamed Product'}
          </h4>

          <p className="mt-2 text-gray-500 Card-info">
            {product.description || 'A delicious treat crafted with the finest ingredients.'}
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-amber-500">{renderStars(product.point)}</span>

            <div className="flex items-center text-gray-600">
              <span className="text-sm text-inherit group-hover:text-inherit">
                {product.reviewCount || 0} reviews
              </span>
              <span className="flex items-center ml-4 text-sm text-inherit group-hover:text-inherit">
                {product.reviewCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}