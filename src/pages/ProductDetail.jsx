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
import { StarRating } from "./rating/StarRating";
import { RatingModal } from "./rating/RatingModal";
import { RatingForm } from "./rating/RatingForm";
import SuggestedProducts from "./SuggestedProducts.jsx";
import ToastMessage from "../components/ToastMessage";
import { VoucherSelect } from "./components/VoucherSelect";
import VoucherService from "../services/VoucherService";
import UserMiniProfile from "../pages/components/UserMiniProfile.jsx";
import { formatToVietnamTime } from "../helpers/dateTimeHelper.js";

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

  // Add state for userId, userAvatar, and email
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [email, setEmail] = useState("");

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
  useEffect(() => {
    if (isLoggedIn) {
      const decodeToken = () => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserId(payload.userId || payload.sub || payload.id || "");
          setUserName(payload.name || "Người dùng");
          setUserAvatar(payload.avatar || "/images/default-avatar.png");
          setEmail(payload.email || "");
        } catch (e) {
          console.error("Error decoding token:", e);
          setUserId("");
          setUserName("Người dùng");
          setUserAvatar("/images/default-avatar.png");
          setEmail("");
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

  const {
    data: ratingsData = { data: [] },
    isLoading: isRatingsLoading,
    refetch,
  } = useQuery({
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
    if (!accessToken) {
      setShowDialog(true);
      return;
    }

    let voucherId = null;
    if (voucher && !checkVoucher()) {
      voucherId = voucher.userItemVoucherId;
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
      userItemVoucherId: voucherId,
      productItemOptionModels: optionEntries,
    };

    try {
      // normalize options to detect duplicates
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

  const { data: userVouchers = [] } = useQuery({
    queryKey: ["userVouchers", accessToken],
    queryFn: () =>
      VoucherService.getUserItemVouchers(accessToken).then((data) =>
        data.map((v) => ({
          voucherId: v.userItemVoucherId,
          name: v.productName,
          percentValue: v.percentValue,
          hardValue: v.hardValue,
          ...v,
        }))
      ),
    enabled: isLoggedIn ?? false,
  });
  const [voucher, setVoucher] = useState();
  const handleSelectItemVoucher = (value) => {
    const selectedVoucher = userVouchers.find((v) => v.itemVoucherId === value);
    setVoucher(selectedVoucher || undefined);
  };

  const [finalTotalPrice, setFinalTotalPrice] = useState(0);

  function checkVoucher() {
    if (!voucher) return false;
    return (
      voucher.productId !== product.productId ||
      voucher.minQuantity > quantity ||
      voucher.maxQuantity < quantity
    );
  }

  useEffect(() => {
    if (!product?.finalUnitPrice) return;

    const basePrice = Number(product.finalUnitPrice) * quantity;
    const additionalPrice = getTotalAdditionalPrice() * quantity;
    let discount = 0;
    if (voucher && !checkVoucher()) {
      discount =
        voucher.hardValue > 0
          ? voucher.hardValue * quantity
          : ((product.finalUnitPrice * voucher.percentValue) / 100) * quantity;
    }
    const total = basePrice + additionalPrice - discount;
    setFinalTotalPrice(total);
  }, [product, quantity, voucher, selectedOptions, checkChange]);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-gray-800">
      <Header />
      <div className="px-4 mx-auto my-12 space-y-16 max-w-7xl min-h-[100vh]">
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
            <div className="relative flex flex-col gap-8 p-6 transition-shadow duration-300 bg-white border shadow-sm border-amber-200 rounded-3xl hover:shadow-lg md:flex-row md:gap-12 lg:gap-20">
              <div className="flex items-center justify-center w-full md:w-1/2">
                <img
                  src={
                    product.imgs?.[0] ||
                    "https://res.cloudinary.com/dwlvd5lxt/image/upload/v1751540177/temp_product_tfynpj.jpg"
                  }
                  alt={product.name || "Sản phẩm"}
                  className="object-cover w-full h-[380px] rounded-2xl shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
              <div className="w-full space-y-6 md:w-1/2">
                <h2 className="text-3xl font-bold relative tracking-tight text-gray-900 md:text-4xl">
                  {product.name}
                  <button
                    className="absolute right-0 top-0 cursor-pointer hover:scale-105"
                    onClick={async () => {
                      const shareData = {
                        title: product.name,
                        text: `Sản phẩm hấp dẫn dành tặng cho bạn đây!!`,
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M12 6V2l7 7l-7 7v-4c-5 0-8.5 1.5-11 5l.8-3l.2-.4A12 12 0 0 1 12 6z"
                      />
                    </svg>
                  </button>
                </h2>
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
                <p className="text-3xl font-semibold text-amber-600">
                  {Number(product.finalUnitPrice).toLocaleString("vi-VN")}₫
                  {product.unitPrice != product.finalUnitPrice && (
                    <span className="line-through ms-2 text-[20px] text-red-500">
                      {Number(product.unitPrice).toLocaleString("vi-VN")}₫
                    </span>
                  )}
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

            {product.details && product.details.trim().length && (
              <div className="p-6 mt-10 bg-white border shadow-sm border-amber-200 rounded-2xl">
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.details ?? "",
                  }}
                />
              </div>
            )}

            {/* Product Options */}
            <div className="p-6 mt-10 bg-white border shadow-sm border-amber-200 rounded-2xl">
              <h4 className="pb-3 mb-6 text-2xl font-semibold text-gray-800 border-b border-amber-100">
                Đặt hàng
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
                />
                {voucher && (
                  <div
                    className={`mt-4 rounded-lg border relative border-gray-300 dark:border-gray-600 p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                      (voucher.productId !== product.productId ||
                        voucher.minQuantity > quantity ||
                        voucher.maxQuantity < quantity) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <button
                      onClick={() => setVoucher(undefined)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-300 shadow transition"
                    >
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
                      📅 Hiệu lực:{" "}
                      {new Date(voucher.startTime).toLocaleString("vi-VN")}{" "}
                      <span>đến</span>{" "}
                      {new Date(voucher.endTime).toLocaleString("vi-VN")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span>📦 Áp dụng nếu mua </span>
                      {voucher.minQuantity === voucher.maxQuantity ? (
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
                )}
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
                  {/* <button
                    className="px-4 py-2 text-sm font-medium transition border rounded-lg border-amber-300 text-amber-600 hover:border-amber-500 hover:bg-amber-50"
                    title="Sao chép hoặc chia sẻ"
                    onClick={handleCopy}
                  >
                    <i className="mr-2 fa-regular fa-share-from-square text-amber-500"></i>
                    Chia sẻ
                  </button> */}
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
                        <div className="mb-8">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {formatToVietnamTime(r.createdAt)}
                          </div>
                          <div
                            key={r.ratingId}
                            className="p-4 transition-shadow duration-300  border rounded-lg shadow cursor-pointer hover:shadow-md  bg-blue-50 dark:bg-blue-900/40"
                            onClick={() => setSelectedRating(r)}
                          >
                            <div className="">
                              <UserMiniProfile userId={r.createdBy} showName />
                              <StarRating rating={r.ratingPoint} />
                            </div>
                            <p className="text-sm text-gray-600">
                              {r.comment || "Không có nhận xét"}
                            </p>
                            {r.imgs && r.imgs.length > 0 && (
                              <div className="flex gap-2 mt-2 overflow-x-auto">
                                {r.imgs.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img || "/images/placeholder.png"}
                                    alt={`Hình ảnh đánh giá ${idx + 1}`}
                                    className="object-cover w-24 h-24 rounded"
                                    onError={(e) =>
                                      (e.target.src =
                                        "/public/images/owner.png")
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          {r.response && (
                            <div className="mt-4 pl-4 border-l-4 ms-8 border-blue-400 dark:border-blue-500">
                              <div className="text-sm text-gray-800 dark:text-gray-200 bg-blue-50 dark:bg-blue-900/40 p-3 rounded-lg">
                                <p className="font-medium mb-1">
                                  Phản hồi từ Admin:
                                </p>
                                <p>{r.response}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  Thời gian phản hồi:{" "}
                                  {formatToVietnamTime(r.repliedAt)}
                                </p>
                              </div>
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
                product={product}
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
                userId={userId}
                username={userName}
                userAvatar={userAvatar}
                email={email}
              />
            </div>

            {/* Suggested Products */}
            <SuggestedProducts
              suggestions={suggestions}
              categoryId={product.categoryId}
              categoryName={category.name}
              exceptId={product.productId}
            />
          </>
        )}
        {toast && (
          <ToastMessage
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
