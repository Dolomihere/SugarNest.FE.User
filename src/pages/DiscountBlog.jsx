import { useState, useRef, useEffect } from "react";
import { FaHeart, FaRegCopy, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Header } from './layouts/Header';
import { Footer } from './layouts/Footer';
import { motion, AnimatePresence } from "framer-motion";

export default function DiscountBlog() {
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const zoomCanvasRef = useRef(null);
  const zoomImgRef = useRef(null);
  const [isZooming, setIsZooming] = useState(false);
  const imageContainerRef = useRef(null);

  const isDealValid = (expiryDate) => {
    const today = new Date();
    const expDate = new Date(expiryDate);
    return expDate >= today;
  };

  const toggleFavorite = (code) => {
    setFavorites(prev =>
      prev.includes(code)
        ? prev.filter(fav => fav !== code)
        : [...prev, code]
    );
  };

  const deals = [
    {
      title: "Bánh Pizza Phô Mai Thập Cẩm",
      description: "Bánh pizza thơm ngon, đế giòn, phủ đầy phô mai và topping hấp dẫn.",
      discount: "50%",
      expiryDate: "2025-09-15",
      code: "BOGO50",
      category: "food",
      images: [
        "https://i.pinimg.com/1200x/fe/db/e9/fedbe9a5dd4a4ac48193a0471dfbb6ed.jpg",
        "https://i.pinimg.com/736x/cb/0e/97/cb0e97bfbf3c863a570cb2d1604314d0.jpg"
      ],
    },
    {
      title: "Bánh Mousse Dâu Tươi Mềm Mịn",
      description: "Lớp mousse dâu mịn mát, chua nhẹ ngọt thanh, trang trí đẹp mắt.",
      discount: "20%",
      expiryDate: "2025-07-10",
      code: "UPGRADE20",
      category: "food",
      images: [
        "https://i.pinimg.com/1200x/8b/1d/56/8b1d561692ad8b7aa8b0b3a0e58da7ea.jpg",
        "https://i.pinimg.com/1200x/ea/d4/4f/ead44fbf762d0b85bca3c51a12f3e4ba.jpg"
      ],
    },
    {
      title: "Bánh Mì Nướng Bơ Tỏi Kiểu Pháp",
      description: "Bánh mì giòn rụm, thấm đẫm bơ tỏi thơm lừng, thích hợp ăn sáng.",
      discount: "40%",
      expiryDate: "2025-09-01",
      code: "NIKE40",
      category: "food",
      images: [
        "https://i.pinimg.com/736x/05/ba/b7/05bab7a070576431c7b31dbf050288b0.jpg",
        "https://i.pinimg.com/736x/d0/a4/be/d0a4beba55a94b9b7601e51a5beac7a5.jpg"
      ],
    },
    {
      title: "Bánh Kem Sô-cô-la Nhân Dâu",
      description: "Bánh kem socola đậm vị, kết hợp lớp nhân dâu tươi mọng nước.",
      discount: "30%",
      expiryDate: "2025-07-20",
      code: "GALAXY30",
      category: "food",
      images: [
        "https://i.pinimg.com/1200x/b0/08/48/b00848c12d2e2a7f5b4538524f5323f0.jpg",
        "https://i.pinimg.com/736x/46/64/72/466472da435b8cfcf207025b8d57b6da.jpg"
      ],
    },
    {
      title: "Combo Bánh Tráng Miệng Cuối Tuần",
      description: "Gồm bánh macaron, cupcake, tart trái cây – ưu đãi freeship 100%.",
      discount: "100%",
      expiryDate: "2025-07-13",
      code: "FREESHIP",
      category: "food",
      images: [
        "https://i.pinimg.com/736x/d2/67/c1/d267c185c547dc1b3b20341b83882e13.jpg"
      ],
    },
    {
      title: "Bánh Flan Trứng Caramel Mịn Mượt",
      description: "Món bánh tráng miệng truyền thống, béo ngậy và ngọt ngào vừa phải.",
      discount: "33%",
      expiryDate: "2025-07-11",
      code: "HIGHLANDS33",
      category: "food",
      images: [
        "https://i.pinimg.com/1200x/03/cb/d0/03cbd01f88a0b5dca8206de95e7fe277.jpg"
      ],
    },
  ];

   const filteredDeals = deals.filter(deal => {
    const valid = isDealValid(deal.expiryDate);
    if (filterStatus === "valid") return valid;
    if (filterStatus === "expired") return !valid;
    if (filterStatus === "favorites") return favorites.includes(deal.code);
    return true;
  });

  const categoryIcons = {
    food: "🍔",
    fashion: "👟",
    electronics: "📱",
    ecommerce: "🛒",
  };

const imageRef = useRef(null);
const canvasRef = useRef(null);
const [magnifier, setMagnifier] = useState(null);

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


  return (
    <div className="min-h-screen bg-[#fdfaf7] text-[#4a3a2a] font-sans">
      <Header />

      <div className="w-full h-full">
        <img
          src="/images/banner.png"
          alt="Ưu đãi đặc biệt"
          className="w-full h-140 object-cover rounded-b-2xl shadow-md"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
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
              <option value="favorites">Đã yêu thích</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`${viewMode === "grid"
                  ? "bg-[#d98044] text-white"
                  : "bg-white text-[#5b3e2b]"} border px-3 py-1 rounded-full text-sm transition`}
              >
                Lưới
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`${viewMode === "list"
                  ? "bg-[#d98044] text-white"
                  : "bg-white text-[#5b3e2b]"} border px-3 py-1 rounded-full text-sm transition`}
              >
                Danh sách
              </button>
            </div>
          </div>
        </div>

        <div className={viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-6"}>
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
                  ${viewMode === 'list' ? 'flex flex-row gap-4 p-4 items-start border-l-4 border-[#d98044]' : ''}`}
              >
                <div className={`${viewMode === "list" ? "w-48 h-48 flex-shrink-0 relative" : "w-full relative"}`}>
  <img
    src={deal.images[0]}
    alt={deal.title}
    className={`${viewMode === "list"
      ? "w-full h-full object-cover rounded-xl"
      : "w-full h-48 object-cover"} ${!isValid ? "opacity-70 grayscale" : ""}`}
  />

  {/* Nhãn giảm giá và trái tim */}
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

  {/* Trái tim yêu thích */}
  <div
    className="absolute top-3 right-3 z-10"
    onClick={(e) => {
      e.stopPropagation();
      toggleFavorite(deal.code);
    }}
  >
    {favorites.includes(deal.code) ? (
      <FaHeart className="text-[#fd8c41] text-lg" />
    ) : (
      <FaHeart className="text-white stroke-[#d98044] stroke-[6px] text-lg" />
    )}
  </div>
</div>


                <div className={`flex flex-col justify-between flex-1 relative ${viewMode === "grid" ? "p-4" : ""}`}>
                  

                  <h3 className="font-semibold text-lg mb-1">
                    {categoryIcons[deal.category]} {deal.title}
                  </h3>
                  <p className="text-sm text-[#6b4b38]">{deal.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hết hạn: {new Date(deal.expiryDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MODAL + EFFECT + CAROUSEL */}
      <AnimatePresence>
  {selectedDeal && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden relative"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="md:w-1/2 bg-black relative flex items-center justify-center min-h-[512px] max-h-[512px] min-w-[512px] max-w-[512px]">
          {selectedDeal.images[selectedImageIndex].endsWith(".mp4") ? (
            <video
              src={selectedDeal.images[selectedImageIndex]}
              controls
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <div
  className="relative w-full h-full"
  onPointerMove={(e) => handleMagnify(e)}
  onPointerLeave={() => setMagnifier(null)}
  ref={imageContainerRef}
>
  <img
    ref={imageRef}
    src={selectedDeal.images[selectedImageIndex]}
    alt="Media"
    className="w-full h-full object-cover"
    style={{ touchAction: "none" }}
  />
  <canvas
    ref={canvasRef}
    className="absolute top-0 left-0 pointer-events-none"
    width={magnifier?.size || 0}
    height={magnifier?.size || 0}
    style={{
      display: magnifier ? "block" : "none",
      transform: `translate(${magnifier?.x || 0}px, ${magnifier?.y || 0}px)`,
      borderRadius: "9999px",
      border: "2px solid white",
      boxShadow: "0 0 6px rgba(0,0,0,0.3)",
    }}
  />
</div>

          )}
          {selectedDeal.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImageIndex(
                    selectedImageIndex === 0
                      ? selectedDeal.images.length - 1
                      : selectedImageIndex - 1
                  )
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex(
                    selectedImageIndex === selectedDeal.images.length - 1
                      ? 0
                      : selectedImageIndex + 1
                  )
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
        <div className="md:w-1/2 p-6 relative flex flex-col justify-between text-[#4a3a2a]">
          <button
            onClick={() => setSelectedDeal(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
          >
            &times;
          </button>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2 mt-2">
            <h2 className="text-xl font-semibold">{selectedDeal.title}</h2>
            <p className="text-sm text-gray-700">{selectedDeal.description}</p>
            <p className="text-sm text-gray-500">
              Hết hạn: {new Date(selectedDeal.expiryDate).toLocaleDateString("vi-VN")}
            </p>
            <p className="text-base font-bold text-[#d98044]">
              {selectedDeal.discount} GIẢM
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button
              className="bg-[#d98044] hover:bg-[#c46e35] text-white px-5 py-2 rounded-full w-full"
              onClick={() => {
                navigator.clipboard.writeText(selectedDeal.code);
                alert("Đã sao chép mã!");
              }}
            >
              Sao chép mã: {selectedDeal.code}
            </button>

            {/* Nút chia sẻ deal */}
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
                  alert("Thiết bị không hỗ trợ chia sẻ. Đã sao chép link.");
                }
              }}
            >
              Chia sẻ ưu đãi
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      <Footer />
    </div>
  );
}
