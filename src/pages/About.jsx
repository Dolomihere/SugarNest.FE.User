import { Link } from 'react-router-dom'

import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

export function AboutPage() {
  const timeline = [
    { year: "2010", event: "Khởi đầu hành trình 2010 SweetCake được thành lập bởi chị Minh Ngọc với một cửa hàng nhỏ tại Quận 1, TP.HCM." },
    { year: "2013", event: "Mở rộng quy mô 2013 Mở thêm chi nhánh thứ hai tại Quận 3 và bắt đầu cung cấp dịch vụ đặt bánh online." },
    { year: "2016", event: "Chinh phục giải thưởng 2016 Vinh dự nhận giải 'Tiệm bánh được yêu thích nhất' do Hiệp hội Ẩm thực Việt Nam bình chọn." },
    { year: "2018", event: "Thành lập học viện 2018 Mở Học viện Bánh ngọt SweetCake để đào tạo thế hệ thợ làm bánh chuyên nghiệp." },
    { year: "2020", event: "Kỷ niệm 10 năm 2020 Kỷ niệm một thập kỷ hoạt động với 10 chi nhánh trên toàn quốc và ra mắt sách công thức độc quyền." },
    { year: "2023", event: "Hiện tại 2023 SweetCake tiếp tục phát triển với sứ mệnh mang niềm vui ẩm thực đến mọi gia đình Việt Nam." }
  ];

  return (
    <div className="min-h-dvh flex flex-col">

      <Header />

      <div className="flex-1 max-w-5xl mx-auto">
        <div className="px-4 py-16 space-y-16 text-gray-700">

          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-pink-600">Về SweetCake</h1>
            <p className="text-lg">Hành trình mang hương vị ngọt ngào đến với mọi người từ năm 2010</p>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">Câu Chuyện Thương Hiệu</h2>

            <p>
              SweetCake bắt đầu từ niềm đam mê làm bánh của chị Minh Ngọc -một người yêu thích ẩm thực và mong muốn mang những chiếc bánh ngọt ngào, đẹp mắt vào cuộc sống của mọi người.
            </p>

            <p>SweetCake bắt đầu từ niềm đam mê làm bánh của chị Minh Ngọc -một người yêu thích ẩm thực và mong muốn mang những chiếc bánh ngọt ngào, đẹp mắt vào cuộc sống của mọi người.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dấu Ấn Hành Trình</h2>

            <div className="border-l-2 border-pink-500 pl-6 space-y-6">

              {timeline.map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-semibold">{item.year}</h3>
                  <p>{item.event}</p>
                </div>
              ))}

            </div>
          </div>

          <div className="bg-pink-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-pink-600 mb-2">Giá Trị Cốt Lõi</h2>

            <ul className="list-disc list-inside space-y-2">
              <li>Chúng tôi cam kết sử dụng những nguyên liệu cao cấp nhất để tạo ra những sản phẩm hoàn hảo.</li>
              <li>Không ngừng sáng tạo và cải tiến các công thức bánh để mang đến hương vị độc đáo.</li>
              <li>Mỗi sản phẩm của chúng tôi đều được làm với mong muốn mang lại niềm vui cho khách hàng.</li>
            </ul>

          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700 transition"
            >
              Khám phá sản phẩm
            </Link>
          </div>

        </div>
      </div>

      <Footer />

    </div>
  )
}
