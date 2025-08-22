import { StarRating } from "./StarRating";

function RatingForm({
  isLoggedIn,
  rating,
  setRating,
  comment,
  setComment,
  images,
  setImages,
  errorMessage,
  setErrorMessage,
  postRatingMutation,
  inputRef,
  productId,
  navigate,
  userId,
}) {
  const handleImageChange = (e) => {
    const files = [...e.target.files];
    const maxSize = 1024 * 1024; // 1MB
    const validFiles = files.filter(
      (file) =>
        file.size <= maxSize &&
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );
    if (files.length !== validFiles.length) {
      setErrorMessage(
        "Một số file không hợp lệ. Vui lòng chọn file JPG/PNG dưới 1MB."
      );
    }
    setImages(validFiles);
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isLoggedIn) {
      setErrorMessage("Vui lòng đăng nhập để gửi đánh giá.");
      navigate("/signin", { state: { from: `/products/${productId}` } });
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage("Vui lòng chọn số sao từ 1 đến 5.");
      return;
    }

    if (!userId) {
      setErrorMessage("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("ratingPoint", rating);
    formData.append("comment", comment);
    formData.append("userId", userId); // giữ userId để backend lưu và hiển thị tên
    images.forEach((img) => formData.append("imgFiles", img));

    postRatingMutation.mutate(formData, {
      onSuccess: () => {
        setRating(0);
        setComment("");
        setImages([]);
        if (inputRef.current) inputRef.current.value = null;
      },
    });
  };

  return (
    isLoggedIn && (
      <form
        onSubmit={handleSubmitRating}
        className="p-6 space-y-4 transition-shadow duration-300 bg-white border rounded-lg shadow border-amber-200 hover:shadow-md"
      >
        <h4 className="text-lg font-semibold text-gray-800 font-cute">
          Gửi đánh giá của bạn
        </h4>
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <div>
          <StarRating rating={rating} interactive={true} onChange={setRating} />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Viết nhận xét của bạn..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          rows={4}
        />
        <div className="relative">
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-amber-600"
          >
            <span className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-amber-600 hover:bg-amber-700 font-cute">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              Chọn ảnh (JPG/PNG, tối đa 1MB)
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((image, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(image)}
                alt={`Ảnh xem trước ${idx + 1}`}
                className="object-cover w-24 h-24 rounded"
              />
            ))}
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-white rounded-lg bg-amber-600 hover:bg-amber-700 font-cute"
          disabled={postRatingMutation.isLoading}
        >
          {postRatingMutation.isLoading ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    )
  );
}

export { RatingForm };
