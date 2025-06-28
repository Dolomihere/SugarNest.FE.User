// src/components/ProductShowcase.jsx

import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import CategoryService from '../../../services/CategoryService'
import ProductService from '../../../services/ProductService'
import CustomCard from '../../../components/CustomCard';

export function ProductShowcase() {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllCategories().then(res => res.data.data),
  })

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getAllProducts().then(res => res.data.data),
  })

  const demoCategories = Array.from({ length: 8 }, (_, i) => ({
    categoryId: `demo-cat-${i}`,
    name: `Bánh Mẫu ${i + 1}`,
    img: `https://i.pinimg.com/736x/32/27/61/322761c59b52a2f0e4cce7a06347b65a.jpg`,
  }))

  const enrichedCategories = (categories.length >= 4 ? categories : demoCategories).slice(0, 4)

  const demoHotProducts = Array.from({ length: 4 }, (_, i) => ({
    productId: `hot-${i}`,
    name: `Bánh Hot ${i + 1}`,
    imgs: `https://i.pinimg.com/736x/8b/ba/e7/8bbae712ed51359ef8a109318b05838d.jpg`,
    unitPrice: (10 + i).toFixed(2),
  }))

  const demoFavProducts = Array.from({ length: 6 }, (_, i) => ({
    productId: `fav-${i}`,
    name: `Bánh Yêu Thích ${i + 1}`,
    imgs: `https://i.pinimg.com/736x/b9/09/4d/b9094dc229550d7d7a661a73edd99e5f.jpg`,
    unitPrice: (12 + i).toFixed(2),
  }))

  const hotProducts = products.filter(p => p.activeStatus === 1)
  const enrichedHotProducts = hotProducts.length >= 4
    ? hotProducts.slice(0, 4)
    : [...hotProducts, ...demoHotProducts.slice(0, 4 - hotProducts.length)]

  const favoriteProducts = products.filter(p => p.favorite === true)
  const enrichedFavProducts = (
    favoriteProducts.length >= 4
      ? favoriteProducts
      : [...favoriteProducts, ...demoFavProducts.slice(0, 4 - favoriteProducts.length)]
  ).slice(0, 4)

  const ProductCard = ({ product, tag, size = 'md' }) => {
    const sizeClass = size === 'sm' ? 'h-36' : 'h-48'

    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg transition duration-300 transform hover:-translate-y-1 border border-orange-100">
        <img
          className={`${sizeClass} w-full object-cover object-center`}
          src={product.imgs || '/placeholder.jpg'}
          alt={product.name}
        />
        <div className="p-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="inline-block bg-[#fbd5a8] text-[#5C3A21] py-0.5 px-2 text-xs rounded-full font-semibold">
              {tag}
            </span>
            <div className="text-[#A78D72] text-xs font-semibold">
              ⭐ {Math.floor(Math.random() * 100)} lượt mua
            </div>
          </div>
          <h4 className="font-semibold text-base leading-snug truncate text-[#5C3A21]">{product.name}</h4>
          <div className="mt-1 text-[#5C3A21] text-sm">
            <span>${product.unitPrice}</span>
            <span className="text-xs text-[#A78D72]"> / cái</span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-[#D08850] space-x-1 text-xs">
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="far fa-star" />
            </span>
            <span className="ml-2 text-xs text-[#A78D72]">34 đánh giá</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-20 px-10 my-10 bg-orange-50/20 text-[#5C3A21] text-lg">
<<<<<<<<< Temporary merge branch 1

      <div className="space-y-10">

        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-amber-600 mb-4">Danh Mục Sản Phẩm</h2>
=========
      <div className="space-y-10">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-amber-600">Danh Mục Sản Phẩm</h2>
>>>>>>>>> Temporary merge branch 2
          <p className="text-[#7D5A3A]">
            Khám phá các loại bánh đa dạng, được làm thủ công mỗi ngày từ nguyên liệu tươi ngon nhất.
          </p>
        </div>
<<<<<<<<< Temporary merge branch 1

        <div className="max-w-6xl mx-auto">

          {loadingCategories ? (
            <p className="text-center text-[#A78D72]">Đang tải danh mục...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">

              {enrichedCategories.map((cat, index) => (
                <div
                  key={cat.categoryId}
                  className="w-[187px] rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 bg-white/70 border border-orange-100"
=========
        <div className="max-w-6xl mx-auto">
          {loadingCategories ? (
            <p className="text-center text-[#A78D72]">Đang tải danh mục...</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4 place-items-center">
              {enrichedCategories.map((cat, index) => (
                <div
                  key={cat.categoryId}
                  className="w-[187px] flex-shrink-0 snap-start mr-4 last:mr-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 bg-white/70 border border-orange-100"
>>>>>>>>> Temporary merge branch 2
                >
                  <img
                    src={cat.img || '/placeholder.jpg'}
                    alt={cat.name}
<<<<<<<<< Temporary merge branch 1
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 text-center font-semibold">{cat.name}</div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      <div className="space-y-10">

        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-amber-600 mb-4">Sản Phẩm Bán Chạy</h2>
          <p className="text-[#7D5A3A]">Những chiếc bánh được yêu thích và đặt nhiều nhất gần đây.</p>
        </div>

        <div div className="max-w-6xl mx-auto">

          {loadingProducts ? (
            <p className="text-center text-[#A78D72]">Đang tải sản phẩm...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {enrichedHotProducts.map(product => (
                <div
                  key={product.productId}
                  className="rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 bg-white/70 border border-orange-100"
                >
                  <img
                    src={product.imgs || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 text-center font-semibold">
                    <h3>{product.name}</h3>
                    <p className="text-[#C06014] font-medium mt-1">${product.unitPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
        
=========
                    className="object-cover w-full h-40"
                  />
                  <div className="p-4 font-semibold text-center">{cat.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-10">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-amber-600">Sản Phẩm Bán Chạy</h2>
          <p className="text-[#7D5A3A]">Những chiếc bánh được yêu thích và đặt nhiều nhất gần đây.</p>
        </div>
        <div className="max-w-6xl mx-auto">
          {loadingProducts ? (
            <p className="text-center text-[#A78D72]">Đang tải sản phẩm...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              {enrichedHotProducts.map(product => (
                <CustomCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
>>>>>>>>> Temporary merge branch 2
      </div>

      {/* Xem tất cả */}
      <div className="flex justify-center mt-10">
        <Link
          to="/products"
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 text-lg rounded-lg transition"
        >
          Xem tất cả các sản phẩm
        </Link>
      </div>

      <div className="space-y-10">
<<<<<<<<< Temporary merge branch 1

        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-amber-600 mb-4">Sản Phẩm Yêu Thích</h2>
          <p className="text-[#7D5A3A]">Những chiếc bánh được khách hàng đánh giá cao và yêu thích nhất.</p>
        </div>

          {loadingProducts ? (
            <p className="text-center text-[#A78D72]">Đang tải sản phẩm yêu thích...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center p-5">
=========
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-amber-600">Sản Phẩm Yêu Thích</h2>
          <p className="text-[#7D5A3A]">Những chiếc bánh được khách hàng đánh giá cao và yêu thích nhất.</p>
        </div>
        <div className="max-w-6xl mx-auto">
          {loadingProducts ? (
            <p className="text-center text-[#A78D72]">Đang tải sản phẩm yêu thích...</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3 lg:grid-cols-4 place-items-center">
>>>>>>>>> Temporary merge branch 2
              {enrichedFavProducts.map(product => (
                <div
                  key={product.productId}
                  className="w-[187px] rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 bg-white/70 border border-orange-100"
                >
                  <img
                    src={product.imgs || '/placeholder.jpg'}
                    alt={product.name}
<<<<<<<<< Temporary merge branch 1
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 text-center font-semibold">
=========
                    className="object-cover w-full h-40"
                  />
                  <div className="p-4 font-semibold text-center">
>>>>>>>>> Temporary merge branch 2
                    <h3>{product.name}</h3>
                    <p className="text-[#C06014] font-medium mt-1">${product.unitPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
<<<<<<<<< Temporary merge branch 1

        </div>

=========
        </div>
>>>>>>>>> Temporary merge branch 2
      </div>
    </section>
  )
}
