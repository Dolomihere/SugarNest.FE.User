import { useState, useEffect } from 'react';

export function PaymentPage() {
  const [isSuccess, setIsSuccess] = useState(false); // bạn có thể set từ props, URL param, hoặc API real-time

  // Redirect tự động sau 3 giây nếu thanh toán thành công
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FFF9F4] px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#F1D9C0] w-full max-w-md px-8 py-12 text-center animate-fade-in">

        {/* Logo */}
        <div className="flex justify-center items-center mb-6">
          <img
            src="/images/logo_bakery.jpg"
            alt="SugarNest Logo"
            className="h-10"
          />
        </div>

        {/* Success Case */}
        {isSuccess ? (
          <>
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full shadow-inner">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#5C4033] mb-2">Thanh toán thành công!</h2>
            <p className="text-sm text-[#8B5E3C] mb-4">
              Quý khách vui lòng <span className="font-bold text-red-600">KHÔNG</span> tắt trình duyệt.
            </p>
            <p className="text-sm text-gray-500 italic">
              Trở lại trang mua hàng trong vài giây… Xin vui lòng chờ.
            </p>

            <div className="my-6 border-t border-dashed border-[#E8D3BD]"></div>

            <div className="text-left text-sm text-[#5C4033] space-y-2">
              <p><strong>Nhà cung cấp:</strong> Techcent.vn</p>
              <p><strong>Số tiền:</strong> 100.000đ</p>
              <p><strong>Thông tin đơn hàng:</strong> Flowbite Studios</p>
            </div>
          </>
        ) : (
          <>
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full shadow-inner">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại</h2>
            <p className="text-sm text-[#5C4033] mb-4">
              Giao dịch không hoàn tất. Vui lòng thử lại hoặc kiểm tra phương thức thanh toán.
            </p>
            <p className="text-sm text-gray-500 italic">
              Nếu tiền đã bị trừ, hệ thống sẽ hoàn lại trong vòng 1–3 ngày làm việc.
            </p>

            <div className="my-6 border-t border-dashed border-[#E8D3BD]"></div>

            <div className="text-left text-sm text-[#5C4033] space-y-2">
              <p><strong>Mã lỗi:</strong> #PAY_FAILED_001</p>
              <p><strong>Thời gian:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Trạng thái:</strong> Chưa thanh toán</p>
            </div>
          </>
        )}

        {/* Button */}
        <div className="mt-8">
          <button
            className="w-full bg-[#D9A16C] hover:bg-[#C98B55] text-white font-semibold py-2 px-4 rounded-lg transition shadow"
            onClick={() => window.location.href = isSuccess ? '/' : '/checkout'}
          >
            {isSuccess ? 'Quay về trang chủ' : 'Thử lại thanh toán'}
          </button>
        </div>

      </div>
    </section>
  );
}
