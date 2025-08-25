import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CategoryService from '../../../services/CategoryService';
import ProductService from '../../../services/ProductService';
import FavoriteService from '../../../services/FavoriteService';
import { ProductCard } from '../../../components/ProductCard';

export function ProductShowcase() {
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllCategories().then((res) => res.data.data),
  });

  // Fetch all products
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getAllProducts().then((res) => res.data.data),
  });

  // Get first 4 products for hot products section
  const hotProducts = products
    .filter((p) => p.activeStatus === 1)
    .slice(0, 4);

  // Fetch ratings for hot products
  const { data: ratingsData = [], isLoading: loadingRatings, isError: errorRatings } = useQuery({
    queryKey: ['productRatings', hotProducts],
    queryFn: async () => {
      if (!hotProducts.length) return [];
      const ratingPromises = hotProducts.map((product) =>
        ProductService.getProductRating(product.productId)
          .then((res) => ({
            productId: product.productId,
            reviewCount: res.data?.data?.reviewCount || 0,
            point: res.data?.data?.point || 0,
          }))
          .catch(() => ({ productId: product.productId, reviewCount: 0, point: 0 }))
      );
      return Promise.all(ratingPromises);
    },
    enabled: !!hotProducts.length,
    retry: 0,
  });

  // Fetch favorites
  const { data: favoritesData = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => FavoriteService.getFavorites().then((res) => res.data.data),
  });

  const addFavoriteMutation = useMutation({
    mutationFn: (productId) => FavoriteService.addFavorites([productId]),
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (productId) => FavoriteService.removeFavorites([productId]),
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });

  const isFavorite = (productId) => favoritesData.some((fav) => fav.productId === productId);

  const addToFavorites = (productId) => addFavoriteMutation.mutate(productId);
  const removeFromFavorites = (productId) => removeFavoriteMutation.mutate(productId);

  // Enrich hot products with ratings
  const enrichedHotProducts = (!loadingProducts && !loadingRatings && !errorRatings && !favoritesLoading)
    ? hotProducts.map((product) => {
        const rating = ratingsData.find((r) => r.productId === product.productId) || { reviewCount: 0, point: 0 };
        return { ...product, reviewCount: rating.reviewCount, point: rating.point };
      })
    : [];

  // Enrich categories
  const enrichedCategories = categories.length >= 4 ? categories.slice(0, 4) : categories;

  // Enrich favorite products
  const favoriteProducts = products.filter((p) => isFavorite(p.productId));
  const enrichedFavProducts = favoriteProducts.length >= 4
    ? favoriteProducts.slice(0, 4)
    : favoriteProducts;

  return (
    <section className="px-4 py-16 space-y-24 text-base md:px-24 bg-[#FFF9F4] text-[#5A3E2B]">
      {/* Danh Mục Sản Phẩm */}
      <div>
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-extrabold md:text-4xl text-amber-600">Danh Mục Sản Phẩm</h2>
          <p className="max-w-xl mx-auto text-heading">
            Khám phá các loại bánh đa dạng, được làm thủ công mỗi ngày từ nguyên liệu tươi ngon nhất.
          </p>
        </div>

        {loadingCategories ? (
          <p className="text-center text-sub">Đang tải danh mục...</p>
        ) : (
          <div className="px-24">
            <div className="grid grid-cols-4 gap-12">
              {enrichedCategories.map((cat) => {
                const imageUrl =
                  cat.img && cat.img.trim() !== ''
                    ? cat.img
                    : cat.imgs?.[0] || cat.imageUrls?.[0] || 'https://i.pinimg.com/736x/19/33/80/1933806d5ccb3e262fae2feadabe593a.jpg';

                return (
                  <Link to={`/category/${cat.categoryId}`} key={cat.categoryId}>
                    <div className="transition bg-white border border-orange-100 shadow-md rounded-xl hover:-translate-y-1">
                      <img
                        src={imageUrl}
                        alt={cat.name}
                        className="object-cover object-center w-full h-40 rounded-t-xl"
                      />
                      <div className="p-4 text-center">
                        <h4 className="text-base font-semibold truncate text-main">{cat.name}</h4>
                        <p className="mt-1 text-sm text-sub">Khám phá ngay</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Top Sản Phẩm */}
      {enrichedHotProducts.length > 0 && (
        <div>
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-extrabold md:text-4xl text-rose-500">Top Sản Phẩm</h2>
            <p className="max-w-xl mx-auto text-[#5A3E2B]">
              Những chiếc bánh nổi bật được nhiều khách hàng lựa chọn.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {enrichedHotProducts.map((product) => (
              <div key={product.productId} className="max-w-sm">
                <ProductCard
                  product={product}
                  viewMode="grid"
                  isFavorite={isFavorite(product.productId)}
                  onAddFavorite={() =>
                    isFavorite(product.productId)
                      ? removeFromFavorites(product.productId)
                      : addToFavorites(product.productId)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sản Phẩm Yêu Thích */}
      {enrichedFavProducts.length > 0 && (
        <div>
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-extrabold md:text-4xl text-[#E8B273]">Sản Phẩm Yêu Thích</h2>
            <p className="max-w-xl mx-auto text-[#5A3E2B]">
              Những chiếc bánh được khách hàng đánh giá cao và yêu thích nhất.
            </p>
          </div>

          <div
            className={`grid gap-6 ${
              enrichedFavProducts.length === 1
                ? 'grid-cols-1 justify-items-center'
                : enrichedFavProducts.length === 2
                ? 'grid-cols-2 justify-items-center'
                : enrichedFavProducts.length === 3
                ? 'grid-cols-3 justify-items-center'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {enrichedFavProducts.map((product) => (
              <div key={product.productId} className="max-w-sm">
                <ProductCard
                  product={product}
                  viewMode="grid"
                  isFavorite={isFavorite(product.productId)}
                  onAddFavorite={() =>
                    isFavorite(product.productId)
                      ? removeFromFavorites(product.productId)
                      : addToFavorites(product.productId)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
