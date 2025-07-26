import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../core/services/AxiosInstance";
import CartService from "../../services/CartService";

// Icon giỏ hàng
const CartIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="5em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7.5 18a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Zm9 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Z" />
      <path
        strokeLinecap="round"
        d="M11 9H8M2 3l.265.088c1.32.44 1.98.66 2.357 1.184C5 4.796 5 5.492 5 6.883V9.5c0 2.828 0 4.243.879 5.121c.878.879 2.293.879 5.121.879h2m6 0h-2"
      />
      <path
        strokeLinecap="round"
        d="M5 6h3m-2.5 7h10.522c.96 0 1.439 0 1.815-.248c.375-.248.564-.688.942-1.57l.429-1c.81-1.89 1.214-2.833.77-3.508C19.532 6 18.505 6 16.45 6H12"
      />
    </g>
  </svg>
);

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("/public/images/owner.png");

  const token =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  const guestCartId = localStorage.getItem("guestCartId");

  const { data: cartData } = useQuery({
    queryKey: isLoggedIn ? ["userCart", token] : ["guestCart", guestCartId],
    queryFn: async () => {
      if (isLoggedIn) {
        const res = await CartService.getUserCart(token);
        return res.data.data || { cartItems: [] };
      } else {
        if (!guestCartId) return { cartItems: [] };
        const res = await CartService.getGuestCart(guestCartId);
        return res.data.data || { cartItems: [] };
      }
    },
    enabled: !!token || !!guestCartId,
  });

  const cartItemCount = useMemo(() => {
    return cartData?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cartData]);

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/products", label: "Sản phẩm" },
    { to: "/about", label: "Về chúng tôi" },
    { to: "/contact", label: "Liên hệ" },
    { to: "/discounts", label: "Chương trình giảm giá" },
    { to: "/unity-game", label: "Giải trí" },
  ];

  useEffect(() => {
    setIsLoggedIn(!!token);

    if (token) {
      const fetchUser = async () => {
        try {
          const response = await AxiosInstance.get("/users/personal");
          if (response.data.isSuccess && response.data.data) {
            const userData = response.data.data;
            setAvatar(userData.avatar || "/public/images/owner.png");
          }
        } catch (err) {
          console.error("Lỗi khi tải dữ liệu người dùng:", err);
        }
      };
      fetchUser();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setAvatar("/public/images/owner.png");
    navigate("/");
  };

  return (
    <header className="relative z-10 bg-white shadow-md">
      <nav className="flex items-center justify-between p-5">
        <div className="text-2xl font-bold text-amber-600">SugarNest</div>

        <ul className="hidden gap-6 font-medium text-gray-600 md:flex">
          {navLinks.map((link, i) => (
            <li key={i}>
              <Link
                to={link.to}
                className="transition hover:text-gray-700 hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => navigate("/user")}
            className="relative text-amber-600 hover:text-amber-700"
          >
            <CartIcon className="w-8 h-8 translate-y-[2px]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
            {cartItemCount}
          </span>

            )}
          </button>

          <img
            onClick={() => navigate("/account")}
            src={avatar}
            alt="avatar"
            className="border rounded-full cursor-pointer w-9 h-9"
          />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden px-4 py-1 transition border rounded text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white md:block"
            >
              Đăng xuất
            </button>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="hidden px-4 py-1 transition border rounded text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white md:block"
            >
              Đăng nhập
            </button>
          )}

          <button
            className="text-2xl text-gray-700 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="absolute left-0 w-full bg-white shadow-md md:hidden top-full">
          <ul className="flex flex-col items-start px-4 py-2 space-y-2 font-medium text-gray-600">
            {navLinks.map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className="block w-full py-1 hover:text-gray-700 hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  navigate("/user");
                  setMenuOpen(false);
                }}
                className="relative text-amber-600 hover:text-amber-700"
              >
                <CartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                {cartItemCount}
              </span>

                )}
              </button>
            </li>
            <li>
              <img
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/account");
                }}
                src={avatar}
                alt="avatar"
                className="border rounded-full cursor-pointer w-9 h-9 border-amber-600 hover:shadow-md"
              />
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-2 py-1 text-left transition border rounded text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white"
                >
                  Đăng xuất
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/signin");
                  }}
                  className="px-2 py-1 text-left transition border rounded text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white"
                >
                  Đăng nhập
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
