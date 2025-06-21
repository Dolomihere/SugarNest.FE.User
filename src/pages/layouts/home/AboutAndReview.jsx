export function AboutAndReviews() {
  const reviews = [
    { name: "Phùng Ngọc Yến Nhi", comment: "Bánh kem sinh nhật từ SugarNest là lựa chọn hoàn hảo cho bữa tiệc của tôi.", rating: 5 },
    { name: "Phạm Thị Minh Nhàn", comment: "Những chiếc cupcake ở đây thật sự ngon không thể cưỡng lại.", rating: 4 },
    { name: "Nguyễn Thị Mai", comment: "Dịch vụ đặt bánh theo yêu cầu rất tuyệt vời. Họ làm đúng những gì tôi mong muốn.", rating: 5 },
  ];

  return (
    <section className="px-6 py-24 space-y-24  ">

      {/* Giới thiệu thương hiệu */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://i.pinimg.com/736x/3d/83/98/3d83988ed8c5c02a87c1c1e8cd367dba.jpg"
          alt="Tiệm bánh SugarNest"
          className="w-full h-[360px] object-cover rounded-3xl shadow-lg border border-amber-200"
        />

        <div className="space-y-5">
          <h2 className= "text-4xl font-extrabold text-amber-600">Về SugarNest</h2>

          <p className="text-stone-600 leading-relaxed text-lg">
            SugarNest được thành lập vào năm 2025 với niềm đam mê tạo ra những chiếc bánh không chỉ ngon miệng mà còn đẹp mắt. Từ một tiệm bánh nhỏ, chúng tôi đã trở thành thương hiệu được yêu thích nhờ sự tận tâm và sáng tạo.
          </p>

          <p className="text-stone-600 leading-relaxed text-lg">
            Chúng tôi chọn nguyên liệu chất lượng, kết hợp công thức độc quyền và đôi bàn tay thủ công để tạo nên từng chiếc bánh ngọt ngào, đậm chất nghệ thuật và cảm xúc.
          </p>
        </div>
      </div>

      {/* Đánh giá khách hàng */}
      <div className="text-center">
        <div className="max-w-6xl mx-auto mb-14 space-y-3">
        <h2 className="text-4xl font-extrabold text-amber-600 mb-4">Khách Hàng Nói Gì</h2>
          <p className="text-stone-600 text-lg">
            Những chia sẻ thật lòng từ khách hàng đã trải nghiệm bánh và dịch vụ của SugarNest
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {reviews.map((r, i) => (
            <div key={i} className="bg-[#fffcf8] border-amber-100 shadow rounded-2xl p-6 text-left space-y-4 transition hover:shadow-lg">
              <p className="text-stone-700 italic leading-relaxed">“{r.comment}”</p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-amber-800">{r.name}</span>

                <div className="flex text-amber-500 text-lg">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx}>{idx < r.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
