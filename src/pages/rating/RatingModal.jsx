import { StarRating } from "./StarRating";
import UserMiniProfile from "../components/UserMiniProfile";

function RatingModal({
  selectedRating,
  product,
  modalRef,
  currentImageIndex,
  handlePrevImage,
  handleNextImage,
  closeModal,
}) {
  if (!selectedRating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div
        ref={modalRef}
        className="w-11/12 max-w-3xl p-6 bg-gradient-to-br from-orange-50 via-orange-50 to-white border border-orange-100 rounded-3xl shadow-2xl transition-all duration-300"
      >
        <h4 className="text-2xl font-bold text-orange-600 mb-4 text-center font-cute">
          Chi tiết đánh giá
        </h4>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Hình ảnh đánh giá */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <div className="relative w-full h-64 overflow-hidden rounded-xl border border-orange-200">
              <img
                src={
                  selectedRating.imgs && selectedRating.imgs.length > 0
                    ? selectedRating.imgs[currentImageIndex]
                    : "/images/placeholder.png"
                }
                alt={`Hình ảnh đánh giá ${currentImageIndex + 1}`}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105 rounded-xl"
                onError={(e) => (e.target.src = "/images/placeholder.png")}
              />
              {selectedRating.imgs && selectedRating.imgs.length > 1 && (
                <div className="absolute inset-x-0 flex justify-between px-2 top-1/2 -translate-y-1/2">
                  <button
                    onClick={handlePrevImage}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-400 hover:bg-orange-500 text-white"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-400 hover:bg-orange-500 text-white"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin và đánh giá */}
          <div className="flex-1 flex flex-col justify-between gap-3">
            {/* Avatar + tên + StarRating */}
            <div className="flex items-center gap-3">
              <UserMiniProfile
                userId={selectedRating.createdBy}
                showName={true}
              />
              <StarRating rating={selectedRating.ratingPoint} />
            </div>

            {/* Comment */}
            <p className="text-gray-700 font-cute">
              {selectedRating.comment || "Không có nhận xét"}
            </p>

            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-2 gap-2 mt-2 text-gray-800 text-sm font-cute">
              <span className="font-semibold">Tên sản phẩm:</span>
              <span>{product.name || "Không xác định"}</span>

              <span className="font-semibold">Điểm đánh giá:</span>
              <span>{selectedRating.ratingPoint} sao</span>

              <span className="font-semibold">Ngày tạo:</span>
              <span>
                {new Date(selectedRating.createdAt).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-full bg-orange-400 hover:bg-orange-500 text-white font-cute transition-colors duration-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export { RatingModal };
