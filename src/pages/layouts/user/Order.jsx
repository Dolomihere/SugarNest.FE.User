import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import OrderService from '../../../services/OrderService'
import ProductService from '../../../services/ProductService'

export function Order() {
  const orderId = "5B5FEE37-1EB2-4FA3-EE20-08DDB474117B"
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  const { data: order, isLoading: loadingOrder, error: orderError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => OrderService.getOrderById(orderId),
    select: res => res.data?.data ?? {},
    enabled: !!token,
  });

  const { data: products = [], isLoading: loadingProducts, error: productsError } = useQuery({
    queryKey: ['allProducts'],
    queryFn: ProductService.getAllProducts,
    select: res => res.data?.data ?? [],
  });

  const getProductImage = (productId) => {
    const product = products?.find(p => p?.productId === productId);
    return product?.imgs?.[0] || '/images/placeholder.png';
  };

  if (!token) return <div className="text-center text-red-500 py-8">Chưa đăng nhập</div>;

  if (loadingOrder || loadingProducts) {
    return <div className="text-center py-10 text-gray-600">Đang tải dữ liệu đơn hàng...</div>;
  }

  if (orderError || productsError) {
    return (
      <div className="text-center text-red-600 py-10">
        Đã xảy ra lỗi khi tải dữ liệu.<br />
        {orderError?.message || productsError?.message || 'Lỗi không xác định'}
      </div>
    );
  }

  const {
    address = 'Không có',
    phoneNumber = 'Không có',
    email = 'Không có',
    deliveryTime = new Date().toISOString(),
    note = 'Không có ghi chú',
    status = 0,
    total = 0,
    orderItems = [],
  } = order || {};

  return (
    <div className="font-[Montserrat] bg-[#FFFDF9] p-4">
      <h2 className="text-2xl font-bold text-[#5C4033] mb-4">Chi tiết đơn hàng</h2>

      <div className="text-[#5C4033] space-y-1 mb-6">
        <p><strong>Địa chỉ:</strong> {address}</p>
        <p><strong>Số điện thoại:</strong> {phoneNumber}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Giao hàng:</strong> {new Date(deliveryTime).toLocaleDateString()}</p>
        <p><strong>Ghi chú:</strong> {note}</p>
        <p><strong>Trạng thái:</strong> {status === 0 ? 'Đang xử lý' : 'Khác'}</p>
      </div>

      {orderItems.length === 0 ? (
        <div className="text-center text-gray-500">Không có sản phẩm trong đơn hàng này.</div>
      ) : (
        <div className="space-y-4">
          {orderItems.map((item) => (
            <div
              key={item?.orderItemId}
              className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-[#E8D3BD]"
            >
              <img
                src={getProductImage(item?.productId)}
                alt={item?.productName || 'Sản phẩm'}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#5C4033]">{item?.productName || 'Tên không rõ'}</h3>
                  <p className="text-sm text-[#8B5E3C]">Số lượng: {item?.quantity ?? 0}</p>
                  <p className="text-sm text-[#8B5E3C]">Đơn giá: {(item?.unitPrice ?? 0).toLocaleString()}đ</p>

                  {item?.orderItemOptions?.length > 0 && (
                    <ul className="text-sm mt-1 list-disc list-inside text-[#8B5E3C]">
                      {item.orderItemOptions.map((opt, idx) => (
                        <li key={idx}>{opt?.optionValue || 'Tuỳ chọn không rõ'}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-end">
                <p className="text-lg font-bold text-[#5C4033]">{(item?.total ?? 0).toLocaleString()}đ</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-[#E8D3BD] mt-6 pt-4 flex justify-end">
        <div>
          <h3 className="text-base font-semibold text-[#5C4033]">Tổng cộng</h3>
          <p className="text-xl font-bold text-[#D2691E]">{total.toLocaleString()}đ</p>
        </div>
      </div>
    </div>
  )
}
