import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import ProductService from '../../../services/ProductService'
import CartService from '../../../services/CartService'

import { authenticate, getUserIdFromToken } from '../../../utils/JwtVerify'

export function Cart() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => authenticate());
  const [cartItems, setCartItems] = useState([]);

  const userId = useMemo(() => {
    const token = localStorage.getItem('accessToken');
    return getUserIdFromToken(token);
  }, []);

  const { data: userCart, refetch: refetchUserCart } = useQuery({
    queryKey: ['user-cart'],
    queryFn: async () => {
      try {
        const res = await CartService.getUserCart(userId);
        return res.data.data;
      } catch (err) {
        if (err.response?.status === 404) {
          return { cartItems: [] };
        }
        throw err;
      }
    },
    enabled: isLoggedIn && !!userId,
    retry: (failureCount, error) => {
      return error.response?.status !== 404;
    },
    onSuccess: (data) => {
      setCartItems(data.cartItems);
    },
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => ProductService.getAllProducts().then(res => res.data.data),
    enabled: !isLoggedIn,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem('local_cart')) || [];
      setCartItems(localCart);
    }
  }, [isLoggedIn]);

  const getGuestPrice = (productId) => {
    const product = allProducts.find(p => p.productId === productId);
    return product?.unitPrice || 0;
  };

  const handleQuantityChange = (index, change) => {
    setCartItems(prev => {
      const updated = [...prev];
      const item = updated[index];
      const newQuantity = item.quantity + change;

      if (newQuantity < 1) {
        const filtered = updated.filter((_, i) => i !== index);

        if (isLoggedIn) {
          CartService.deleteCartItem(item.cartItemId);
        } else {
          localStorage.setItem('local_cart', JSON.stringify(filtered));
        }
        return filtered;
      } else {
        updated[index] = { ...item, quantity: newQuantity };

        if (isLoggedIn) {
          CartService.updateCartQuantity(item.cartItemId, newQuantity);
        } else {
          localStorage.setItem('local_cart', JSON.stringify(updated));
        }
        return updated;
      }
    });
  };

  const handleDelete = (index) => {
    const item = cartItems[index];

    if (isLoggedIn) {
      CartService.deleteCartItem(item.cartItemId).then(refetchUserCart);
    } else {
      const updated = [...cartItems];
      updated.splice(index, 1);
      setCartItems(updated);
      localStorage.setItem('local_cart', JSON.stringify(updated));
    }
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const unitPrice = isLoggedIn ? item.unitPrice + (item.itemAdditionalPrice || 0) : getGuestPrice(item.productId);
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [cartItems, allProducts, isLoggedIn]);

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-2 space-y-4">

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Không có sản phẩm nào trong giỏ hàng.</p>
          ) : (
            cartItems.map((item, index) => {
              const productId = item.productId;
              const product = allProducts.find(p => p.productId === productId);
              const unitPrice = isLoggedIn
                ? item.unitPrice + (item.itemAdditionalPrice || 0)
                : product?.unitPrice || 0;
              const imageUrl = product?.imgs || 'https://via.placeholder.com/100';

              return (
                <div
                  key={index}
                  className="border p-4 rounded flex items-center gap-4"
                >
                  <img src={imageUrl} alt="product" className="w-20 h-20 object-cover rounded" />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName || product?.name || 'Sản phẩm'} {(item.quantity === 1) ? '' : `x ${item.quantity}`}</h3>

                    <div className="text-sm text-gray-500 mt-1">

                      {item.cartItemOptions?.map((opt, idx) => (
                        <div key={idx}>
                          {opt.optionGroupName}: <span className="italic">{opt.optionValue}</span>
                        </div>
                      ))}

                    </div>

                    <p className="text-sm text-gray-600">Giá: ${unitPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Tổng: ${(unitPrice * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQuantityChange(index, -1)} className="px-2 py-1 border rounded cursor-pointer">-</button>
                    <span className="mx-1">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(index, 1)} className="px-2 py-1 border rounded cursor-pointer">+</button>
                  </div>

                  <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 cursor-pointer">🗑</button>
                </div>
              );
            })
          )}
        
        </div>

        <div className="bg-gray-100 p-6 rounded shadow-md">

          <h3 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h3>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Tổng cộng:</span>
            <span className="font-bold">${cartTotal.toFixed(2)}</span>
          </div>

          <button
            className="mt-4 w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            disabled={cartItems.length === 0}
          >
            Thanh toán
          </button>

        </div>

      </div>
    </div>
  )
}
