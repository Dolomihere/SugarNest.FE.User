import { useState, useEffect } from 'react';
import RatingService from '../../../services/RatingService'; // Adjust the import path based on your project structure

export function AboutAndReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await RatingService.getAllRatings();
        setReviews(response.data || []); // Assuming response.data is an array of {name, comment, rating}
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Optionally, set some fallback reviews or show an error message
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="px-10 my-10 space-y-20">

      {/* Giới thiệu thương hiệu */}
      <div className="grid items-center max-w-6xl gap-12 mx-auto md:grid-cols-2">
        <img
          src="https://i.pinimg.com/736x/3d/83/98/3d83988ed8c5c02a87c1c1e8cd367dba.jpg"
          alt="Tiệm bánh SugarNest"
          className="w-full h-[360px] object-cover rounded-3xl shadow-lg border border-amber-200"
        />

        <div className="space-y-5">
          <h2 className="text-4xl font-extrabold text-amber-600">Về SugarNest</h2>

          <p className="text-lg leading-relaxed text-stone-600">
            SugarNest được thành lập vào năm 2025 với niềm đam mê tạo ra những chiếc bánh không chỉ ngon miệng mà còn đẹp mắt. Từ một tiệm bánh nhỏ, chúng tôi đã trở thành thương hiệu được yêu thích nhờ sự tận tâm và sáng tạo.
          </p>

          <p className="text-lg leading-relaxed text-stone-600">
            Chúng tôi chọn nguyên liệu chất lượng, kết hợp công thức độc quyền và đôi bàn tay thủ công để tạo nên từng chiếc bánh ngọt ngào, đậm chất nghệ thuật và cảm xúc.
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="max-w-6xl mx-auto space-y-3 mb-14">
          <h2 className="mb-4 text-4xl font-extrabold text-amber-600">Khách Hàng Nói Gì</h2>
          <p className="text-lg text-stone-600">
            Những chia sẻ thật lòng từ khách hàng đã trải nghiệm bánh và dịch vụ của SugarNest
          </p>
        </div>

        <div className="grid max-w-6xl gap-8 mx-auto sm:grid-cols-2 md:grid-cols-3">
          {reviews.length > 0 ? (
            reviews.map((r, i) => (
              <div key={i} className="bg-[#fffcf8] border-amber-100 shadow rounded-2xl p-6 text-left space-y-4 transition hover:shadow-lg">
                <p className="italic leading-relaxed text-stone-700">“{r.comment}”</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{r.name}</span>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, idx) => (
                      idx < r.rating ? "★" : "☆"
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-stone-600">Đang tải đánh giá...</p>
          )}
        </div>
      </div>

    </section>
  );
}