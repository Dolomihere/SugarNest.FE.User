import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import OrderService from "../../services/OrderService";
import CartService from "../../services/CartService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import AxiosInstance from "../../core/services/AxiosInstance";

// CartIcon Component
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("/images/12.jpg");
  const [username, setUserName] = useState();
  const [notifications, setNotifications] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  const guestCartId = localStorage.getItem("guestCartId");

  // const { data: notificationsData, refetch } = useQuery({
  //   queryKey: ["notifications"],
  //   queryFn: () => TransactionService.getAllNotifications({}, { page: 1, limit: 100 }),
  //   enabled: !!token,
  //   refetchInterval: 300000,
  // });

  // useEffect(() => {
  //   if (notificationsData?.data) {
  //     const sortedNotifications = notificationsData.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  //     setNotifications(sortedNotifications);
  //   }
  // }, [notificationsData]);

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

  const { data: orderStatusHistoryData } = useQuery({
    queryKey: ["orderStatusHistory", token],
    queryFn: () => OrderService.getOrderStatusHistory(token),
    enabled: !!token,
    refetchInterval: 300000,
  });

  // Debug the API response
  useEffect(() => {
    if (orderStatusHistoryData) {
      console.log("orderStatusHistoryData:", orderStatusHistoryData);
    }
  }, [orderStatusHistoryData]);

  const cartItemCount = useMemo(() => {
    return (
      cartData?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
    );
  }, [cartData]);

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/products", label: "Sản phẩm" },
    { to: "/about", label: "Về chúng tôi" },
    { to: "/contact", label: "Liên hệ" },
    { to: "/discounts", label: "Chương trình giảm giá" },
    { to: "/unity-game", label: "Giải trí" },
  ];

  const statusMap = {
    "-2": "Đã hoàn tiền",
    "-1": "Đã hủy",
    0: "Khởi tạo",
    1: "Đang xử lý",
    2: "Hoàn tất",
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Get the latest 3 status history entries
  const recentStatusHistory = useMemo(() => {
    if (
      !orderStatusHistoryData?.data ||
      !Array.isArray(orderStatusHistoryData.data)
    ) {
      return [];
    }
    const allHistories = orderStatusHistoryData.data
      .flatMap((order) =>
        (order.statusHistory || []).map((history) => ({
          ...history,
          orderId: order.orderId,
        }))
      )
      .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    return allHistories.slice(0, 3);
  }, [orderStatusHistoryData]);

  useEffect(() => {
    setIsLoggedIn(!!token);

    if (token) {
      const fetchUser = async () => {
        try {
          const response = await AxiosInstance.get("/users/personal");
          if (response.data.isSuccess && response.data.data) {
            const userData = response.data.data;
            setAvatar(userData.avatar || "/images/12.jpg");
            setUserName(userData.fullname);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
      fetchUser();
    }
  }, [token]);

  // useEffect(() => {
  //   if (isLoggedIn && signalR && token) {
  //     const hubUrl = `${import.meta.env.VITE_API_URL}/orderNotificationHub`;
  //     const connection = new signalR.HubConnectionBuilder()
  //       .withUrl(hubUrl, {
  //         accessTokenFactory: () => token,
  //         skipNegotiation: true,
  //         transport: signalR.HttpTransportType.WebSockets,
  //       })
  //       .withAutomaticReconnect()
  //       .configureLogging(signalR.LogLevel.Information)
  //       .build();

  //     connectionRef.current = connection;

  //     connection.on("NotifyOrderUpdated", (orderId) => {
  //       const notificationId = Date.now();
  //       setNotifications((prev) => {
  //         const newNotif = {
  //           id: notificationId,
  //           // message: `Đơn hàng ${orderId} đã được cập nhật!`,
  //           orderId,
  //           timestamp: new Date(),
  //           isRead: false,
  //         };
  //         const updated = [newNotif, ...prev].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  //         return updated;
  //       });
  //       refetch();
  //       setTimeout(() => {
  //         setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  //       }, 5000);
  //     });

  //     connection
  //       .start()
  //       .then(() => console.log("SignalR Connected successfully"))
  //       .catch((err) => {
  //         console.error("SignalR Connection Error:", err);
  //         setNotifications((prev) => [
  //           ...prev,
  //           {
  //             id: Date.now(),
  //             message: "Không thể kết nối đến thông báo thời gian thực. Vui lòng kiểm tra lại sau.",
  //             orderId: null,
  //             timestamp: new Date(),
  //             isRead: false,
  //           },
  //         ]);
  //       });

  //     return () => {
  //       connection.stop().catch((err) => console.error("SignalR Disconnection Error:", err));
  //     };
  //   } else if (!signalR) {
  //     console.warn("SignalR is not available. Notifications will not be received.");
  //     setNotifications((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now(),
  //         message: "Không thể kết nối thông báo. Vui lòng kiểm tra cài đặt!",
  //         orderId: null,
  //         timestamp: new Date(),
  //         isRead: false,
  //       },
  //     ]);
  //   }
  // }, [isLoggedIn, token, refetch]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setDropdownOpen(false);
  //       setNotificationsOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleLogout = () => {
    const confirm = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (!confirm || confirm == false) return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setAvatar("/images/12.jpg");
    setDropdownOpen(false);
    alert('Đăng xuất thành công')
    navigate("/");
  };

  return (
    <header className="relative z-10 bg-white shadow-md">
      <nav className="flex items-center justify-between p-5 mx-auto max-w-7xl">
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

        <div className="relative flex items-center gap-4">
          <Link
            to="/user"
            className="relative text-amber-600 hover:text-amber-700"
            aria-label="Cart"
          >
            <CartIcon className="w-8 h-8 translate-y-[2px]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                {cartItemCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2"
              aria-label="User account"
            >
              <img
                title={username}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                src={avatar}
                alt="User avatar"
                className="border rounded-full cursor-pointer w-9 h-9 border-amber-600 hover:shadow-md"
              />
              {/* <div>{username}</div> */}
              {/* <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-gray-600 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              /> */}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <button
                  onClick={() => {
                    navigate("/account");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-600 transition-colors duration-200 rounded-t-lg hover:text-gray-700 hover:bg-gray-100"
                >
                  Tài khoản
                </button>
                <button
                  onClick={() => {
                    navigate("/order-history");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-600 transition-colors duration-200 hover:text-gray-700 hover:bg-gray-100"
                >
                  Đơn hàng
                </button>

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left transition-colors duration-200 border-t border-gray-200 rounded-b-lg text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                  >
                    Đăng xuất
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left transition-colors duration-200 border-t border-gray-200 rounded-b-lg text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            className="text-2xl text-gray-600 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="absolute left-0 w-full bg-white shadow-md top-full md:hidden">
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
                <span className="ml-2">Giỏ hàng</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/account");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 py-1 text-gray-600 hover:text-gray-700"
              >
                <img
                  src={avatar}
                  alt="User avatar"
                  className="border rounded-full w-9 h-9 border-amber-600 hover:shadow-md"
                />
                <span>Tài khoản</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/order-history");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 py-1 text-gray-600 hover:text-gray-700"
              >
                <span>Đơn hàng</span>
              </button>
            </li>
            {isLoggedIn && (
              <li>
                <div className="w-full">
                  <button
                    onClick={() => {
                      navigate("/order-status");
                      setMenuOpen(false);
                    }}
                    className="w-full py-1 text-left text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-700 hover:bg-gray-100"
                  >
                    Lịch sử trạng thái
                  </button>
                  {recentStatusHistory.length > 0 ? (
                    <ul className="space-y-1">
                      {recentStatusHistory.map((history) => (
                        <li
                          key={history.OrderStatusHistoryId}
                          className="text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            navigate(
                              `/order-status?orderId=${history.orderId}`
                            );
                            setMenuOpen(false);
                          }}
                        >
                          <p>
                            Đơn #{history.orderId.slice(0, 8)}:{" "}
                            {statusMap[history.NewStatus] || "Không xác định"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(history.CreatedAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Chưa có lịch sử trạng thái
                    </div>
                  )}
                </div>
              </li>
            )}
            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full py-1 text-left transition-colors duration-200 text-amber-600 border-amber-600 hover:bg-amber-100 hover:text-amber-700"
                >
                  Đăng xuất
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/signin");
                    setMenuOpen(false);
                  }}
                  className="block w-full py-1 text-left transition-colors duration-200 text-amber-600 border-amber-600 hover:bg-amber-100 hover:text-amber-700"
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
