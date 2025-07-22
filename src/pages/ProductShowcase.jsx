import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../core/services/ProductService';
import { categoryService } from '../core/services/CategoryService';
import { CustomCard } from '../components/cards/CustomCard';

export default function ProductShowcase() {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories().then(res => res.data.data),
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

  return (
    <section className="px-4 md:px-24 py-16 space-y-24 bg-section text-main text-base">
      {/* Danh Mục Sản Phẩm */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-600 mb-3">Danh Mục Sản Phẩm</h2>
          <p className="text-heading max-w-2xl mx-auto">
            Khám phá các loại bánh đa dạng, được làm thủ công mỗi ngày từ nguyên liệu tươi ngon nhất.
          </p>
        </div>

        {loadingCategories ? (
          <p className="text-center text-sub">Đang tải danh mục...</p>
        ) : (
          
            <div className="px-24">
              <div className="grid grid-cols-4 gap-12">
            {enrichedCategories.map((cat) => (
              <div
                key={cat.categoryId}
                className="bg-white rounded-xl shadow-md border border-orange-100 transition hover:-translate-y-1"
              >
                <img
                  src={
                    cat.img && cat.img.trim() !== ''
                      ? cat.img
                      : 'https://i.pinimg.com/736x/19/33/80/1933806d5ccb3e262fae2feadabe593a.jpg'
                  }
                  alt={cat.name}
                  className="h-40 w-full object-cover object-center rounded-t-xl"
                />
                <div className="p-4 text-center">
                  <h4 className="text-base font-semibold text-main truncate">{cat.name}</h4>
                  <p className="text-sm text-sub mt-1">Khám phá ngay</p>
                </div>
              </div>
            ))}
          </div>
            </div>
          
        )}
      </div>

      {/* Sản Phẩm Bán Chạy */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-600 mb-3">Sản Phẩm Bán Chạy</h2>
          <p className="text-heading max-w-xl mx-auto">
            Những chiếc bánh được yêu thích và đặt nhiều nhất gần đây.
          </p>
        </div>

        {loadingProducts ? (
          <p className="text-center text-sub">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-4 gap-12">
            {enrichedHotProducts.map(product => (
              <div key={product.productId} className="">
                <CustomCard product={product} tag="Hot" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Xem tất cả */}
      <div className="flex justify-center mt-10">
        <Link
          to="/products"
          className="btn-primary"
        >
          Xem tất cả các sản phẩm
        </Link>
      </div>

      {/* Sản phẩm yêu thích */}
      <div className="">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-600 mb-3">Sản Phẩm Yêu Thích</h2>
          <p className="text-heading max-w-xl mx-auto">
            Những chiếc bánh được khách hàng đánh giá cao và yêu thích nhất.
          </p>
        </div>

        {loadingProducts ? (
          <p className="text-center text-sub">Đang tải sản phẩm yêu thích...</p>
        ) : (
          <div className="grid grid-cols-4 gap-12">
            {enrichedFavProducts.map(product => (
              <div key={product.productId} className="">
                <CustomCard product={product} tag="Yêu thích" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
