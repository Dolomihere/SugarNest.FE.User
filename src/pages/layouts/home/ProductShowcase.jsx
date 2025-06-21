import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CategoryService from '../../../services/CategoryService';
import ProductService from '../../../services/ProductService';

export function ProductShowcase() {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllCategories().then(res => res.data.data),
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getAllProducts().then(res => res.data.data),
  });

  const demoCategories = Array.from({ length: 8 }, (_, i) => ({
    categoryId: `demo-cat-${i}`,
    name: `Bánh Mẫu ${i + 1}`,
    img: `https://i.pinimg.com/736x/32/27/61/322761c59b52a2f0e4cce7a06347b65a.jpg`,
  }));

  const enrichedCategories = categories.length >= 8 ? categories : demoCategories;

  const demoHotProducts = Array.from({ length: 4 }, (_, i) => ({
    productId: `hot-${i}`,
    name: `Bánh Hot ${i + 1}`,
    imgs: `https://i.pinimg.com/736x/8b/ba/e7/8bbae712ed51359ef8a109318b05838d.jpg`,
    unitPrice: (10 + i).toFixed(2),
  }));

  const demoFavProducts = Array.from({ length: 6 }, (_, i) => ({
    productId: `fav-${i}`,
    name: `Bánh Yêu Thích ${i + 1}`,
    imgs: `https://i.pinimg.com/736x/b9/09/4d/b9094dc229550d7d7a661a73edd99e5f.jpg`,
    unitPrice: (12 + i).toFixed(2),
  }));

  const hotProducts = products.filter(p => p.activeStatus === 1);
  const enrichedHotProducts =
    hotProducts.length >= 4
      ? hotProducts.slice(0, 4)
      : [...hotProducts, ...demoHotProducts.slice(0, 4 - hotProducts.length)];

  const favoriteProducts = products.filter(p => p.favorite === true);
  const enrichedFavProducts =
    favoriteProducts.length >= 6
      ? favoriteProducts.slice(0, 6)
      : [...favoriteProducts, ...demoFavProducts.slice(0, 6 - favoriteProducts.length)];

  return (
    <section className="px-4 py-16 space-y-20 bg-orange-50/20 text-[#5C3A21] text-lg">

      {/* Danh Mục Sản Phẩm */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-amber-600 mb-4">Danh Mục Sản Phẩm</h2>
          <p className="text-[#7D5A3A]">
            Khám phá các loại bánh đa dạng, được làm thủ công mỗi ngày từ nguyên liệu tươi ngon nhất.
          </p>
        </div>

        {loadingCategories ? (
          <p className="text-center text-[#A78D72]">Đang tải danh mục...</p>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1">
            {enrichedCategories.map((cat, index) => (
              <div
                key={cat.categoryId}
                className="w-[187px] flex-shrink-0 snap-start mr-4 last:mr-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 bg-white/70 border border-orange-100"
              >
                <img
                  src={cat.img || '/placeholder.jpg'}
                  alt={cat.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center font-semibold">{cat.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sản Phẩm Bán Chạy */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-amber-600 mb-4">Sản Phẩm Bán Chạy</h2>
          <p className="text-[#7D5A3A]">Những chiếc bánh được yêu thích và đặt nhiều nhất gần đây.</p>
        </div>

        {loadingProducts ? (
          <p className="text-center text-[#A78D72]">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {enrichedHotProducts.map(product => (
              <div
                key={product.productId}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 bg-white/70 border border-orange-100"
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

      {/* Xem tất cả */}
      <div className="flex justify-center mt-10">
        <Link
          to="/products"
          className="bg-[#C06014] text-white px-8 py-3 text-lg rounded-lg hover:bg-[#a35010] transition"
        >
          Xem tất cả các sản phẩm
        </Link>
      </div>

      {/* Sản phẩm yêu thích */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-amber-600 mb-4">Sản Phẩm Yêu Thích</h2>
          <p className="text-[#7D5A3A]">Những chiếc bánh được khách hàng đánh giá cao và yêu thích nhất.</p>
        </div>

        {loadingProducts ? (
          <p className="text-center text-[#A78D72]">Đang tải sản phẩm yêu thích...</p>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1">
            {enrichedFavProducts.map(product => (
              <div
                key={product.productId}
                className="w-[187px] flex-shrink-0 snap-start mr-4 last:mr-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 bg-white/70 border border-orange-100"
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

    </section>
  );
}
