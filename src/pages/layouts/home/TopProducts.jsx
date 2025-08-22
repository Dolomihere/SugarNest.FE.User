import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductService from "../../../services/ProductService";
import FavoriteService from "../../../services/FavoriteService";
import { ProductCard } from "../../../components/ProductCard";

export function TopProducts() {
  const queryClient = useQueryClient();

  // Lấy sản phẩm sellable
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["productsSellable"],
    queryFn: () => ProductService.getAllProducts().then((res) => res.data.data),
  });

  // Top 4 sản phẩm active
  const hotProducts = products.filter((p) => p.isActive).slice(0, 4);

  // Lấy danh sách favorites
  const { data: favoritesData = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => FavoriteService.getFavorites().then((res) => res.data.data),
  });

  const addFavoriteMutation = useMutation({
    mutationFn: (productId) => FavoriteService.addFavorites([productId]),
    onSuccess: () => queryClient.invalidateQueries(["favorites"]),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (productId) => FavoriteService.removeFavorites([productId]),
    onSuccess: () => queryClient.invalidateQueries(["favorites"]),
  });

  const isFavorite = (productId) => favoritesData.some((fav) => fav.productId === productId);
  const addToFavorites = (productId) => addFavoriteMutation.mutate(productId);
  const removeFromFavorites = (productId) => removeFavoriteMutation.mutate(productId);

  return (
    <section className="px-4 py-16 space-y-10 text-base md:px-24 bg-[#FFF9F4] text-[#5A3E2B]">
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-3xl font-extrabold md:text-4xl text-red-500">Top Sản Phẩm</h2>
        <p className="max-w-xl mx-auto text-[#5A3E2B]">
          Những sản phẩm bán chạy và được khách hàng yêu thích nhất.
        </p>
      </div>

      {isLoading || favoritesLoading ? (
        <p className="text-center text-[#A47449]">Đang tải top sản phẩm...</p>
      ) : hotProducts.length === 0 ? (
        <p className="text-center text-[#A47449]">Không có sản phẩm nổi bật.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hotProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={{
                ...product,
                reviewCount: product.ratingCount,
                point: product.averageRatingPoint,
              }}
              viewMode="grid"
              isFavorite={isFavorite(product.productId)}
              onAddFavorite={() =>
                isFavorite(product.productId)
                  ? removeFromFavorites(product.productId)
                  : addToFavorites(product.productId)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}