import { useQuery } from '@tanstack/react-query';
import { productService } from '../core/services/ProductService';
import ProductCard from './cards/ProductCard';

export function ProductList({ params }) {
  const { data, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: async () => await productService.getAll(params)
  });

  if (isLoading) return <div>Loading...</div>

  console.log(data.data)

  return (
    <div className="grid grid-cols-4 p-10">
      {data.data.map((product) => (
        <ProductCard key={product.productId} product={product}></ProductCard>
      ))}
    </div>
  );
}
