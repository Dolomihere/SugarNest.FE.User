import { Link } from 'react-router-dom'
import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'
import { Cake, Award, GraduationCap, BookText, Star } from 'lucide-react'

export function AboutPage() {
  const timeline = [
  {
    year: '2010',
    event: 'SweetCake được thành lập bởi chị Minh Ngọc với một cửa hàng nhỏ tại Quận 1, TP.HCM. Dù khởi đầu khiêm tốn, cửa tiệm nhanh chóng thu hút đông đảo khách hàng nhờ vào hương vị bánh ngọt truyền thống, chất lượng nguyên liệu cao cấp và phong cách phục vụ tận tâm.',
    icon: <Star className="w-4 h-4 text-yellow-600" />,
    image: 'https://vcdn1-dulich.vnecdn.net/2016/08/23/banhngon2-1471922491.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=QWfFLg9L5ibxxQaA4r7D6g',
  },
  {
    year: '2013',
    event: 'Sau thành công ban đầu, SweetCake khai trương chi nhánh thứ hai tại Quận 3. Cùng năm đó, hệ thống đặt bánh online ra mắt, giúp khách hàng đặt bánh dễ dàng hơn, đặc biệt trong các dịp lễ, sinh nhật và sự kiện. Đây là bước ngoặt trong việc hiện đại hóa mô hình kinh doanh.',
    icon: <Cake className="w-4 h-4 text-yellow-600" />,
    image: 'https://anhquanbakery.com/uploads/images/Chesse-Cake-2.jpeg',
  },
  {
    year: '2016',
    event: 'SweetCake vinh dự nhận giải thưởng “Tiệm bánh được yêu thích nhất” do Hiệp hội Ẩm thực Việt Nam bình chọn. Giải thưởng là minh chứng cho chất lượng không đổi và sự tin yêu của khách hàng suốt nhiều năm. Đây cũng là động lực để thương hiệu mở rộng quy mô sản xuất và phát triển dòng bánh cao cấp.',
    icon: <Award className="w-4 h-4 text-yellow-600" />,
    image: 'https://media.dolenglish.vn/PUBLIC/MEDIA/b582d2f9-ad59-43e8-b456-17a271c99ab4.jpg',
  },
  {
    year: '2018',
    event: 'SweetCake thành lập Học viện Bánh ngọt – nơi đào tạo thợ làm bánh chuyên nghiệp. Học viện không chỉ truyền đạt kiến thức chuyên môn mà còn lan toả triết lý “làm bánh bằng cả trái tim”. Rất nhiều học viên từ đây đã thành công và mở tiệm riêng, góp phần lan tỏa giá trị ngọt ngào mà SweetCake khởi xướng.',
    icon: <GraduationCap className="w-4 h-4 text-yellow-600" />,
    image: 'https://anhquanbakery.com/uploads/images/tiramisu-cake.jpg',
  },
  {
    year: '2020',
    event: 'Đánh dấu cột mốc 10 năm phát triển, SweetCake mở rộng hệ thống lên 10 chi nhánh trên cả nước. Đồng thời, ra mắt cuốn sách công thức độc quyền “Từ Trái Tim Đến Chiếc Bánh” chia sẻ bí quyết và câu chuyện phía sau từng chiếc bánh – như món quà tri ân gửi đến cộng đồng yêu bánh ngọt.',
    icon: <BookText className="w-4 h-4 text-yellow-600" />,
    image: 'https://sanvemaybay.vn/includes/uploads/2024/11/nhung-loai-banh-ngot-phap-hap-dan-danh-cho-cac-tin-do-hao-ngot-2.png',
  },
]

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-[#fffaf3] text-gray-800">

      <Header />

      <main className="flex flex-col gap-16 px-4 mx-auto my-12 md:px-6 lg:px-8 max-w-7xl">

        <div className="space-y-3 text-center">
>>>>>>>>> Temporary merge branch 2
          <p className="text-sm italic text-gray-500">Hành trình từ 2010</p>
          <h1 className="text-4xl font-bold tracking-tight text-amber-600">Về Chúng Tôi</h1>
          <p className="text-gray-600 text-md">
            Hành trình mang hương vị ngọt ngào đến với mọi người từ năm 2010
          </p>

        </div>

<<<<<<<<< Temporary merge branch 1
        <section>
          <h2 className="text-2xl font-semibold text-[#5b3c11] mb-6">Câu Chuyện Của SweetCake</h2>
          <div className="grid items-center grid-cols-1 gap-6 md:grid-cols-2">
            <div>
=========
         {/* Câu chuyện thương hiệu */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-amber-600">Câu Chuyện Của SweetCake</h2>

          <div className="grid items-center gap-10 md:grid-cols-2">

            <div className="space-y-5 leading-relaxed text-justify text-gray-700">
>>>>>>>>> Temporary merge branch 2
              <p>
                SweetCake ra đời từ niềm đam mê thuần khiết với nghệ thuật làm bánh của chị Minh Ngọc – một người yêu thích ẩm thực và tin rằng mỗi chiếc bánh đều có thể kể một câu chuyện.
              </p>
              <p>
                Những ngày đầu tiên, chỉ là một góc nhỏ ở Quận 1, nhưng bằng tình yêu nghề và sự tận tụy, SweetCake dần trở thành điểm đến quen thuộc cho những ai yêu thích hương vị ngọt ngào, thủ công và tinh tế.
              </p>
              <p>
                Chúng tôi tin rằng bánh ngọt không chỉ là món ăn, mà còn là món quà chứa đựng niềm vui, sự sẻ chia, và cảm xúc trong từng lớp kem, từng chiếc bánh. Đó là lý do SweetCake luôn đặt trái tim và sáng tạo vào từng sản phẩm.
              </p>
              <blockquote className="italic bg-[#342107] text-white p-4 rounded-lg shadow-sm">
                “Mỗi chiếc bánh không chỉ là món ăn, mà còn là niềm vui và tình yêu mà tôi muốn lan toả đến khách hàng.”<br />
                <span className="block mt-2 text-right">- Minh Ngọc, Sáng lập</span>
              </blockquote>
            </div>

            <img
              src="https://cafefcdn.com/2019/7/29/5ba17e0767e2b10c916afcaapexels-photo-209356-15643727408821030708797.jpeg"
              alt="Ly trà"
              className="rounded-xl shadow-lg w-full max-h-[400px] object-cover"
            />

          </div>
        </section>

        <section>
          <h2 className="mb-12 text-2xl font-semibold text-center text-amber-600">
            Hành Trình Phát Triển
          </h2>

<<<<<<<<< Temporary merge branch 1
        <section>
          <h2 className="text-2xl font-semibold text-[#5b3c11] mb-12 text-center">Hành Trình Phát Triển</h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-[3px] bg-yellow-500 transform -translate-x-1/2 z-0" />

            <div className="relative z-10 space-y-20">

              {timeline.map((item, index) => (

                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >

                  <div className="z-20 w-10 h-10 rounded-full bg-white border-[3px] border-yellow-500 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 shadow-md">
                    {item.icon}
                  </div>

                  <div className="w-full px-4 md:w-1/2">
                    <img
                      src={item.image}
                      alt={`Mốc ${item.year}`}
                      className="object-cover w-full rounded shadow-md max-h-56"
                    />
                  </div>

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

        <div className="text-center">
=========
  <div className="relative">
    {/* Đường kẻ vàng ở giữa */}
    <div className="absolute left-1/2 top-0 h-full w-[3px] bg-yellow-500 -translate-x-1/2 z-0" />

    <div className="relative z-10 flex flex-col gap-20">
      {timeline.map((item, index) => (
        <div
          key={index}
          className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[400px] px-4 md:px-8"
        >
          {/* Icon giữa */}
          <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div className="w-10 h-10 rounded-full bg-white border-[3px] border-yellow-500 flex items-center justify-center shadow-md">
              {item.icon}
            </div>
          </div>

                  <div
                  className={`flex justify-center md:justify-end ${
                    index % 2 === 0
                      ? 'md:order-2 md:pl-[100px]'
                      : 'md:order-1 md:pr-[100px]'
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
                      index % 2 === 0 ? 'md:order-1' : 'md:order-2 md:pl-[100px]'
                    }`}
                  >

                    <div className="bg-[#fdfcf9] rounded-lg shadow-md p-6 border border-[#e8e4da] w-full max-w-md space-y-2 text-gray-700">
                      <h3 className="text-xl font-semibold text-[#5b3c11]">{item.year}</h3>
                      <p className="leading-relaxed">{item.event}</p>
                    </div>
                    
                  </div>

                </div>
              ))}

            </div>

          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-block px-6 py-3 font-medium text-white transition bg-yellow-600 rounded-lg shadow-md hover:bg-yellow-700"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}