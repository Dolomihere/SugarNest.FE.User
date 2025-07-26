import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/products/sellable";

const ProductService = {
  getAllProducts: async () => await publicApi.get(endpoint),
  getProductById: async (productId) => await publicApi.get(`${endpoint}/${productId}`),
};

export default ProductService;import ProductOptionService from "../services/ProductOption";

import CartService from "../services/CartService";
import FavoriteService from "../services/FavoriteService";
import RatingService from "../services/RatingService";


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


  const { data: product = {}, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      ProductService.getProductById(id).then((res) => res.data.data),
  });

  const { data: optionGroups = [], isLoading: isOptionsLoading, error: optionsError } = useQuery({

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


  const { data: products = [] } = useQuery({
    queryKey: ["suggested"],
    queryFn: () => ProductService.getAllProducts().then((res) => res.data.data),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => FavoriteService.getFavorites().then((res) => res.data.data),
    enabled: !!isLoggedIn,
  });

  const isFavorite = useMemo(
    () => favorites.some((fav) => fav.productId === product.productId),
    [favorites, product.productId]
  );
  const {
    data: ratings = [],
    isLoading: isRatingsLoading,
    refetch: refetchRatings,
  } = useQuery({
    queryKey: ["ratings", id],
    queryFn: () =>
      RatingService.getRatingsByProductId(id).then((res) => res.data.data),
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

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để sử dụng chức năng yêu thích.");
      navigate("/signin", { state: { from: `/products/${id}` } });
      return;
    }

    try {
      if (isFavorite) {
        await FavoriteService.putFavorites([product.productId]);
      } else {
        await FavoriteService.addFavorites([product.productId]);
      }
      queryClient.invalidateQueries(["favorites"]);
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err.response?.data || err.message);
      alert("Đã xảy ra lỗi khi cập nhật danh sách yêu thích.");
    }
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
        options?.map((opt) => ({
          optionGroupId: opt.optionGroupId || opt.option_group_id,
          optionItemId: opt.optionItemId || opt.option_item_id,
        }))?.sort((a, b) =>
          a.optionGroupId.localeCompare(b.optionGroupId) || a.optionItemId.localeCompare(b.optionItemId)
        ) || [];


      const existingItem = cartData?.cartItems?.find(
        (cartItem) =>
          cartItem.productId === id &&
          JSON.stringify(normalizeOptions(cartItem.cartItemOptions)) ===
            JSON.stringify(normalizeOptions(item.productItemOptionModels))
      );

      if (existingItem) {
        await CartService.updateQuantity(existingItem.cartItemId, existingItem.quantity + quantity, token);

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
            <div className="flex flex-col gap-10 p-6 bg-white shadow-lg rounded-2xl md:flex-row md:gap-12 lg:gap-16">
              <div className="flex items-center justify-center w-full overflow-hidden md:w-1/2 rounded-xl">

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
                                  value={itemId}
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
                    onClick={toggleFavorite}
                    className={`text-2xl transition hover:text-amber-600 ${
                      isFavorite ? "text-amber-600" : "text-gray-400"
                    }`}
                    title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                  >
                    <i className={`fa${isFavorite ? "-solid" : "-regular"} fa-heart`}></i>

                  </button>
                  {copied && (
                    <div className="absolute px-2 py-1 text-xs text-white -translate-x-1/2 rounded shadow bg-amber-600 -top-8 left-1/2">
                      Đã sao chép!
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-800">Đánh giá từ người dùng</h3>
              {isRatingsLoading ? (
                <p className="text-gray-500">Đang tải đánh giá...</p>
              ) : ratings.length === 0 ? (
                <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
              ) : (
                <div className="space-y-6">
                  {ratings.map((rating) => (
                    <div
                      key={rating.ratingId}
                      className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-lg">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i
                              key={i}
                              className={`fa-star ${i < rating.ratingPoint ? "fas" : "far"}`}
                            ></i>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-800 whitespace-pre-line">{rating.comment}</p>
                      {rating.imgs?.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {rating.imgs.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Ảnh đánh giá ${idx + 1}`}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-800">Sản phẩm gợi ý</h3>
 

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                {suggestions.map((p) => (
                  <Link
                    key={p.productId}
                    to={`/products/${p.productId}`}
                    className="block transition-transform duration-300 hover:scale-105"
                  >
                    <div className="overflow-hidden bg-white shadow-md rounded-xl">
                      <img
                        src={p.imgs?.[0] || "/images/placeholder.png"}
                        alt={p.name}
                        className="object-cover w-full h-40"
                      />
                      <div className="p-4 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 transition hover:text-amber-600">
                          {p.name}
                        </h4>
                        <p className="mt-1 font-medium text-amber-600">
                          {Number(p.unitPrice).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-block px-6 py-3 text-white transition rounded-lg bg-amber-600 hover:bg-amber-700"

                >
                  {showRatings ? "Ẩn đánh giá" : "Hiện đánh giá"}
                </Link>
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
