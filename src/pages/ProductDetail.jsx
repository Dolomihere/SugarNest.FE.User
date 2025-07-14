import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";

import ProductService from "../services/ProductService";
import ProductOptionService from "../services/ProductOption";
import CartService from "../services/CartService";

export function ProductDetailPage() {
  const { id } = useParams();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  const isLoggedIn = !!token;

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
    const optionEntries = Object.entries(selectedOptions).flatMap(([groupId, values]) => {
      if (Array.isArray(values)) {
        return values.map((v) => ({ optionGroupId: groupId, optionItemId: v }));
      } else {
        return [{ optionGroupId: groupId, optionItemId: values }];
      }
    });

    const item = {
      productId: id,
      note: null,
      quantity,
      productItemOptionModels: optionEntries,
    };

    try {
      if (isLoggedIn) {
        await CartService.addItemToCart(item, token);
        alert("Đã thêm vào giỏ hàng (đăng nhập)!");
      } else {
        const cart = JSON.parse(localStorage.getItem("local_cart") || "[]");
        cart.push(item);
        localStorage.setItem("local_cart", JSON.stringify(cart));
        alert("Đã thêm vào giỏ hàng (khách)!");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Lỗi khi thêm vào giỏ hàng.");
    }
  };

  const { data: product = {} } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductService.getProductById(id).then((res) => res.data.data),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["suggested"],
    queryFn: () => ProductService.getAllProducts().then((res) => res.data.data),
  });

  const { data: optionGroups = [] } = useQuery({
    queryKey: ["options", id],
    queryFn: () => ProductOptionService.getOptionOfProductById(id).then((res) => { 
      return res.data.data}),
  });

  const suggestions = useMemo(() => {
    const otherProducts = products.filter((p) => p.productId !== id);
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [products, id]);

  useEffect(() => {
    setQuantity(1);
    setCopied(false);
  }, [id]);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-gray-800">
      <Header />

      <div className="px-4 mx-auto my-12 space-y-16 max-w-7xl">
        {/* Sản phẩm chính */}
        <div className="flex flex-col gap-10 p-6 bg-white shadow-lg rounded-2xl md:flex-row md:gap-12 lg:gap-16">
          <div className="flex items-center justify-center w-full overflow-hidden md:w-1/2 rounded-xl">
            <img
              src={product.imgs}
              alt={product.name}
              className="object-cover w-full max-h-[400px] rounded-xl shadow transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="w-full space-y-6 md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">{product.name}</h2>
            <p className="text-2xl leading-relaxed text-gray-600">{product.description}</p>
            <p className="text-2xl font-semibold text-amber-600">
              {Number(product.unitPrice).toLocaleString("vi-VN")}₫
            </p>

            {/* Thông tin bổ sung */}
            <div className="space-y-1 text-sm text-gray-500">
              <p><span className="font-medium text-gray-700">Trọng lượng:</span> 500g</p>
              <p><span className="font-medium text-gray-700">Hạn sử dụng:</span> 7 ngày kể từ ngày sản xuất</p>
              <p><span className="font-medium text-gray-700">Thành phần:</span> Bột mì, đường, trứng, bơ, sữa, dầu thực vật,...</p>
              <p><span className="font-medium text-gray-700">Ngày sản xuất:</span> {new Date().toLocaleDateString("vi-VN")}</p>
            </div>

            {/* Tùy chọn */}
            {optionGroups.map((group) => (
              <div key={group.optionGroupId} className="space-y-2">
                <p className="text-2xl font-medium text-gray-700">{group.name}</p>
                <p className="text-sm text-amber-600">{group.description}</p>
                <div className="mt-2 space-y-2">
                  {group.isMultipleChoice
                    ? group.optionItems?.map((item) => (
                        <label key={item.optionItemId} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name={group.optionGroupId}
                            value={item.optionItemId}
                            onChange={handleCheckboxChange}
                            className="accent-amber-600"
                          />
                          <span>
                            {item.optionValue}{" "}
                            <span className="text-gray-400">
                              (+{Number(item.additionalPrice).toLocaleString("vi-VN")}₫)
                            </span>
                          </span>
                        </label>
                      ))
                    : group.optionItems?.map((item) => (
                        <label key={item.optionItemId} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={group.optionGroupId}
                            value={item.optionItemId}
                            onChange={handleRadioChange}
                            className="accent-amber-600"
                          />
                          <span>
                            {item.optionValue}{" "}
                            <span className="text-gray-400">
                              (+{Number(item.additionalPrice).toLocaleString("vi-VN")}₫)
                            </span>
                          </span>
                        </label>
                      ))}
                </div>
              </div>
            ))}


            {/* Số lượng */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 text-xl font-bold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-xl font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 text-xl font-bold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                +
              </button>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  handleAddToCart();
                  setQuantity(1);
                }}
                className="px-6 py-3 text-white transition rounded-lg btn-primary hover:bg-amber-700"
              >
                Thêm vào giỏ hàng
              </button>
              <button className="text-2xl transition text-amber-500 hover:text-amber-600">
                <i className="fa-solid fa-heart"></i>
              </button>
              <div className="relative">
                <button
                  onClick={handleCopy}
                  className="transition text-amber-500 hover:text-blue-500"
                  title="Sao chép liên kết"
                >
                  <i className="fa-regular fa-copy fa-lg"></i>
                </button>
                {copied && (
                  <div className="absolute px-2 py-1 text-xs text-white -translate-x-1/2 bg-black rounded shadow -top-8 left-1/2">
                    Đã sao chép!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sản phẩm gợi ý */}
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
                    src={p.imgs}
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
              className="inline-block px-6 py-3 text-white transition rounded-lg btn-primary hover:bg-amber-700"
            >
              Xem thêm sản phẩm
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
