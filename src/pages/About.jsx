import { Link } from 'react-router-dom'
import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'
import { Cake, Award, GraduationCap, BookText, Star } from 'lucide-react'

export function AboutPage() {
  const timeline = [
    {
      year: '2010',
      event: 'SweetCake được thành lập bởi chị Minh Ngọc với một cửa hàng nhỏ tại Quận 1, TP.HCM.',
      icon: <Star className="w-4 h-4 text-yellow-600" />,
      image: 'https://vcdn1-dulich.vnecdn.net/2016/08/23/banhngon2-1471922491.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=QWfFLg9L5ibxxQaA4r7D6g',
    },
    {
      year: '2013',
      event: 'Mở thêm chi nhánh thứ hai tại Quận 3 và bắt đầu cung cấp dịch vụ đặt bánh online.',
      icon: <Cake className="w-4 h-4 text-yellow-600" />,
      image: 'https://anhquanbakery.com/uploads/images/Chesse-Cake-2.jpeg',
    },
    {
      year: '2016',
      event: 'Vinh dự nhận giải "Tiệm bánh được yêu thích nhất" do Hiệp hội Ẩm thực Việt Nam bình chọn.',
      icon: <Award className="w-4 h-4 text-yellow-600" />,
      image: 'https://media.dolenglish.vn/PUBLIC/MEDIA/b582d2f9-ad59-43e8-b456-17a271c99ab4.jpg',
    },
    {
      year: '2018',
      event: 'Mở Học viện Bánh ngọt SweetCake để đào tạo thế hệ thợ làm bánh chuyên nghiệp.',
      icon: <GraduationCap className="w-4 h-4 text-yellow-600" />,
      image: 'https://anhquanbakery.com/uploads/images/tiramisu-cake.jpg',
    },
    {
      year: '2020',
      event: 'Kỷ niệm một thập kỷ hoạt động với 10 chi nhánh và ra mắt sách công thức độc quyền.',
      icon: <BookText className="w-4 h-4 text-yellow-600" />,
      image: 'https://sanvemaybay.vn/includes/uploads/2024/11/nhung-loai-banh-ngot-phap-hap-dan-danh-cho-cac-tin-do-hao-ngot-2.png',
    },
  ]

  return (
    <div className="flex flex-col min-h-dvh bg-[#fffaf3]">
      <Header />

      <main className="flex-1 max-w-6xl px-4 py-12 mx-auto text-gray-800">
        {/* Tiêu đề */}
        <div className="mb-12 text-center">
          <p className="text-sm italic text-gray-500">Hành trình từ 2010</p>
          <h1 className="text-4xl font-bold text-[#5b3c11]">Về Chúng Tôi</h1>
          <p className="mt-2 text-gray-600 text-md">Hành trình mang hương vị ngọt ngào đến với mọi người từ năm 2010</p>
        </div>

        {/* Câu chuyện thương hiệu */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#5b3c11] mb-6">Câu Chuyện Của SweetCake</h2>
          <div className="grid items-center grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p>
                SweetCake bắt đầu từ niềm đam mê làm bánh của chị Minh Ngọc – một người yêu thích ẩm thực và mong muốn mang những chiếc bánh ngọt ngào, đẹp mắt vào cuộc sống của mọi người.
              </p>
              <p className="mt-4 italic bg-[#5b3c11] text-white p-3 rounded">
                “Mỗi chiếc bánh không chỉ là món ăn, mà còn là niềm vui và tình yêu mà tôi muốn lan toả đến khách hàng.”<br />
                - Minh Ngọc, Sáng lập
              </p>
            </div>
            <img
              src="https://cafefcdn.com/2019/7/29/5ba17e0767e2b10c916afcaapexels-photo-209356-15643727408821030708797.jpeg"
              alt="Ly trà"
              className="rounded shadow-lg w-full max-h-[300px] object-cover"
            />
          </div>
        </section>

        {/* Timeline chính giữa */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#5b3c11] mb-12 text-center">Hành Trình Phát Triển</h2>

          <div className="relative">
            {/* Trục timeline */}
            <div className="absolute left-1/2 top-0 h-full w-[3px] bg-yellow-500 transform -translate-x-1/2 z-0" />

            <div className="relative z-10 space-y-20">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Icon giữa trục */}
                  <div className="z-20 w-10 h-10 rounded-full bg-white border-[3px] border-yellow-500 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 shadow-md">
                    {item.icon}
                  </div>

                  {/* Ảnh */}
                  <div className="w-full px-4 md:w-1/2">
                    <img
                      src={item.image}
                      alt={`Mốc ${item.year}`}
                      className="object-cover w-full rounded shadow-md max-h-56"
                    />
                  </div>

                  {/* Nội dung */}
                  <div className="flex justify-center w-full px-4 md:w-1/2">
                    <div className="bg-[#f7f7f1] rounded-lg shadow-sm p-4 border border-[#ddd] w-full max-w-md">
                      <h3 className="text-lg font-semibold text-[#5b3c11] mb-1">{item.year}</h3>
                      <p className="text-gray-700">{item.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-block px-6 py-3 text-white transition bg-yellow-600 rounded hover:bg-yellow-700"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
