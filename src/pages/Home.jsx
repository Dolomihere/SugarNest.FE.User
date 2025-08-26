import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { Link } from "react-router-dom";

import { ProductShowcase } from './layouts/home/ProductShowcase'
import { TopProducts } from './layouts/home/TopProducts';
import { Mailing } from './layouts/home/Mailing'
import ChatPage from '../pages/ChatPage';
import EmojiPopperMultiPosition from '../components/EmojiPopperMultiPosition';

export function HomePage() {
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-section text-main">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col flex-wrap gap-5 p-5 mx-auto md:flex-row max-w-7xl">
        <div className="flex flex-col flex-1 gap-5 p-5">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl text-main">
            Bánh Ngọt{" "}
            <span className="inline-flex items-center text-amber-600">
              Tuyệt Hảo{" "}
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
            Hãy để mỗi khoảnh khắc trong cuộc sống thêm phần ngọt ngào với những
            chiếc bánh thủ công tinh tế từ chúng tôi được chế biến từ nguyên
            liệu tự nhiên, kết hợp giữa hương vị truyền thống và sự sáng tạo
            hiện đại trong từng lớp bánh.
          </p>

          <p className="text-lg text-sub max-w-prose">
            Từ những chiếc bánh sinh nhật{" "}
            <EmojiPopperMultiPosition
              popupIcon={<span>🎂</span>}
              trigger="hover"
              count={5}
              duration={1000}
            >
              <span className="inline-block">🎂</span>
            </EmojiPopperMultiPosition>
            , bánh cưới sang trọng cho đến các món tráng miệng thường ngày, mỗi
            sản phẩm đều là một tác phẩm nghệ thuật được làm bằng cả trái tim.
          </p>

          <p className="text-lg text-sub max-w-prose">
            Hãy cùng chúng tôi lan tỏa niềm vui, chia sẻ những khoảnh khắc ý
            nghĩa, và tạo nên những kỷ niệm ngọt ngào không thể nào quên.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              to="/products"
              className="shadow-md cursor-pointer btn-primary hover:shadow-lg"
            >
              Đặt bánh ngay
            </Link>

            <Link
              to="/contact"
              className="px-5 py-3 text-lg transition border cursor-pointer text-amber-600 border-amber-300 rounded-xl hover:bg-amber-100"
            >
              Liên hệ với chúng tôi
            </Link>
          </div>
        </div>

        <div className="items-center justify-center flex-1 hidden p-5 md:flex">
          <img
            src="https://i.pinimg.com/736x/f3/40/aa/f340aa237513bc33d67074f674b2305a.jpg"
            alt="Delicious cake"
            className="h-auto w-full max-w-[600px] rounded-2xl shadow-xl object-cover"
          />
        </div>
      </section>

      {/* Top Products Section */}
      <div className="mb-6">
        <TopProducts
          queryKey={"OrderItemsCount"}
          sortBy="OrderItemsCount"
          amount="4"
          sortDescending={"true"}
          title="Sản phẩm được quan tâm nhiều"
          description="Những sản phẩm bán chạy và được khách hàng yêu thích nhất."
        />
      </div>

      {/* Top Products Section */}
      <div className="mb-6">
        <TopProducts
          queryKey={"AverageRatingPoint"}
          sortBy="AverageRatingPoint"
          amount="4"
          sortDescending={"true"}
          title="Sản phẩm được đánh giá cao"
          description="Những sản phẩm có uy tín và chất lượng tốt"
        />
      </div>

      {/* Top Products Section */}
      <div className="mb-6">
        <TopProducts
          queryKey={"FinalUnitPrice"}
          sortBy="FinalUnitPrice"
          amount="4"
          sortDescending={"false"}
          title="Sản phẩm giá tốt"
          description="Những sản phẩm có giá thành cực kì ưu đãi"
        />
      </div>

      {/* Showcase Section */}
      <div className="p-5">
        <ProductShowcase />
      </div>

      {/* Mailing Section */}
      <div className="p-5">
        <Mailing />
      </div>

      <Footer />

      <div className="fixed z-50 bottom-4 right-4">
        <ChatPage />
      </div>
    </div>
  );
}
