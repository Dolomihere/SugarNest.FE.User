import { useQuery } from '@tanstack/react-query';
import { cartService } from '../core/services/CartService';

export function CartList({ token = null }) {
  const { data, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = !!token 
        ? await cartService.getUserCart(token) 
        : await cartService.getGuestCart()

      
    }
  });
}
