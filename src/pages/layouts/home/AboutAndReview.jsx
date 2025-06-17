
export function AboutAndReviews() {
  const reviews = [
    { name: "Anna T.", comment: "The strawberry shortcake is heaven! Light, fresh, and not too sweet.", rating: 5, },
    { name: "Jason R.", comment: "Great atmosphere and beautiful presentation. Will visit again!", rating: 4, },
    { name: "Maria K.", comment: "Everything tastes homemade. The croissants are buttery perfection.", rating: 5, },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 space-y-24">

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <img
          src="/about-bakery.jpg"
          alt="Our bakery"
          className="w-full h-[320px] object-cover rounded-xl shadow"
        />

        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Về SugarNest</h2>

          <p className="text-gray-600 leading-relaxed">
            SweetCake được thành lập vào năm 2025 với niềm đam mê tạo ra những chiếc bánh không chỉ ngon miệng mà còn đẹp mắt. Bắt đầu từ một tiệm bánh nhỏ, chúng tôi đã phát triển thành một thương hiệu đượcyêu thích.
          </p>

          <p className="mt-4 text-gray-600">
            Triết lý của chúng tôi là sử dụng những nguyên liệu tốt nhất, kết hợp với công thức độc đáo và tình yêu với nghề làm bánh đểtạo ra những sản phẩm hoàn hảo. Mỗi chiếc bánh đều được làm thủ công,với sự tỉ mỉ và chăm chút đến từng chi tiết.
          </p>
        </div>

      </div>

      <div className="text-center">

        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Khách Hàng Nói Gì Về Chúng Tôi</h2>
          <p>Những đánh giá chân thực từ khách hàng đã trải nghiệm sản phẩm và dịch vụ của SugarNest</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">

          {reviews.map((r, i) => (
            <div key={i} className="bg-white shadow-md rounded-lg p-6 text-left">

              <p className="text-gray-700 mb-4">“{r.comment}”</p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{r.name}</span>

                <div className="flex text-yellow-500">

                  {[...Array(5)].map((_, idx) =>
                    idx < r.rating ? "⭐" : "☆"
                  )}

                </div>
                
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
