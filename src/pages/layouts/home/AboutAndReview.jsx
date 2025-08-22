import { useState, useEffect } from 'react';
import RatingService from '../../../services/RatingService';
import AxiosInstance from '../../../core/services/AxiosInstance';

export function AboutAndReviews() {
  const [reviews, setReviews] = useState([]);
  const [userMap, setUserMap] = useState({}); // userId -> fullname
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // 1. Lấy tất cả đánh giá
        const response = await RatingService.getAllRatings();
        const ratings = response.data || [];

        // 2. Lấy danh sách userId duy nhất
        const userIds = [...new Set(ratings.map(r => r.createdBy).filter(Boolean))];

        // 3. Lấy thông tin từng user
        const userResponses = await Promise.all(
          userIds.map(id =>
            AxiosInstance.get(`/users/${id}/public`).then(res => ({
              id,
              fullname: res.data?.data?.fullname || 'Người dùng ẩn danh'
            })).catch(() => ({ id, fullname: 'Người dùng ẩn danh' }))
          )
        );

        const userMapData = Object.fromEntries(userResponses.map(u => [u.id, u.fullname]));
        setUserMap(userMapData);

        // 4. Map userId -> fullname cho mỗi review
        const reviewsWithNames = ratings.map(r => ({
          ...r,
          name: userMapData[r.createdBy] || 'Người dùng ẩn danh'
        }));

        setReviews(reviewsWithNames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <p className="text-center text-stone-600">Đang tải đánh giá...</p>;
  }

  return (
    <section className="px-10 my-10 space-y-20">
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
                      <span key={idx}>{idx < r.ratingPoint ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-stone-600">Chưa có đánh giá nào.</p>
          )}
        </div>
      </div>
    </section>
  );
}
