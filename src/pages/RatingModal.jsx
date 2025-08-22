import { StarRating } from "./StarRating";

function RatingModal({
  selectedRating,
  modalRef,
  currentImageIndex,
  handlePrevImage,
  handleNextImage,
  closeModal,
  userMap,
}) {
  if (!selectedRating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
className="w-11/12 max-w-lg p-6 border border-amber-300 rounded-xl shadow-xl bg-gradient-to-br from-[#FFF9F4] to-white transition-transform duration-300"
      >
        <h4 className="mb-4 text-xl font-semibold text-amber-600 font-cute">
          Chi tiết đánh giá
        </h4>
        <div className="flex flex-col gap-4 md:flex-row items-start">
          {/* Hình ảnh */}
          <div className="w-full md:w-2/5">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-amber-200">
              {selectedRating.imgs && selectedRating.imgs.length > 0 ? (
                <img
                  src={selectedRating.imgs[currentImageIndex]}
                  alt={`Hình ảnh đánh giá ${currentImageIndex + 1}`}
                  className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <img
                  src="/images/15.jpg"
                  alt="Hình ảnh mặc định"
                  className="object-cover w-full h-full"
                />
              )}
              {selectedRating.imgs && selectedRating.imgs.length > 1 && (
                <div className="absolute inset-0 flex justify-between items-center px-2">
                  <button
                    onClick={handlePrevImage}
                    className="w-7 h-7 text-white bg-amber-600 hover:bg-amber-700 rounded-full flex items-center justify-center"
                    aria-label="Ảnh trước"
                  >
                    <i className="fa-solid fa-chevron-left text-sm"></i>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="w-7 h-7 text-white bg-amber-600 hover:bg-amber-700 rounded-full flex items-center justify-center"
                    aria-label="Ảnh tiếp theo"
                  >
                    <i className="fa-solid fa-chevron-right text-sm"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nội dung đánh giá */}
          <div className="w-full md:w-3/5 md:pl-4">
            <StarRating rating={selectedRating.ratingPoint} />
           <span className="block mt-2 text-sm text-gray-500 font-cute">
              bởi: {userMap[selectedRating?.createdBy] || "Người dùng ẩn danh"}
            </span>


            <p className="mt-1 text-sm text-gray-600 font-cute">
              Đánh giá: {selectedRating.comment || "Không có nhận xét"}
            </p>
            <p className="mt-3 text-sm text-gray-700 font-cute">
              Ngày tạo:{" "}
              {new Date(selectedRating.createdAt).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-5 text-right">
          <button
            className="px-4 py-1.5 text-sm text-white bg-amber-600 hover:bg-amber-700 rounded-full font-cute transition-colors"
            onClick={closeModal}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export { RatingModal };