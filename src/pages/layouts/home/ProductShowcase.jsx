import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import CategoryService from '../../../services/CategoryService'
import ProductService from '../../../services/ProductService'

export function ProductShowcase() {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllCategories().then(res => res.data.data),
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getAllProducts().then(res => res.data.data),
  });

  const hotProducts = products
    .filter(p => p.activeStatus === 1)
    .slice(0, 4);

  return (
    <section className="px-4 py-16 space-y-16">

      <div>
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh Mục Sản Phẩm</h2>
          <p>Khám phá các loại bánh đa dạng của chúng tôi, được làm thủ công mỗi ngày với nguyên liệu tươi ngon nhất</p>
        </div>

        {loadingCategories ? (
          <p>Đang tải danh mục...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {categories.map(cat => (
              <div key={cat.categoryId} className="rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <img
                  src={cat.img || '/placeholder.jpg'}
                  alt={cat.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 text-center font-semibold text-gray-700">{cat.name}</div>
              </div>
            ))}

          </div>
        )}

      </div>

      <div>
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sản Phẩm Bán Chạy</h2>
          <p>Những sản phẩm được yêu thích nhất và được đặt hàng nhiều nhất từ khách hàng của chúng tôi</p>
        </div>

        {loadingProducts ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {hotProducts.map(product => (
              <div key={product.productId} className="rounded-lg overflow-hidden border hover:shadow transition">

                <img
                  src={product.imgs}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-pink-600 font-medium mt-1">${product.unitPrice}</p>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link
          to="/products"
          className="bg-pink-600 text-white px-8 py-3 text-lg rounded-lg hover:bg-pink-700 transition"
        >
          Xem tất cả các sản phẩm
        </Link>
      </div>

    </section>
  );
}
