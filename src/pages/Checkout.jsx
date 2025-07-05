import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import OrderService from '../services/OrderService'
import CartService from '../services/CartService'

export function CheckoutPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: '',
    phoneNumber: '',
    email: '',
    deliveryTime: '',
    note: '',
    userVoucher: '',
  });
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken;

  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn) {
        try {
          const res = await CartService.getUserCart(accessToken);
          setCartItems(res.data.data.cartItems || []);
        } catch (err) {
          console.error('Failed to load cart', err);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('local_cart')) || [];
        setCartItems(localCart);
      }
    };

    loadCart();
  }, [isLoggedIn]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setError('Bạn cần đăng nhập trước khi thanh toán.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        deliveryTime: form.deliveryTime || null,
        note: form.note || null,
        userVoucher: form.userVoucher || null,
      };

      await OrderService.createOrder(payload, accessToken);
      navigate('/user');
    } catch (err) {
      console.error(err);
      setError('Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.total, 0).toFixed(2);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">

      <div>
        <h2 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" required className="w-full border p-2 rounded" />
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" required className="w-full border p-2 rounded" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full border p-2 rounded" />
          <input name="deliveryTime" type="date" value={form.deliveryTime} onChange={handleChange} className="w-full border p-2 rounded" />
          <textarea name="note" value={form.note} onChange={handleChange} placeholder="Ghi chú (tùy chọn)" className="w-full border p-2 rounded" />
          <input name="userVoucher" value={form.userVoucher} onChange={handleChange} placeholder="Mã giảm giá (nếu có)" className="w-full border p-2 rounded" />

          {error && <div className="text-red-600">{error}</div>}

          <button type="submit" disabled={loading} className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 w-full">
            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </form>
      </div>

      <div className="bg-gray-50 p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Sản phẩm đã chọn</h3>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Giỏ hàng trống.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, idx) => (
              <div key={idx} className="border-b pb-2">
                <div className="font-medium">{item.productName}</div>
                {item.cartItemOptions?.length > 0 && (
                  <ul className="text-sm text-gray-500 mt-1">
                    {item.cartItemOptions.map((opt, i) => (
                      <li key={i}>- {opt.optionGroupName}: {opt.optionValue}</li>
                    ))}
                  </ul>
                )}
                <div className="text-sm text-gray-700 mt-1">
                  Số lượng: {item.quantity} × {(item.unitPrice + item.itemAdditionalPrice).toFixed(2)}₫
                </div>
                <div className="text-right font-semibold">{item.total.toFixed(2)}₫</div>
              </div>
            ))}

            <div className="mt-4 border-t pt-4 text-right text-lg font-bold">
              Tổng cộng: {calculateTotal()}₫
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
