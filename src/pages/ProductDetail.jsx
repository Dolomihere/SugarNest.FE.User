import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import ProductService from "../services/ProductService";
import ProductOptionService from "../services/ProductOption";
import CartService from "../services/CartService";
import RatingService from "../services/RatingService";
import CategoryService from "../services/CategoryService";
import { StarRating } from "./StarRating";
import { RatingModal } from "./RatingModal";
import { RatingForm } from "./RatingForm";
import { SuggestedProducts } from "./SuggestedProducts";
import ToastMessage from "../components/ToastMessage";
import { VoucherSelect } from "./components/VoucherSelect";
import VoucherService from "../services/VoucherService";

export function ProductDetailPage() {
  const [toast, setToast] = useState(null);
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
  const accessToken = localStorage.getItem("accessToken");

  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  const isLoggedIn = token && token !== "undefined" && token !== "null";

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedRating(null);
        setCurrentImageIndex(0);
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

  // Fetch category data
  const { data: category = {}, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category", product.categoryId],
    queryFn: () =>
      CategoryService.getCategoryById(product.categoryId).then(
        (res) => res.data.data
      ),
    enabled: !!product.categoryId,
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
      setToast({
        type: "error",
        message: `Lỗi khi tải tùy chọn sản phẩm: ${
          error.response?.data?.message || error.message
        }`,
      });
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
        setToast({
          type: "error",
          message:
            "Lỗi: Giá trị ratingPoint không hợp lệ trong dữ liệu đánh giá.",
        });
        return sum;
      }
      return sum + r.ratingPoint;
    }, 0);
    return totalStars / ratingsData.data.length;
  }, [ratingsData]);

  // Fetch all products for suggestions
  const { data: products = [] } = useQuery({
    queryKey: ["suggested"],
    queryFn: () => ProductService.getAllProducts().then((res) => res.data.data),
  });

  // Filter suggestions by category
  const suggestions = useMemo(() => {
    if (!product.categoryId) return [];
    const filteredProducts = products.filter(
      (p) => p.categoryId === product.categoryId && p.productId !== id
    );
    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [products, id, product.categoryId]);

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
      setToast({ type: "success", message: "Đánh giá đã được gửi!" });
      if (inputRef.current) {
        inputRef.current.value = null;
      }
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.title || error.message;
      const detailedMsg = error.response?.data?.errors
        ? JSON.stringify(error.response.data.errors)
        : "";
      setToast({
        type: "error",
        message: `Lỗi khi gửi đánh giá: ${errorMsg}${
          detailedMsg ? ` - ${detailedMsg}` : ""
        }`,
      });
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

  const [checkChange, setCheckChange] = useState(true);
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCheckChange(!checkChange);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setToast({
        type: "warning",
        message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
      });
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

    let voucherId = null;
    if (voucher && !checkVoucher()) {
      voucherId = voucher.userItemVoucherId;
    }

    const item = {
      productId: id,
      note: null,
      quantity: quantity,
      userItemVoucherId: voucherId,
      productItemOptionModels: optionEntries,
    };

    console.log(item);

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

      // if (existingItem) {
      //   await CartService.updateQuantity(
      //     existingItem.cartItemId,
      //     existingItem.quantity + quantity,
      //     token
      //   );
      // } else {
      //   await CartService.addItemToCart(item, token);
      // }

      await CartService.addItemToCart(item, token);

      queryClient.invalidateQueries(["userCart"]);
      setErrorMessage("");
      setToast({ type: "success", message: "Đã thêm vào giỏ hàng!" });
      setQuantity(1);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setToast({
        type: "error",
        message: `Lỗi khi thêm vào giỏ hàng: ${errorMsg}`,
      });
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
    setCurrentImageIndex(0);
  }, [id]);

  const getTotalAdditionalPrice = () => {
    let total = 0;
    optionGroups.forEach((group) => {
      const selected = selectedOptions[group.optionGroupId];
      if (!selected) return;

      const items = Array.isArray(selected) ? selected : [selected];
      items.forEach((id) => {
        const item = group.optionItems.find(
          (i) => i.optionItemId === id || i.optionItemId === Number(id)
        );
        if (item) total += Number(item.additionalPrice || 0);
      });
    });
    return total;
  };

  // Lấy voucher người dùng
  const { data: userVouchers = [] } = useQuery({
    queryKey: ["userVouchers", accessToken],
    queryFn: () =>
      VoucherService.getUserItemVouchers(accessToken).then((data) =>
        data.map((v) => ({
          voucherId: v.itemVoucherId,
          name: v.productName,
          percentValue: v.percentValue,
          hardValue: v.hardValue,
          ...v,
        }))
      ),
    enabled: isLoggedIn,
  });
  const [voucher, setVoucher] = useState();
  const handleSelectItemVoucher = (value) => {
    const selectedVoucher = userVouchers.find((v) => v.itemVoucherId === value);
    setVoucher(selectedVoucher || undefined);
  };
  // State tổng tiền
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);

  // Hàm kiểm tra voucher hợp lệ
  function checkVoucher() {
    if (!voucher) return false;
    return (
      voucher.productId !== product.productId ||
      voucher.minQuantity > quantity ||
      voucher.maxQuantity < quantity
    );
  }

  // Tính lại tổng tiền khi product, quantity, voucher hoặc options thay đổi
  useEffect(() => {
    if (!product?.finalUnitPrice) return;

    // Giá gốc (theo số lượng)
    const basePrice = Number(product.finalUnitPrice) * quantity;

    // Giá tăng thêm từ option
    const additionalPrice = getTotalAdditionalPrice() * quantity;

    // Tính giảm giá (nếu voucher hợp lệ)
    let discount = 0;
    if (voucher && !checkVoucher()) {
      discount =
        voucher.hardValue > 0
          ? voucher.hardValue * quantity
          : ((product.finalUnitPrice * voucher.percentValue) / 100) * quantity;
    }

    // Tổng tiền cuối cùng
    const total = basePrice + additionalPrice - discount;
    setFinalTotalPrice(total);
  }, [product, quantity, voucher, selectedOptions, checkChange]);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-gray-800">
      <Header />
      <div className="px-4 mx-auto my-12 space-y-16 max-w-7xl">
        {isProductLoading ||
        isOptionsLoading ||
        isRatingsLoading ||
        isCategoryLoading ? (
          <p className="text-lg text-center text-amber-600">Đang tải...</p>
        ) : optionsError ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : (
          <>
            {/* Product Details */}
            <div className="relative flex flex-col gap-8 p-6 transition-shadow duration-300 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-lg md:flex-row md:gap-12 lg:gap-20">
              {/* Image Section */}
              <div className="flex items-center justify-center w-full md:w-1/2">
                <img
                  src={product.imgs?.[0] || "/images/placeholder.png"}
                  alt={product.name || "Sản phẩm"}
                  className="object-cover w-full h-[380px] rounded-2xl shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              {/* Details Section */}
              <div className="w-full space-y-6 md:w-1/2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  {product.name}
                </h2>

                {/* Category Display */}
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Danh mục:</span>{" "}
                  <Link className="text-amber-600 hover:underline">
                    {category.name || "Không xác định"}
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} />
                  <span className="text-sm text-gray-500">
                    ({ratingsData.data.length} đánh giá)
                  </span>
                </div>

                <p className="text-base leading-relaxed text-gray-600">
                  {product.description}
                </p>

                <p className="text-2xl font-semibold text-amber-600">
                  {Number(product.finalUnitPrice).toLocaleString("vi-VN")}₫
                </p>

                <div className="space-y-1 text-sm text-gray-500">
                  <p>
                    <span className="font-medium text-gray-700">
                      Trọng lượng:
                    </span>{" "}
                    500g
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
                    Bột mì, đường, trứng, bơ, sữa, dầu thực vật,...
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Ngày sản xuất:
                    </span>{" "}
                    {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Options */}
            <div className="p-6 mt-10 bg-white border shadow-sm border-amber-200 rounded-2xl">
              <h4 className="pb-3 mb-6 text-2xl font-semibold text-gray-800 border-b border-amber-100">
                Tùy chọn sản phẩm
              </h4>

              {optionGroups.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {optionGroups.map((group) => (
                    <div
                      key={group.optionGroupId}
                      className="p-4 space-y-4 border border-gray-100 shadow-sm bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="text-base font-medium text-gray-800">
                          {group.name}
                        </p>
                        {group.description && (
                          <p className="mt-1 text-sm italic text-gray-500">
                            {group.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        {group.isMultipleChoice
                          ? group.optionItems?.map((item) => (
                              <label
                                key={item.optionItemId}
                                className="flex items-center p-3 transition bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-amber-400 hover:shadow-sm"
                              >
                                <input
                                  type="checkbox"
                                  name={group.optionGroupId}
                                  value={item.optionItemId}
                                  onChange={handleCheckboxChange}
                                  className="w-4 h-4 mr-3 accent-amber-500"
                                />
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">
                                    {item.optionValue}
                                  </span>{" "}
                                  <span className="ml-1 text-gray-400">
                                    (+
                                    {Number(
                                      item.additionalPrice
                                    ).toLocaleString("vi-VN")}
                                    ₫)
                                  </span>
                                </div>
                              </label>
                            ))
                          : group.optionItems?.map((item) => (
                              <label
                                key={item.optionItemId}
                                className="flex items-center p-3 transition bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-amber-400 hover:shadow-sm"
                              >
                                <input
                                  type="radio"
                                  name={group.optionGroupId}
                                  value={item.optionItemId}
                                  onChange={handleRadioChange}
                                  className="w-4 h-4 mr-3 accent-amber-500 appearance-none rounded-full border border-gray-300 checked:bg-amber-500 checked:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />

                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">
                                    {item.optionValue}
                                  </span>{" "}
                                  <span className="ml-1 text-gray-400">
                                    (+
                                    {Number(
                                      item.additionalPrice
                                    ).toLocaleString("vi-VN")}
                                    ₫)
                                  </span>
                                </div>
                              </label>
                            ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Không có tùy chọn nào cho sản phẩm này.
                </p>
              )}

              <div className="my-12">
                <VoucherSelect
                  list={userVouchers}
                  onSelect={handleSelectItemVoucher}
                ></VoucherSelect>
                {voucher && (
                  <div
                    className={`mt-4 rounded-lg border relative border-gray-300 dark:border-gray-600 p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                      (voucher.productId != product.productId ||
                        voucher.minQuantity > quantity ||
                        voucher.maxQuantity < quantity) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <button
                      onClick={() => setVoucher(undefined)} // hoặc hàm xử lý bạn muốn
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-md 
               bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white 
               text-gray-600 dark:text-gray-300 shadow transition"
                    >
                      {/* SVG Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        🎁 Voucher cho:{" "}
                        {voucher.productName ?? "Sản phẩm bất kỳ"}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      📅 Hiệu lực: {voucher.startTime.toLocaleString("vi-VN")}
                      <span> đến </span>
                      {voucher.endTime.toLocaleString("vi-VN")}
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span>📦 Áp dụng nếu mua </span>
                      {voucher.minQuantity == voucher.maxQuantity ? (
                        <span>{voucher.minQuantity} sản phẩm</span>
                      ) : (
                        <span>
                          từ {voucher.minQuantity} đến {voucher.maxQuantity} sản
                          phẩm
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      💸 Giảm giá:{" "}
                      {voucher.hardValue > 0 ? (
                        <>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {voucher.hardValue.toLocaleString()}
                          </span>
                          <span> / sản phẩm</span>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {voucher.percentValue}% giá trị
                          </span>
                          <span> / sản phẩm</span>
                        </>
                      )}
                    </div>
                  </div>
                )}{" "}
              </div>

              <div className="flex flex-col items-center justify-start w-full gap-4 mt-10 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 text-lg font-bold text-gray-700 border-none rounded-full bg-gray-50 hover:bg-amber-100 focus:outline-none focus:ring-0 focus:border-none active:border-none"
                  >
                    −
                  </button>
                  <span className="text-xl font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 text-lg font-bold text-gray-700 border-none rounded-full bg-gray-50 hover:bg-amber-100 focus:outline-none focus:ring-0 focus:border-none active:border-none"
                  >
                    +
                  </button>
                </div>
                <div className="text-lg font-semibold text-amber-600 whitespace-nowrap">
                  Tổng: {finalTotalPrice.toLocaleString("vi-VN")}₫
                  {/* Tổng: {finalTotalPrice}₫ */}
                </div>
              </div>

              <div className="flex justify-start pt-8">
                <div className="relative flex items-center gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="px-5 py-3 font-medium text-white transition bg-amber-500 hover:bg-amber-600 rounded-xl"
                  >
                    Thêm vào giỏ hàng
                  </button>

                  <button
                    className="px-4 py-2 text-sm font-medium transition border rounded-lg border-amber-300 text-amber-600 hover:border-amber-500 hover:bg-amber-50"
                    title="Sao chép hoặc chia sẻ"
                    onClick={handleCopy}
                  >
                    <i className="mr-2 fa-regular fa-share-from-square text-amber-500"></i>
                    Chia sẻ
                  </button>

                  {copied && (
                    <div className="absolute px-2 py-1 text-xs text-white -translate-x-1/2 rounded shadow bg-amber-600 left-1/2 -top-8">
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
                    prev === 0
                      ? (selectedRating.imgs?.length || 1) - 1
                      : prev - 1
                  )
                }
                handleNextImage={() =>
                  setCurrentImageIndex((prev) =>
                    prev === (selectedRating.imgs?.length || 1) - 1
                      ? 0
                      : prev + 1
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
            <SuggestedProducts
              suggestions={suggestions}
              categoryId={product.categoryId}
              categoryName={category.name}
            />
          </>
        )}
      </div>

      {toast && (
        <ToastMessage
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <Footer />
    </div>
  );
}
