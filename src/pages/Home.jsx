import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

import { AboutAndReviews } from './layouts/home/AboutAndReview'
import { ProductShowcase } from './layouts/home/ProductShowcase'

export function HomePage() {
  return(
    <div className="min-h-dvh flex flex-col">

      <Header />

      <div className="flex-1 max-w-7xl mx-auto">
        <section className="px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"> 
            
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Bánh Ngọt <span>Tuyệt Hảo</span><br />Cho Mọi Dịp
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Tận hưởng hương vị độc đáo từ những chiếc bánh thủ công được làm từ nguyên liệu tươi ngon nhất, với công thức bí truyền hơn 20 năm.
            </p>
            <button className="bg-pink-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-pink-700 transition cursor-pointer">
              Đặt bánh ngay
            </button>
          </div>

          <div className="hidden md:flex justify-center">
            <img
              src="/hero-bakery.png"
              alt="Delicious cake"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </div>

        </section>

        <ProductShowcase />

        <AboutAndReviews />

      </div>

      <section className="bg-pink-100 text-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Khuyến Mãi</h2>

          <p className="mb-6 text-lg">
            Nhận thông tin về các sản phẩm mới và chương trình khuyến mãi đặc biệt. Đăng ký ngay để nhận được voucher giảm giá 10% cho đơn hàng đầu tiên.
          </p>

          <form className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <input
              id="email"
              type="email"
              required
              placeholder="Email của bạn"
              className="px-4 py-2 w-full sm:w-2/3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <button
              type="submit"
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Đăng ký
            </button>

          </form>

          <p className="mt-6 text-lg">Chúng tôi cam kết bảo mật thông tin của bạn và không chia sẻ với bên thứ ba.</p>

        </div>
      </section>

      <Footer />

    </div>
  )
}
