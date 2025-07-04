import React from "react";
import { useState } from "react";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { motion } from "framer-motion";

const DiscountBlog = () => {
  const [vouchers] = useState([
    {
      id: 1,
      title: "Giảm giá bánh quy",
      description: "Thưởng thức giảm 50% cho tất cả bánh quy ngon tuyệt!",
      discount: "50%",
      image: "https://mosia.io/content/images/size/w1000/2024/03/1000004275.jpg",
      date: "2025-07-31",
    },
    {
      id: 2,
      title: "Lễ hội bánh cupcake",
      description: "Giảm 30% cho tất cả bánh cupcake trong tuần này.",
      discount: "30%",
      image: "https://friendshipcakes.com/wp-content/uploads/2023/05/Set-12-banh-cupcake-sinh-nhat-trang-tri-nho-xanh-va-bap-ngot-scaled.jpg",
      date: "2025-08-15",
    },
    {
      id: 3,
      title: "Tuần lễ yêu bánh mì",
      description: "Bánh mì tươi ngon cùng với trái cây mát lạnh giảm giá 40%.",
      discount: "40%",
      image: "https://cdn.tgdd.vn/2021/06/CookProduct/BeFunky-collage-1200x676-16.jpg",
      date: "2025-08-20",
    },
    {
      id: 4,
      title: "Ưu đãi sinh nhật",
      description: "Kỷ niệm với giảm 25% cho bánh kem tùy chỉnh.",
      discount: "25%",
      image: "https://i.pinimg.com/736x/13/27/e7/1327e76f39da4e524a2768371fd520fe.jpg",
      date: "2025-09-01",
    },
    {
      id: 5,
      title: "Khuyến mãi bánh ngọt",
      description: "Giảm 35% cho tất cả các loại bánh ngọt cao cấp.",
      discount: "35%",
      image: "https://down-vn.img.susercontent.com/file/vn-11134201-23030-j0q4ntt12kov68@resize_w900_nl.webp",
      date: "2025-09-10",
    },
    {
      id: 6,
      title: "Ưu đãi mùa thu",
      description: "Giảm 20% cho các sản phẩm mùa thu đặc biệt.",
      discount: "20%",
      image: "https://i.pinimg.com/736x/2b/44/e7/2b44e7ab8645b2b0f0adefe415138bd2.jpg",
      date: "2025-10-01",
    }
  ]);

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-gray-800">
      <Header />
      <main className="max-w-7xl w-full mx-auto py-12 px-6 bg-[#FFF9F4] min-h-[800px] space-y-16">
        {/* Banner quảng cáo */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="relative w-full h-64 overflow-hidden shadow-lg bg-gradient-to-r from-amber-200 to-orange-300 rounded-2xl"
        >
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
            <div>
              <h2 className="text-3xl font-bold">Ưu đãi đặc biệt hôm nay!</h2>
              <p className="mt-2 text-lg">Nhận ngay giảm giá lên đến 50% cho các sản phẩm yêu thích.</p>
              <button className="px-6 py-2 mt-4 font-semibold transition bg-white rounded-lg text-amber-600 hover:bg-amber-100">
                Xem ngay
              </button>
            </div>
          </div>
        </motion.section>

        {/* Tiêu đề đẹp */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="relative text-4xl font-extrabold tracking-wide text-center uppercase text-amber-600"
        >
          <span className="relative z-10 bg-[#FFF9F4] px-4">Chương trình giảm giá</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-full border-t border-amber-300 top-1/2"></div>
          </div>
        </motion.h1>

        {/* Danh sách voucher */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {vouchers.map((voucher) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative flex flex-col p-6 overflow-hidden transition bg-white border border-gray-200 shadow rounded-2xl hover:shadow-lg hover:scale-105"
            >
              {/* Nhãn giảm giá */}
              <div className="absolute flex items-center justify-center text-lg font-bold text-white bg-red-500 rounded-full shadow top-4 right-4 w-14 h-14">
                {voucher.discount}
              </div>
              {/* Hình ảnh */}
              <img
                src={voucher.image}
                alt={voucher.title}
                className="object-cover w-full h-48 mb-4 rounded"
              />
              {/* Nội dung */}
              <h2 className="mb-2 text-xl font-semibold text-gray-800">{voucher.title}</h2>
              <p className="mb-2 text-gray-600">{voucher.description}</p>
              <p className="text-sm italic text-gray-500">Hiệu lực đến: {voucher.date}</p>
            </motion.div>
          ))}
        </div>

        {/* Phần giới thiệu */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="py-10 text-center bg-white rounded-lg shadow-md"
        >
          <h2 className="mb-4 text-2xl font-bold text-amber-600">Về chương trình giảm giá</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            SugarNest mang đến cho bạn những chương trình giảm giá hấp dẫn để tận hưởng hương vị tuyệt vời từ các loại bánh yêu thích. Hãy theo dõi thường xuyên để không bỏ lỡ cơ hội nhận ưu đãi đặc biệt!
          </p>
        </motion.section>

        {/* Thông tin liên hệ */}
        {/* <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="py-10 text-center rounded-lg shadow-md bg-amber-50"
        >
          <h2 className="mb-4 text-2xl font-bold text-amber-600">Liên hệ với chúng tôi</h2>
          <p className="mb-4 text-gray-600">Hãy liên hệ để biết thêm chi tiết về các chương trình giảm giá!</p>
          <div className="flex justify-center gap-6 text-gray-700">
            <a href="tel:+0915027930" className="hover:text-amber-600">0915 027 930</a>
            <a href="mailto:contact@sugarnestcake.com" className="hover:text-amber-600">contact@sugarnestcake.com</a>
            <a href="https://www.facebook.com" className="hover:text-amber-600">Facebook</a>
          </div>
        </motion.section> */}
      </main>
      <Footer />
    </div>
  );
};

export default DiscountBlog;