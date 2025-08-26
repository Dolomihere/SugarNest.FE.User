import { useState, useRef, useEffect } from "react";
import {
  FaHeart,
  FaRegCopy,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function DiscountBlog() {
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [magnifier, setMagnifier] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 9; // Bạn có thể chỉnh tùy ý
  const [totalCount, setTotalCount] = useState(0);

  const API_URL = "https://sugarnest-api.io.vn/vouchers";

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL, {
          params: {
            pageIndex,
            pageSize,
          },
          headers: {
            Accept: "*/*",
          },
        });

        const voucherData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        const total = response.data?.meta?.totalCount || 0;
        setTotalCount(total);

        const mappedDeals = voucherData.map((voucher) => ({
          title: voucher.name || "Không có tiêu đề",
          description: voucher.description || "Không có mô tả",
          minPriceCondition: voucher.minPriceCondition,
          discount: voucher.percentValue
            ? `${voucher.percentValue}%`
            : voucher.hardValue
            ? `${voucher.hardValue.toLocaleString("vi-VN")}đ`
            : "N/A",
          expiryDate: voucher.endTime,
          startDate: voucher.startTime,
          code: voucher.voucherId || "N/A",
          category: "food",
          images:
            voucher.imgs && voucher.imgs.length
              ? voucher.imgs
              : ["../../public/images/banner.png"],
        }));

        setDeals(mappedDeals);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy voucher:", err);
        setError(
          "Không thể tải voucher. Vui lòng kiểm tra kết nối hoặc thử lại sau."
        );
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [pageIndex]);

  const isDealValid = (expiryDate) => {
    const today = new Date();
    const expDate = new Date(expiryDate);
    return expDate >= today;
  };

  const filteredDeals = deals.filter((deal) => {
    const valid = isDealValid(deal.expiryDate);
    if (filterStatus === "valid") return valid;
    if (filterStatus === "expired") return !valid;
    return true;
  });

  const categoryIcons = {
    food: "🍔",
    fashion: "👟",
    electronics: "📱",
    ecommerce: "🛒",
  };

  const handleMagnify = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const size = 100;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ctx = canvasRef.current.getContext("2d");
    const img = imageRef.current;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      img,
      (x + size / 2) * (img.naturalWidth / img.clientWidth) - size / 4,
      (y + size / 2) * (img.naturalHeight / img.clientHeight) - size / 4,
      size / 2,
      size / 2,
      0,
      0,
      size,
      size
    );

    ctx.restore();
    setMagnifier({ x, y, size });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] text-[#4a3a2a] font-sans">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p>Đang tải voucher...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] text-[#4a3a2a] font-sans">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] text-[#4a3a2a] font-sans">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10 min-h-[100vh]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">Ưu Đãi Mới Nhất</h2>
          <div className="flex gap-4 items-center flex-wrap">
            <select
              className="border rounded px-3 py-1 text-sm bg-white text-[#5b3e2b]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="valid">Còn hiệu lực</option>
              <option value="expired">Hết hạn</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`${
                  viewMode === "grid"
                    ? "bg-[#d98044] text-white"
                    : "bg-white text-[#5b3e2b]"
                } border px-3 py-1 rounded-full text-sm transition`}
              >
                Lưới
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`${
                  viewMode === "list"
                    ? "bg-[#d98044] text-white"
                    : "bg-white text-[#5b3e2b]"
                } border px-3 py-1 rounded-full text-sm transition`}
              >
                Danh sách
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách voucher */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-6"
          }
        >
          {filteredDeals.map((deal, i) => {
            const isValid = isDealValid(deal.expiryDate);
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={i}
                onClick={() => {
                  setSelectedDeal(deal);
                  setSelectedImageIndex(0);
                }}
                className={`transition transform hover:-translate-y-1 hover:shadow-lg bg-white rounded-2xl shadow-sm border border-[#f0e8e1] overflow-hidden relative cursor-pointer
                  ${
                    viewMode === "list"
                      ? "flex flex-row gap-4 p-4 items-start border-l-4 border-[#d98044]"
                      : ""
                  }`}
              >
                <div
                  className={`${
                    viewMode === "list"
                      ? "w-48 h-48 flex-shrink-0 relative"
                      : "w-full relative"
                  }`}
                >
                  <img
                    src={deal.images[0]}
                    alt={deal.title}
                    className={`${
                      viewMode === "list"
                        ? "w-full h-full object-cover rounded-xl"
                        : "w-full h-48 object-cover"
                    } ${!isValid ? "opacity-70 grayscale" : ""}`}
                  />
                  {viewMode !== "list" && (
                    <div className="absolute top-3 left-3 flex flex-row gap-2 z-10">
                      <div className="bg-[#d98044] text-white text-xs px-2 py-1 rounded shadow-sm">
                        {deal.discount} GIẢM
                      </div>
                      {isValid && (
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow-sm">
                          MỚI
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`flex flex-col justify-between flex-1 relative ${
                    viewMode === "grid" ? "p-4" : ""
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-1">
                    {categoryIcons[deal.category]} {deal.title}
                  </h3>
                  <p className="text-sm text-[#6b4b38]">{deal.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hết hạn:{" "}
                    {new Date(deal.expiryDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Phân trang */}
        <div className="flex justify-center mt-10 gap-4 items-center">
          <button
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
            disabled={pageIndex === 1}
            className="px-4 py-2 rounded border bg-white text-[#5b3e2b] hover:bg-gray-100 disabled:opacity-50"
          >
            Trang trước
          </button>
          <span className="text-[#5b3e2b] font-medium">
            Trang {pageIndex} / {Math.ceil(totalCount / pageSize)}
          </span>
          <button
            onClick={() =>
              setPageIndex((prev) =>
                prev < Math.ceil(totalCount / pageSize) ? prev + 1 : prev
              )
            }
            disabled={pageIndex >= Math.ceil(totalCount / pageSize)}
            className="px-4 py-2 rounded border bg-white text-[#5b3e2b] hover:bg-gray-100 disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>

        {/* Phần chi tiết hiển thị inline */}
        <AnimatePresence>
          {selectedDeal && (
            <motion.div className="fixed inset-0 bg-gray-100/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
              <motion.div
                className="bg-white rounded-2xl shadow-sm border border-[#f0e8e1] p-6 max-w-4xl w-full max-h-[90vh] overflow-auto relative"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Nút đóng */}
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl z-10"
                >
                  &times;
                </button>

                <div className="flex flex-col md:flex-row gap-6 mt-6">
                  {/* Phần hình ảnh */}
                  <div className="md:w-1/2 relative">
                    <div
                      className="relative w-full h-96"
                      onPointerMove={(e) => handleMagnify(e)}
                      onPointerLeave={() => setMagnifier(null)}
                    >
                      {selectedDeal.images[selectedImageIndex].endsWith(
                        ".mp4"
                      ) ? (
                        <video
                          src={selectedDeal.images[selectedImageIndex]}
                          controls
                          autoPlay
                          loop
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <>
                          <img
                            ref={imageRef}
                            src={selectedDeal.images[selectedImageIndex]}
                            alt="Media"
                            className="w-full h-full object-cover rounded-xl"
                            style={{ touchAction: "none" }}
                          />
                          <canvas
                            ref={canvasRef}
                            className="absolute top-0 left-0 pointer-events-none"
                            width={magnifier?.size || 0}
                            height={magnifier?.size || 0}
                            style={{
                              display: magnifier ? "block" : "none",
                              transform: `translate(${magnifier?.x || 0}px, ${
                                magnifier?.y || 0
                              }px)`,
                              borderRadius: "9999px",
                              border: "2px solid white",
                              boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                            }}
                          />
                        </>
                      )}
                      {selectedDeal.images.length > 1 && (
                        <div className="absolute top-1/2 flex justify-between w-full px-2 transform -translate-y-1/2">
                          <button
                            onClick={() =>
                              setSelectedImageIndex(
                                selectedImageIndex === 0
                                  ? selectedDeal.images.length - 1
                                  : selectedImageIndex - 1
                              )
                            }
                            className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={() =>
                              setSelectedImageIndex(
                                selectedImageIndex ===
                                  selectedDeal.images.length - 1
                                  ? 0
                                  : selectedImageIndex + 1
                              )
                            }
                            className="bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phần thông tin chi tiết */}
                  <div className="md:w-1/2 flex flex-col justify-between">
                    <div className="flex flex-col gap-4">
                      <h2 className="text-xl font-semibold">
                        {selectedDeal.title}
                      </h2>
                      <div >
                        Áp dụng cho đơn từ: {selectedDeal.minPriceCondition.toLocaleString()}đ
                      </div>

                      <p className="text-sm text-gray-700">
                        {selectedDeal.description}
                      </p>

                      <p className="text-sm text-gray-500">
                        Bắt đầu:{" "}
                        {new Date(selectedDeal.startDate).toLocaleDateString(
                          "vi-VN"
                        )}{" "}
                        <br />
                        Hết hạn:{" "}
                        {new Date(selectedDeal.expiryDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>

                      <p className="text-base font-bold text-[#d98044]">
                        {selectedDeal.discount} GIẢM
                      </p>
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                  
                      <button
                        className="bg-white border border-[#d98044] text-[#d98044] hover:bg-[#ffe5d4] px-5 py-2 rounded-full w-full"
                        onClick={async () => {
                          const shareData = {
                            title: selectedDeal.title,
                            text: `Xem ưu đãi "${selectedDeal.title}" với mã ${selectedDeal.code}`,
                            url: window.location.href,
                          };
                          if (navigator.share) {
                            try {
                              await navigator.share(shareData);
                            } catch (err) {
                              console.log("Chia sẻ bị huỷ");
                            }
                          } else {
                            navigator.clipboard.writeText(shareData.url);
                            alert(
                              "Thiết bị không hỗ trợ chia sẻ. Đã sao chép link."
                            );
                          }
                        }}
                      >
                        Chia sẻ ưu đãi
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
