import { StarRating } from "./StarRating";

function RatingModal({
  selectedRating,
  modalRef,
  currentImageIndex,
  handlePrevImage,
  handleNextImage,
  closeModal,
}) {
  if (!selectedRating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
      <div
        ref={modalRef}
        className="w-11/12 max-w-xl p-8 transition-all duration-300 transform bg-white border-2 shadow-2xl border-amber-300 rounded-2xl bg-gradient-to-br from-amber-50 to-white"
      >
        <h4 className="mb-4 text-2xl font-bold text-amber-600 font-cute">
          Chi tiết đánh giá
        </h4>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full md:w-1/2">
            <div className="relative w-64 h-64 overflow-hidden border-2 rounded-2xl border-amber-200">
              {selectedRating.imgs && selectedRating.imgs.length > 0 ? (
                <img
                  src={selectedRating.imgs[currentImageIndex]}
                  alt={`Hình ảnh đánh giá ${currentImageIndex + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 rounded-2xl hover:scale-105"
                />
              ) : (
                <img
                  src="/images/placeholder.png"
                  alt="Hình ảnh mặc định"
                  className="object-cover w-full h-full rounded-2xl"
                />
              )}
              {selectedRating.imgs && selectedRating.imgs.length > 1 && (
                <div className="absolute inset-x-0 flex justify-between px-2 transform -translate-y-1/2 top-1/2">
                  <button
                    onClick={handlePrevImage}
                    className="flex items-center justify-center w-8 h-8 text-white transition-colors duration-200 rounded-full bg-amber-600 hover:bg-amber-700"
                    aria-label="Ảnh trước"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="flex items-center justify-center w-8 h-8 text-white transition-colors duration-200 rounded-full bg-amber-600 hover:bg-amber-700"
                    aria-label="Ảnh tiếp theo"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
              <button className="absolute text-xl transition-colors duration-200 text-amber-500 top-2 right-2 hover:text-red-500">
                <i className="fa-solid fa-heart"></i>
              </button>
            </div>
            <div className="mt-4">
              <div>
                <StarRating rating={selectedRating.ratingPoint} />
                <span className="block mt-1 text-lg text-gray-500 font-cute">
                  bởi: {selectedRating.userName || "Người dùng ẩn danh"}
                </span>
              </div>
              <p className="mt-2 text-lg text-gray-600 font-cute">
                Đánh giá: {selectedRating.comment || "Không có nhận xét"}
              </p>
            </div>
          </div>
          <div className="w-full space-y-2 text-right md:w-1/2">
            <p className="text-lg text-gray-700 font-cute">
              ID: {selectedRating.ratingId}
            </p>
            <p className="text-lg text-gray-700 font-cute">
              Điểm đánh giá: {selectedRating.ratingPoint} sao
            </p>
            <p className="text-lg text-gray-700 font-cute">
              Sản phẩm: {selectedRating.productId}
            </p>
            <p className="text-lg text-gray-700 font-cute">
              Ngày tạo:{" "}
              {new Date(selectedRating.createdAt).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="text-lg text-gray-700 font-cute">
              Tạo bởi: {selectedRating.createdBy || "Không xác định"}
            </p>
          </div>
        </div>
        <button
          className="px-6 py-2 mt-6 text-white transition-colors duration-200 rounded-full bg-amber-600 hover:bg-amber-700 font-cute"
          onClick={closeModal}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

export { RatingModal };