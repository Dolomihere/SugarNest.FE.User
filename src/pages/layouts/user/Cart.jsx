import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FaTrashCan } from 'react-icons/fa6'

import { CartService } from '../../../services/CartService'

export function Cart() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = !!token;

  const { data: cartData, refetch: refetchCart } = useQuery({
    queryKey: ['userCart', token],
    queryFn: () => CartService.getUserCart(),
    enabled: isLoggedIn,
    select: res => res.data.data,
  });

  // const { data: products } = useQuery({
  //   queryKey: ['allProducts'],
  //   queryFn: ProductService.getAllProducts,
  //   select: res => res.data.data,
  // });

  // const updateQuantityMutation = useMutation({
  //   mutationFn: ({ cartItemId, quantity }) =>
  //     CartService.updateQuantity(cartItemId, quantity),
  //   onSuccess: () => refetchCart(),
  //   onError: () => setError('Không thể cập nhật số lượng.'),
  // });

  // const deleteItemMutation = useMutation({
  //   mutationFn: (cartItemId) => CartService.deleteItem(cartItemId),
  //   onSuccess: () => refetchCart(),
  //   onError: () => setError('Không thể xóa sản phẩm khỏi giỏ hàng.'),
  // });

  // const handleQuantityChange = (cartItemId, quantity) => {
  //   if (quantity < 1) return;
  //   updateQuantityMutation.mutate({ cartItemId, quantity });
  // };

  // const handleDelete = (cartItemId) => {
  //   deleteItemMutation.mutate(cartItemId);
  // };

  // const getProductImage = (productId) => {
  //   const product = products?.find(p => p.productId === productId);
  //   return product?.imgs?.[0] || '/images/placeholder.png';
  // };

  // const handleCheckout = () => {
  //   if (!cartData?.cartItems?.length) {
  //     return alert("Your cart is empty.");
  //   }
  //   navigate('/checkout');
  // };

  // const total = cartData?.cartItems?.reduce((acc, item) => acc + item.total, 0) ?? 0;

  return (
    <div className="h-full flex flex-col font-[Montserrat] bg-[#FFFDF9]">

      {cartData?.cartItems?.length ? (
        <>
          <h2 className="text-2xl font-bold text-[#5C4033] px-4 pt-6 border-b border-[#E8D3BD]">Giỏ hàng của bạn</h2>
          <div className="flex flex-col flex-1 gap-4 px-4 py-4 overflow-y-auto">

            {cartData.cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-[#E8D3BD]"
              >
                <img
                  src={getProductImage(item.productId)}
                  alt={item.productName}
                  className="object-cover w-24 h-24 rounded"
                />

                <div className="flex flex-col justify-between flex-1">

                  <div>
                    <h3 className="text-lg font-semibold text-[#5C4033]">{item.productName}</h3>
                    <p className="text-sm text-[#8B5E3C]">{item.note}</p>

                    {item.cartItemOptions?.length > 0 && (
                      <ul className="text-sm mt-1 list-disc list-inside text-[#8B5E3C]">
                        {item.cartItemOptions.map((opt) => (
                          <li key={opt.cartItemOptionId}>{opt.optionValue}</li>
                        ))}
                      </ul>
                    )}

                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)} className="px-2 py-1 border rounded cursor-pointer">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)} className="px-2 py-1 border rounded cursor-pointer">+</button>
                  </div>

                </div>

                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => handleDelete(item.cartItemId)} className="text-red-500 hover:text-red-700">
                    <FaTrashCan />
                  </button>
                  <p className="text-lg font-bold text-[#5C4033]">{item.total.toLocaleString()}đ</p>
                </div>

              </div>
            ))}

          </div>

          <div className="border-t border-[#E8D3BD] p-4 flex justify-between items-center">

            <div>
              <h3 className="text-base font-semibold text-[#5C4033]">Tổng cộng</h3>
              <p className="text-xl font-bold text-[#D2691E]">{total.toLocaleString()}đ</p>
            </div>

            <button 
              onClick={handleCheckout}
              className="bg-[#D9A16C] hover:bg-[#C98B55] text-white font-semibold px-6 py-2 rounded-lg cursor-pointer">
              Thanh toán
            </button>

          </div>
        </>
      ) : (
        <div className="self-center my-auto text-3xl">Giỏ hàng trống</div>
      )}

    </div>
  )
}
