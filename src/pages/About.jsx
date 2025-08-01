import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cake, Award, GraduationCap, BookText, Star } from 'lucide-react';

export default function AboutPage() {
  const timeline = [
    {
      year: "2010",
      event:
        "SweetCake được thành lập bởi chị Minh Ngọc với một cửa hàng nhỏ tại Quận 1, TP.HCM. Dù khởi đầu khiêm tốn, cửa tiệm nhanh chóng thu hút đông đảo khách hàng nhờ vào hương vị bánh ngọt truyền thống, chất lượng nguyên liệu cao cấp và phong cách phục vụ tận tâm.",
      icon: <Star className="w-4 h-4 text-yellow-600" />,
      image:
        "https://vcdn1-dulich.vnecdn.net/2016/08/23/banhngon2-1471922491.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=QWfFLg9L5ibxxQaA4r7D6g",
    },
    {
      year: "2013",
      event:
        "Sau thành công ban đầu, SweetCake khai trương chi nhánh thứ hai tại Quận 3. Cùng năm đó, hệ thống đặt bánh online ra mắt, giúp khách hàng đặt bánh dễ dàng hơn.",
      icon: <Cake className="w-4 h-4 text-yellow-600" />,
      image: "https://anhquanbakery.com/uploads/images/Chesse-Cake-2.jpeg",
    },
    {
      year: "2016",
      event:
        'SweetCake vinh dự nhận giải thưởng “Tiệm bánh được yêu thích nhất” do Hiệp hội Ẩm thực Việt Nam bình chọn.',
      icon: <Award className="w-4 h-4 text-yellow-600" />,
      image:
        "https://media.dolenglish.vn/PUBLIC/MEDIA/b582d2f9-ad59-43e8-b456-17a271c99ab4.jpg",
    },
    {
      year: "2018",
      event:
        "SweetCake thành lập Học viện Bánh ngọt – nơi đào tạo thợ làm bánh chuyên nghiệp.",
      icon: <GraduationCap className="w-4 h-4 text-yellow-600" />,
      image: "https://anhquanbakery.com/uploads/images/tiramisu-cake.jpg",
    },
    {
      year: "2020",
      event:
        'Kỷ niệm 10 năm thành lập, SweetCake ra mắt cuốn sách “Từ Trái Tim Đến Chiếc Bánh” và mở rộng lên 10 chi nhánh toàn quốc.',
      icon: <BookText className="w-4 h-4 text-yellow-600" />,
      image:
        "https://sanvemaybay.vn/includes/uploads/2024/11/nhung-loai-banh-ngot-phap-hap-dan-danh-cho-cac-tin-do-hao-ngot-2.png",
    },
  ];

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-gray-800">
      <main className="flex flex-col w-full gap-20 px-4 py-16 mx-auto max-w-7xl md:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4 text-center"
        >
          <p className="text-sm italic text-gray-500">Hành trình từ 2010</p>
          <h1 className="text-4xl font-extrabold text-amber-600">Về Chúng Tôi</h1>
          <p className="text-base text-gray-600">
            Hành trình mang hương vị ngọt ngào đến với mọi người từ năm 2010
          </p>
        </motion.div>

        <section className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-5 leading-relaxed text-justify text-gray-600"
          >
            <p>
              SweetCake ra đời từ niềm đam mê thuần khiết với nghệ thuật làm bánh của chị Minh Ngọc – người tin rằng mỗi chiếc bánh đều có thể kể một câu chuyện.
            </p>
            <p>
              Những ngày đầu tiên, chỉ là một góc nhỏ ở Quận 1, nhưng bằng tình yêu nghề và sự tận tụy, SweetCake dần trở thành điểm đến quen thuộc cho những ai yêu thích hương vị ngọt ngào, thủ công và tinh tế.
            </p>
            <p>
              Chúng tôi tin rằng bánh ngọt không chỉ là món ăn, mà còn là món quà chứa đựng niềm vui, sự sẻ chia, và cảm xúc trong từng lớp kem, từng chiếc bánh.
            </p>
            <blockquote className="p-4 italic text-white rounded-lg shadow bg-amber-500">
              “Mỗi chiếc bánh không chỉ là món ăn, mà còn là niềm vui và tình yêu mà tôi muốn lan tỏa đến khách hàng.”
              <span className="block mt-2 text-right">– Minh Ngọc, Sáng lập</span>
            </blockquote>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src="https://cafefcdn.com/2019/7/29/5ba17e0767e2b10c916afcaapexels-photo-209356-15643727408821030708797.jpeg"
            alt="Founder"
            className="rounded-xl shadow-xl w-full max-h-[400px] object-cover"
          />
        </section>

        <section className="space-y-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl font-semibold text-center text-amber-600"
          >
            Hành Trình Phát Triển
          </motion.h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-[3px] bg-yellow-500 -translate-x-1/2 z-0" />

            <div className="relative z-10 flex flex-col gap-20">
              
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: index * 0.15,
                  }}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[400px]"
                >
                  <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <div className="w-10 h-10 rounded-full bg-white border-[3px] border-yellow-500 flex items-center justify-center shadow-md">
                      {item.icon}
                    </div>
                  </div>

                  <div
                    className={`flex justify-center md:justify-end ${
                      index % 2 === 0
                        ? "md:order-2 md:pl-[100px]"
                        : "md:order-1 md:pr-[100px]"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={`Mốc ${item.year}`}
                      className="object-cover rounded-xl shadow-lg w-full max-w-md max-h-[360px]"
                    />
                  </div>

                  <div
                    className={`flex justify-center md:justify-start ${
                      index % 2 === 0
                        ? "md:order-1"
                        : "md:order-2 md:pl-[100px]"
                    }`}
                  >
                    <div className="w-full max-w-md p-6 space-y-2 text-gray-600 bg-white border border-orange-200 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-amber-600">
                        {item.year}
                      </h3>
                      <p className="leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <Link
            to="/products"
            className="px-6 py-3 font-semibold text-white transition rounded-lg bg-amber-500 hover:bg-amber-600"
          >
            Khám phá sản phẩm
          </Link>
        </motion.div>

      </main>
    </div>
  );
}
