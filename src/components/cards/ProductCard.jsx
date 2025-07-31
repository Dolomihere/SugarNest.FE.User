import { Link } from 'react-router-dom';
import StarRating from '../StarRating';

export default function ProductCard({ product }) {

  return (
    <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      
      <Link className="relative flex h-60 overflow-hidden" to={`/products/${product.productId}`}>

        {product.imgs.length > 0 
        ? <img className="object-cover" src={product.imgs[0]} alt="product_image" />
        : <div className="w-100 grid place-content-center">
            <svg className="w-30 h-30 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
            </svg>
          </div>
        }

        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">- {product.discountAmount} Đ</span>
      </Link>

      <div className="px-5 pb-5">
        <Link to={`/products/${product.productId}`}><h5 className="mt-2 text-xl tracking-tight text-slate-900">{product.name}</h5></Link>

        <div className="mt-2 mb-5 flex items-center justify-between">
            <span className="text-3xl font-bold text-slate-900">{product.finalUnitPrice.toLocaleString('en')} Đ</span>
            
            {product.discountAmount > 0 && <span className="text-sm text-slate-900 line-through">{product.unitPrice.toLocaleString('en')} Đ</span> }
        </div>

        <div className="flex items-center">
          <StarRating averageRating={product.averageRatingPoint}></StarRating>
          <span className="m-2">({product.averageRatingPoint})</span>
        </div>

        <a className="flex items-center justify-center cursor-pointer rounded-md mt-3 bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Thêm vào giỏ
        </a>

      </div>

    </div>
  );
}
