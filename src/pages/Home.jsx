import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

import { AboutAndReviews } from './layouts/home/AboutAndReview'
import { ProductShowcase } from './layouts/home/ProductShowcase'
import { Mailing } from './layouts/home/Mailing'

export function HomePage() {
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-orange-50/70 text-stone-800">
      
      <Header />

      <section className="flex flex-row gap-5 px-10 my-12 max-w-7xl mx-auto">

        <div className="flex flex-col gap-5">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#5C3A21] leading-tight">
            Bánh Ngọt <span className="text-amber-600">Tuyệt Hảo</span><br />
            Cho Mọi Dịp
          </h1>

          <p className="text-lg text-stone-600 max-w-prose">
            Hãy để mỗi khoảnh khắc trong cuộc sống thêm phần ngọt ngào với những chiếc bánh thủ công tinh tế từ chúng tôi được chế biến từ nguyên liệu tự nhiên, kết hợp giữa hương vị truyền thống và sự sáng tạo hiện đại trong từng lớp bánh.
          </p>

            <p className="text-lg text-stone-600 max-w-prose">
          Từ những chiếc bánh sinh nhật rực rỡ, bánh cưới sang trọng cho đến các món tráng miệng thường ngày, mỗi sản phẩm đều là một tác phẩm nghệ thuật được làm bằng cả trái tim. Chúng tôi không chỉ mang đến hương vị tuyệt vời, mà còn trao gửi yêu thương và sự chăm chút trong từng chi tiết nhỏ nhất.           
            </p>

            <p className="text-lg text-stone-600 max-w-prose">Hãy cùng chúng tôi lan tỏa niềm vui, chia sẻ những khoảnh khắc ý nghĩa, và tạo nên những kỷ niệm ngọt ngào không thể nào quên.</p>

          <div>
            <button className="bg-amber-500 hover:bg-amber-600 transition text-white px-6 py-3 rounded-xl text-lg shadow-md hover:shadow-lg cursor-pointer my-3 sm:mx-5">
              Đặt bánh ngay
            </button>

            <button className="text-amber-600 border border-amber-300 px-6 py-3 rounded-xl text-lg hover:bg-amber-100 transition cursor-pointer">
              Liên hệ với chúng tôi
            </button>
          </div>

        </div>

        <div className="hidden md:flex justify-center items-center">
          <img
            src="https://i.pinimg.com/736x/f3/40/aa/f340aa237513bc33d67074f674b2305a.jpg"
            alt="Delicious cake"
            className="h-auto w-[600px] rounded-2xl shadow-xl object-cover"
            />
        </div>

      </section>

      <ProductShowcase />

      <AboutAndReviews />

      <Mailing />

      <Footer />

    </div>
  )
}
