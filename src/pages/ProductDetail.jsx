import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import ProductService from "../services/ProductService";
import ProductOptionService from "../services/ProductOptionService";
import CartService from "../services/CartService";
import RatingService from "../services/RatingService";
import { StarRating } from "./StarRating";
import { RatingModal } from "./RatingModal";
import { RatingForm } from "./RatingForm";
import { SuggestedProducts } from "./SuggestedProducts";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showRatings, setShowRatings] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  const isLoggedIn = token && token !== "undefined" && token !== "null";

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedRating(null);
        setCurrentImageIndex(0); // Reset image index when closing modal
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user data if logged in
  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (isLoggedIn) {
      const decodeToken = () => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserName(payload.name || "Người dùng");
        } catch (e) {
          console.error("Error decoding token:", e);
          setUserName("Người dùng");
        }
      };
      decodeToken();
    }
  }, [token, isLoggedIn]);

  // Fetch cart data
  const { data: cartData } = useQuery({
    queryKey: ["userCart", token],
    queryFn: async () => {
      if (isLoggedIn) {
        const response = await CartService.getUserCart(token);
        return response.data.data || { cartItems: [] };
      }
      return { cartItems: [] };
    },
    enabled: !!isLoggedIn,
  });

  // Fetch product data
  const { data: product = {}, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      ProductService.getProductById(id).then((res) => res.data.data),
  });

  // Fetch product options
  const {
    data: optionGroups = [],
    isLoading: isOptionsLoading,
    error: optionsError,
  } = useQuery({
    queryKey: ["options", id],
    queryFn: () => ProductOptionService.getOptionOfProductById(id),
    onError: (error) => {
      console.error(
        "Failed to fetch product options:",
        error.response?.data || error.message
      );
      setErrorMessage(
        `Lỗi khi tải tùy chọn sản phẩm: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Fetch ratings for the product
  const { data: ratingsData = { data: [] }, isLoading: isRatingsLoading } =
    useQuery({
      queryKey: ["ratings", id],
      queryFn: () =>
        RatingService.getRatingsByProduct(id, token).then((res) => res.data),
      enabled: !!id,
    });

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (ratingsData.data.length === 0) return 0;
    const totalStars = ratingsData.data.reduce((sum, r) => {
      if (typeof r.ratingPoint !== "number" || isNaN(r.ratingPoint)) {
        console.error("Invalid ratingPoint found in ratings data:", r);
        setErrorMessage(
          "Lỗi: Giá trị ratingPoint không hợp lệ trong dữ liệu đánh giá."
        );
        return sum;
      }
      return sum + r.ratingPoint;
    }, 0);
    return totalStars / ratingsData.data.length;
  }, [ratingsData]);

  // Fetch suggested products
  const { data: products = [] } = useQuery({
    queryKey: ["suggested"],
    queryFn: () => ProductService.getAllProducts().then((res) => res.data.data),
  });

  const suggestions = useMemo(() => {
    const otherProducts = products.filter((p) => p.productId !== id);
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [products, id]);

  // Mutation for posting a new rating with image upload
  const postRatingMutation = useMutation({
    mutationFn: async (payload) => {
      return RatingService.postRating(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ratings", id]);
      setRating(0);
      setComment("");
      setImages([]);
      setErrorMessage("");
      alert("Đánh giá đã được gửi!");
      if (inputRef.current) {
        inputRef.current.value = null;
      }
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.title || error.message;
      const detailedMsg = error.response?.data?.errors
        ? JSON.stringify(error.response.data.errors)
        : "";
      setErrorMessage(
        `Lỗi khi gửi đánh giá: ${errorMsg} ${
          detailedMsg ? ` - Chi tiết: ${detailedMsg}` : ""
        }`
      );
      if (error.message.includes("Phiên đăng nhập hết hạn")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        navigate("/signin", { state: { from: `/products/${id}` } });
      }
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setSelectedOptions((prev) => {
      const group = prev[name] || [];
      return {
        ...prev,
        [name]: checked ? [...group, value] : group.filter((v) => v !== value),
      };
    });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setErrorMessage("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate("/signin", { state: { from: `/products/${id}` } });
      return;
    }

    const optionEntries = Object.entries(selectedOptions)
      .flatMap(([groupId, values]) => {
        if (Array.isArray(values)) {
          return values.map((v) => ({
            optionGroupId: groupId,
            optionItemId: v,
          }));
        } else {
          return [{ optionGroupId: groupId, optionItemId: values }];
        }
      })
      .sort(
        (a, b) =>
          a.optionGroupId.localeCompare(b.optionGroupId) ||
          a.optionItemId.localeCompare(b.optionItemId)
      );

    const item = {
      productId: id,
      note: null,
      quantity: quantity,
      productItemOptionModels: optionEntries,
    };

    try {
      const normalizeOptions = (options) =>
        options
          ?.map((opt) => ({
            optionGroupId: opt.optionGroupId || opt.option_group_id,
            optionItemId: opt.optionItemId || opt.option_item_id,
          }))
          ?.sort(
            (a, b) =>
              a.optionGroupId.localeCompare(b.optionGroupId) ||
              a.optionItemId.localeCompare(b.optionItemId)
          ) || [];

      const existingItem = cartData?.cartItems?.find(
        (cartItem) =>
          cartItem.productId === id &&
          JSON.stringify(normalizeOptions(cartItem.cartItemOptions)) ===
            JSON.stringify(normalizeOptions(item.productItemOptionModels))
      );

      if (existingItem) {
        await CartService.updateQuantity(
          existingItem.cartItemId,
          existingItem.quantity + quantity,
          token
        );
      } else {
        await CartService.addItemToCart(item, token);
      }
      queryClient.invalidateQueries(["userCart"]);
      setErrorMessage("");
      alert("Đã thêm vào giỏ hàng!");
      setQuantity(1);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setErrorMessage(`Lỗi khi thêm vào giỏ hàng: ${errorMsg}`);
      if (error.message.includes("Phiên đăng nhập hết hạn")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        navigate("/signin", { state: { from: `/products/${id}` } });
      }
    }
  };

  useEffect(() => {
    setQuantity(1);
    setCopied(false);
    setRating(0);
    setComment("");
    setImages([]);
    setErrorMessage("");
    setCurrentImageIndex(0); // Reset image index on product change
  }, [id]);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-gray-800">
      <Header />
      <div className="px-4 mx-auto my-12 space-y-16 max-w-7xl">
        {isProductLoading || isOptionsLoading || isRatingsLoading ? (
          <p className="text-lg text-center text-amber-600">Đang tải...</p>
        ) : optionsError ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : (
          <>
            {/* Product Details */}
            <div className="relative flex flex-col gap-10 p-6 transition-shadow duration-300 bg-white border shadow-md border-amber-200 rounded-2xl hover:shadow-lg md:flex-row md:gap-12 lg:gap-16">
              <button className="absolute text-xl transition-colors duration-200 top-4 right-4 text-amber-500 hover:text-red-500">
                <i className="fa-solid fa-heart"></i>
              </button>
              <div className="flex items-center justify-center w-full overflow-hidden rounded-2xl md:w-1/2">
                <img
                  src={product.imgs?.[0] || "/images/placeholder.png"}
                  alt={product.name || "Sản phẩm"}
                  className="object-cover w-full transition-transform duration-300 rounded shadow h-96 Elf-2xl hover:scale-105"
                />
              </div>
              <div className="w-full space-y-6 md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 transition-colors duration-200 md:text-4xl hover:text-amber-600">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} />
                  <span className="text-sm text-gray-500">
                    ({ratingsData.data.length} đánh giá)
                  </span>
                </div>
                <p className="text-xl leading-relaxed text-gray-600">
                  {product.description}
                </p>
                <p className="text-2xl font-semibold text-amber-600">
                  {Number(product.unitPrice).toLocaleString("vi-VN")}₫
                </p>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>
                    <span className="font-medium text-gray-700">
                      Trọng lượng:
                    </span>{" "}
                    rating
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Hạn sử dụng:
                    </span>{" "}
                    7 ngày kể từ ngày sản xuất
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Thành phần:
                    </span>{" "}
                    Bột mì, đường, n, bơng, đườ, d, mì, dầu thực, n,...  
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Ngày sản xuất:
                    </span>{" "}
                    {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
                {optionGroups.length > 0 ? (
                  optionGroups.map((group) => (
                    <div key={group.optionGroupId} className="space-y-2">
                      <p className="text-2xl font-medium text-gray-700">
                        {group.name}
                      </p>
                      <p className="text-sm text-amber-600">
                        {group.description}
                      </p>
                      <div className="mt-2 space-y-2">
                        {group.isMultipleChoice
                          ? group.optionItems?.map((item) => (
                              <label
                                key={item.optionItemId}
                                className="flex items-center gap-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  name={group.optionGroupId}
                                  value={itemId}
                                  onChange={handleCheckboxChange}
                                  className="accent-amber-600"
                                />
                                <span>
                                  {item.optionValue}{" "}
                                  <span className="text-gray-400">
                                    (+
                                    {Number(
                                      item.additionalPrice
                                    ).toLocaleString("vi-VN")}

                                    ₫)
                                  </span>
                                </span>
                              </label>
                            ))
                          : group.optionItems?.map((item) => (
                              <label
                                key={item.optionItemId}
                                className="flex items-center gap-2 text-sm"
                              >
                                <input
                                  type="radio"
                                  name={group.optionGroupId}
                                  value={itemId"
                                  onChange={handleRadioChange}
                                  className="accent-amber-600"
                                />
                                <span>
                                  {item.optionValue}{" "}
                                  <span className="text-gray-400">
                                    (+
                                    {Number(
                                      item.additionalPrice
                                    ).toLocaleString("vi-VN")}
                                    ₫)
                                  </span>
                                </span>
                              </label>
                            ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Không có tùy chọn nào cho sản phẩm này.
                  </p>
                )}
                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 text-xl font-bold text-gray-700 transition-colors duration-200 bg-gray-100 rounded-full hover:bg-amber-100"
                  >
                    -
                  </button>
                  <span className="text-xl font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 text-xl font-bold text-gray-700 transition-colors duration-200 bg-gray-100 rounded-full hover:bg-amber-100"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3 text-white transition rounded-lg bg-amber-600 hover:bg-amber-700"
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    className="text-2xl transition text-amber-500 hover:text-blue-500"
                    title="Sao chép liên kết"
                    onClick={handleCopy}
                  >
                    <i className="fa-regular fa-copy fa-lg"></i>
                  </button>
                  {copied && (
                    <div className="absolute px-2 py-1 text-xs text-white -translate-x-1/2 rounded shadow bg-amber-600 -top-8 left-1/2">
                      Đã sao chép!
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Ratings Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  Đánh giá sản phẩm
                </h3>
                <button
                  onClick={() => setShowRatings(!showRatings)}
                  className="px-4 py-2 text-white rounded-lg bg-amber-600 hover:bg-amber-700"
                >
                  {showRatings ? "Ẩn đánh giá" : "Hiện đánh giá"}
                </button>
              </div>
              {showRatings && ratingsData.data.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <StarRating rating={averageRating} />
                    <span className="text-sm text-gray-500">
                      {averageRating.toFixed(1)} ({ratingsData.data.length} đánh
                      giá)
                    </span>
                  </div>
                  <div className="space-y-4">
                    {ratingsData.data.map((r) => {
                      if (
                        typeof r.ratingPoint !== "number" ||
                        isNaN(r.ratingPoint)
                      ) {
                        console.error("Invalid ratingPoint for rating:", r);
                        return null;
                      }
                      return (
                        <div
                          key={r.ratingId}
                          className="p-4 transition-shadow duration-300 bg-white border rounded-lg shadow cursor-pointer border-amber-200 hover:shadow-md"
                          onClick={() => setSelectedRating(r)}
                        >
                          <div className="flex items-center gap-2">
                            <StarRating rating={r.ratingPoint} />
                            <span className="text-sm text-gray-500">
                              bởi {r.userName || "Người dùng ẩn danh"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            {r.comment || "Không có nhận xét"}
                          </p>
                          {r.imgs && r.imgs.length > 0 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                              {r.imgs.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Hình ảnh đánh giá ${idx + 1}`}
                                  className="object-cover w-24 h-24 rounded"
                                  onError={(e) =>
                                    (e.target.src = "/images/placeholder.png")
                                  }
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : showRatings ? (
                <p className="text-sm text-gray-500">
                  Chưa có đánh giá nào cho sản phẩm này.
                </p>
              ) : null}
              <RatingModal
                selectedRating={selectedRating}
                modalRef={modalRef}
                currentImageIndex={currentImageIndex}
                handlePrevImage={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? (selectedRating.imgs?.length || 1) - 1 : prev - 1
                  )
                }
                handleNextImage={() =>
                  setCurrentImageIndex((prev) =>
                    prev === (selectedRating.imgs?.length || 1) - 1 ? 0 : prev + 1
                  )
                }
                closeModal={() => setSelectedRating(null)}
              />
              <RatingForm
                isLoggedIn={isLoggedIn}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                images={images}
                setImages={setImages}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                postRatingMutation={postRatingMutation}
                inputRef={inputRef}
                productId={id}
                navigate={navigate}
              />
            </div>
            <SuggestedProducts suggestions={suggestions} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}