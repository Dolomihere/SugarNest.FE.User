import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductService from "../services/ProductService";
import { ProductCard } from "../components/ProductCard";

export function CategoryPage() {
  const { categoryId } = useParams();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["categoryProducts", categoryId],
    queryFn: () =>
      ProductService.getProductsByCategory(categoryId).then((res) => res.data.data),
  });

  if (isLoading) return <p className="text-center">Đang tải sản phẩm...</p>;

  return (
    <section className="px-4 py-16 space-y-8 text-base md:px-24">
      <h2 className="mb-6 text-3xl font-bold text-amber-600">Sản Phẩm Danh Mục</h2>
      {products.length === 0 ? (
        <p className="text-center">Chưa có sản phẩm nào trong danh mục này.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} viewMode="grid" />
          ))}
        </div>
      )}
    </section>
  );
}
