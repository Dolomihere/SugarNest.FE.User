import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

import { AboutAndReviews } from './layouts/home/AboutAndReview'
import { ProductShowcase } from './layouts/home/ProductShowcase'
import { Mailing } from './layouts/home/Mailing'
import ChatPage from '../pages/ChatPage';
import EmojiPopperMultiPosition from '../components/EmojiPopperMultiPosition';

export function HomePage() {
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-section text-main">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row flex-wrap gap-5 p-5 max-w-7xl mx-auto">
        <div className="flex flex-col gap-5 p-5 flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-main leading-tight">
            Bánh Ngọt{' '}
            <span className="text-amber-600 inline-flex items-center">
              Tuyệt Hảo{' '}
            </span>
            <br />
            Cho Mọi Dịp
            <EmojiPopperMultiPosition
              popupIcon={<span>🍰</span>}
              trigger="hover"
              count={6}
              duration={1200}
              zoneWidth={150}
              zoneHeight={200}
            >
              <span className="inline-block ml-2">🍰</span>
            </EmojiPopperMultiPosition>
          </h1>

          <p className="text-lg text-sub max-w-prose">
            Hãy để mỗi khoảnh khắc trong cuộc sống thêm phần ngọt ngào với những chiếc bánh thủ công tinh tế từ chúng tôi được chế biến từ nguyên liệu tự nhiên, kết hợp giữa hương vị truyền thống và sự sáng tạo hiện đại trong từng lớp bánh.
          </p>

          <p className="text-lg text-sub max-w-prose">
            Từ những chiếc bánh sinh nhật{' '}
     
            <EmojiPopperMultiPosition
              popupIcon={<span>🎂</span>}
              trigger="hover"
              count={5}
              duration={1000}
            >
              <span className="inline-block">🎂</span>
            </EmojiPopperMultiPosition>
            , bánh cưới sang trọng cho đến các món tráng miệng thường ngày, mỗi sản phẩm đều là một tác phẩm nghệ thuật được làm bằng cả trái tim.
               </p>

          <p className="text-lg text-sub max-w-prose">
            Hãy cùng chúng tôi lan tỏa niềm vui, chia sẻ những khoảnh khắc ý nghĩa, và tạo nên những kỷ niệm ngọt ngào không thể nào quên.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
          
              <button className="btn-primary shadow-md hover:shadow-lg cursor-pointer">
                Đặt bánh ngay
              </button>

           
              <button className="text-amber-600 border border-amber-300 px-5 py-3 rounded-xl text-lg hover:bg-amber-100 transition cursor-pointer">
                Liên hệ với chúng tôi
              </button>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center flex-1 p-5">
          <img
            src="https://i.pinimg.com/736x/f3/40/aa/f340aa237513bc33d67074f674b2305a.jpg"
            alt="Delicious cake"
            className="h-auto w-full max-w-[600px] rounded-2xl shadow-xl object-cover"
          />
        </div>
      </section>

      {/* Showcase Section */}
      <div className="p-5">
        <ProductShowcase />
      </div>

      {/* About and Review Section */}
      <div className="p-5">
        <AboutAndReviews />
      </div>

      {/* Mailing Section */}
      <div className="p-5">
        <Mailing />
      </div>

      <Footer />

      <div className="fixed bottom-4 right-4 z-50">
        <ChatPage />
      </div>
    </div>
  );
}
