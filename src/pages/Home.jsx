import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

import { AboutAndReviews } from './layouts/home/AboutAndReview'
import { ProductShowcase } from './layouts/home/ProductShowcase'

export function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col font-sans bg-orange-50/70 text-stone-800">
      
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4">

        {/* Hero Section */}
        <section className="py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#5C3A21] mb-6 leading-tight">
              Bánh Ngọt <span className="text-amber-600">Tuyệt Hảo</span><br />
              Cho Mọi Dịp
            </h1>

            <p className="text-lg text-stone-600 mb-6 max-w-prose">
              Hãy để mỗi khoảnh khắc trong cuộc sống thêm phần ngọt ngào với những chiếc bánh thủ công tinh tế từ chúng tôi được chế biến từ nguyên liệu tự nhiên, kết hợp giữa hương vị truyền thống và sự sáng tạo hiện đại trong từng lớp bánh.
            </p>

             <p className="text-lg text-stone-600 mb-6 max-w-prose">
            Từ những chiếc bánh sinh nhật rực rỡ, bánh cưới sang trọng cho đến các món tráng miệng thường ngày, mỗi sản phẩm đều là một tác phẩm nghệ thuật được làm bằng cả trái tim. Chúng tôi không chỉ mang đến hương vị tuyệt vời, mà còn trao gửi yêu thương và sự chăm chút trong từng chi tiết nhỏ nhất.           
             </p>

             <p className="text-lg text-stone-600 mb-6 max-w-prose">Hãy cùng chúng tôi lan tỏa niềm vui, chia sẻ những khoảnh khắc ý nghĩa, và tạo nên những kỷ niệm ngọt ngào không thể nào quên.</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-amber-500 hover:bg-amber-600 transition text-white px-6 py-3 rounded-xl text-lg shadow-md hover:shadow-lg cursor-pointer">
                Đặt bánh ngay
              </button>
              <button className="text-amber-600 border border-amber-300 px-6 py-3 rounded-xl text-lg hover:bg-amber-100 transition cursor-pointer">
                Liên hệ với chúng tôi
              </button>
            </div>

          </div>

          <div className="hidden md:flex justify-center items-center h-full">
            <img
              src="https://i.pinimg.com/736x/f3/40/aa/f340aa237513bc33d67074f674b2305a.jpg"
              alt="Delicious cake"
              className="h-auto w-[600px] rounded-2xl shadow-xl object-cover"
            />
          </div>

        </section>

        {/* Danh mục + Sản phẩm yêu thích */}
        <ProductShowcase />

        {/* Giới thiệu + đánh giá */}
        <AboutAndReviews />

      </div>

      {/* Subscription Section */}
      <section className="bg-orange-100/50 text-stone-800 py-10 px-6">
        <div className="max-w-4xl mx-auto text-center rounded-3xl bg-white p-10 shadow-xl border border-amber-200">

          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-4">
            Đăng Ký Nhận Khuyến Mãi
          </h2>

          <p className="mb-8 text-lg text-stone-600">
            Đừng bỏ lỡ những chiếc bánh mới nhất cùng các ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đăng ký nhận tin. 
            Bạn sẽ nhận ngay <span className="font-semibold text-amber-700">voucher giảm 10%</span> cho đơn đầu tiên!
          </p>

          <form className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              required
              placeholder="Email của bạn"
              className="px-5 py-3 w-full sm:w-2/3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-stone-700 placeholder-stone-400"
            />
            <button
              type="submit"
              className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition font-medium shadow-md hover:shadow-lg cursor-pointer"
            >
              Đăng ký
            </button>
          </form>
          
          <p className="mt-6 text-sm text-stone-500 italic">
            Chúng tôi cam kết bảo mật thông tin và không chia sẻ với bên thứ ba.
          </p>

        </div>
      </section>

      <Footer />

    </div>
  )
}
