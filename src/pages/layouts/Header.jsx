import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import TransactionService from "../../services/TransactionService";
import AxiosInstance from "../../core/services/AxiosInstance";
import CartService from "../../services/CartService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import * as signalR from "@microsoft/signalr";

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

// ToastNotification Component
const ToastNotification = ({ message, onClose, orderId }) => (
  <div className="fixed bottom-5 right-5 px-4 py-3 bg-amber-600 text-white rounded-lg shadow-lg max-w-[90%] sm:max-w-md flex items-center gap-3 transition-all duration-300 hover:scale-105">
    <FontAwesomeIcon icon={faBell} className="text-white" />
    <p className="text-sm font-medium">{message}</p>
    <button
      onClick={onClose}
      className="p-1 text-white transition-colors duration-200 hover:text-gray-200"
      aria-label="Close notification"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

// TransactionModal Component
const TransactionModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const statusMap = {
    "-2": "Đã hoàn tiền",
    0: "Khởi tạo",
    2: "Hoàn tất",
  };

  const channelMap = {
    0: "Tiền mặt",
    1: "VnPay",
  };

  const createrTypeMap = {
    1: "Nhân viên",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-5 mx-4 bg-white shadow-lg rounded-lg overflow-y-auto max-h-[90vh] dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Chi tiết giao dịch</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <p><strong>ID Giao dịch:</strong> {transaction.transactionId}</p>
            <p><strong>ID Đơn hàng:</strong> {transaction.orderId}</p>
            <p><strong>Kênh thanh toán:</strong> {channelMap[transaction.channel] || transaction.channel}</p>
            <p><strong>Trạng thái:</strong> {statusMap[transaction.status] || transaction.status}</p>
            <p><strong>Số tiền:</strong> {transaction.amount ? `${transaction.amount.toLocaleString()} VND` : "N/A"}</p>
            <p><strong>Mô tả:</strong> {transaction.description || "N/A"}</p>
            <p><strong>URL Thanh toán:</strong> {transaction.paymentUrl || "N/A"}</p>
            <p><strong>Ngày tạo:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
            <p><strong>Ngày hết hạn:</strong> {transaction.expireAt ? new Date(transaction.expireAt).toLocaleString() : "N/A"}</p>
            <p><strong>Ngày hoàn tất:</strong> {transaction.completeAt ? new Date(transaction.completeAt).toLocaleString() : "N/A"}</p>
            <p><strong>Mã giao dịch:</strong> {transaction.txnRef || "N/A"}</p>
            <p><strong>Mã giao dịch kênh:</strong> {transaction.channelTransactionNo || "N/A"}</p>
            <p><strong>Mã phản hồi:</strong> {transaction.responseCode || "N/A"}</p>
            <p><strong>Trạng thái thanh toán:</strong> {transaction.paymentTransactionStatus || "N/A"}</p>
            <p><strong>Mã ngân hàng:</strong> {transaction.bankCode || "N/A"}</p>
            <p><strong>Số giao dịch ngân hàng:</strong> {transaction.bankTranNo || "N/A"}</p>
            <p><strong>Loại thẻ:</strong> {transaction.cardType || "N/A"}</p>
            <p><strong>Thanh toán bổ sung:</strong> {transaction.isExtraPayment ? "Có" : "Không"}</p>
            <p><strong>Đã hoàn tiền:</strong> {transaction.isRefunded ? "Có" : "Không"}</p>
            <p><strong>Số tiền hoàn:</strong> {transaction.refundedAmount ? `${transaction.refundedAmount.toLocaleString()} VND` : "N/A"}</p>
            <p><strong>Ngày hoàn tiền:</strong> {transaction.refundedAt ? new Date(transaction.refundedAt).toLocaleString() : "N/A"}</p>
            <p><strong>Mã giao dịch hoàn tiền:</strong> {transaction.refundTransactionNo || "N/A"}</p>
            <p><strong>Thông điệp:</strong> {transaction.message || "N/A"}</p>
            <p><strong>Người tạo:</strong> {transaction.createdBy || "N/A"}</p>
          </div>

          {transaction.transactionStatusHistories && transaction.transactionStatusHistories.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Lịch sử trạng thái giao dịch</h3>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-3 py-2">ID Lịch sử</th>
                      <th className="px-3 py-2">Trạng thái cũ</th>
                      <th className="px-3 py-2">Trạng thái mới</th>
                      <th className="px-3 py-2">Lý do</th>
                      <th className="px-3 py-2">Loại người tạo</th>
                      <th className="px-3 py-2">ID Người tạo</th>
                      <th className="px-3 py-2">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.transactionStatusHistories.map((history) => (
                      <tr key={history.orderStatusHistoryId} className="border-b dark:border-gray-700">
                        <td className="px-3 py-2">{history.orderStatusHistoryId}</td>
                        <td className="px-3 py-2">{history.oldStatus !== null ? statusMap[history.oldStatus] || history.oldStatus : "N/A"}</td>
                        <td className="px-3 py-2">{statusMap[history.newStatus] || history.newStatus}</td>
                        <td className="px-3 py-2">{history.reason || "N/A"}</td>
                        <td className="px-3 py-2">{createrTypeMap[history.createrType] || history.createrType}</td>
                        <td className="px-3 py-2">{history.createrId || "N/A"}</td>
                        <td className="px-3 py-2">{new Date(history.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 mt-4 text-white transition-colors duration-200 rounded-lg bg-amber-600 hover:bg-amber-700"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("/images/12.jpg");
  const [notifications, setNotifications] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const connectionRef = useRef(null);

  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  const guestCartId = localStorage.getItem("guestCartId");

  const { data: notificationsData, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => TransactionService.getAllNotifications({}, { page: 1, limit: 100 }),
    enabled: !!token,
    refetchInterval: 300000,
  });

  useEffect(() => {
    if (notificationsData?.data) {
      const sortedNotifications = notificationsData.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(sortedNotifications);
    }
  }, [notificationsData]);

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
    { to: "/unity-game", label: "Giải trí" }
  ];

  useEffect(() => {
    setIsLoggedIn(!!token);

    if (token) {
      const fetchUser = async () => {
        try {
          const response = await AxiosInstance.get("/users/personal");
          if (response.data.isSuccess && response.data.data) {
            const userData = response.data.data;
            setAvatar(userData.avatar || "/images/12.jpg");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
      fetchUser();
    }
  }, [token]);

  useEffect(() => {
    if (isLoggedIn && signalR && token) {
      const hubUrl = `${import.meta.env.VITE_API_URL}/orderNotificationHub`;
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connectionRef.current = connection;

      connection.on("NotifyOrderUpdated", (orderId) => {
        const notificationId = Date.now();
        setNotifications((prev) => {
          const newNotif = {
            id: notificationId,
            // message: `Đơn hàng ${orderId} đã được cập nhật!`,
            orderId,
            timestamp: new Date(),
            isRead: false,
          };
          const updated = [newNotif, ...prev].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          return updated;
        });
        refetch();
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        }, 5000);
      });

      connection
        .start()
        .then(() => console.log("SignalR Connected successfully"))
        .catch((err) => {
          console.error("SignalR Connection Error:", err);
          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now(),
              message: "Không thể kết nối đến thông báo thời gian thực. Vui lòng kiểm tra lại sau.",
              orderId: null,
              timestamp: new Date(),
              isRead: false,
            },
          ]);
        });

      return () => {
        connection.stop().catch((err) => console.error("SignalR Disconnection Error:", err));
      };
    } else if (!signalR) {
      console.warn("SignalR is not available. Notifications will not be received.");
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: "Không thể kết nối thông báo. Vui lòng kiểm tra cài đặt!",
          orderId: null,
          timestamp: new Date(),
          isRead: false,
        },
      ]);
    }
  }, [isLoggedIn, token, refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setAvatar("/images/12.jpg");
    setDropdownOpen(false);
    setNotificationsOpen(false);
    setNotifications([]);
    navigate("/");
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  const handleNotificationClick = async (notification) => {
    markAsRead(notification.id);
    setNotificationsOpen(false);
    setDropdownOpen(false);
    setMenuOpen(false);

    try {
      const response = await TransactionService.getTransactionById(notification.id);
      if (response.isSuccess && response.data) {
        setSelectedTransaction(response.data);
        setIsModalOpen(true);
      } else {
        navigate(`/order-history?orderId=${notification.orderId}`);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      navigate(`/order-history?orderId=${notification.orderId}`);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setNotificationsOpen(false);
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

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
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
              aria-label="User account"
            >
              <img
                src={avatar}
                alt="User avatar"
                className="border rounded-full cursor-pointer w-9 h-9 border-amber-600 hover:shadow-md"
              />
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-gray-600 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <button
                  onClick={() => {
                    navigate("/account");
                    setDropdownOpen(false);
                    setNotificationsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-600 transition-colors duration-200 rounded-t-lg hover:text-gray-700 hover:bg-gray-100"
                >
                  Tài khoản
                </button>
                <button
                  onClick={() => {
                    navigate("/order-history");
                    setDropdownOpen(false);
                    setNotificationsOpen(false);
                  }}
                  className="relative w-full px-4 py-2 text-left text-gray-600 transition-colors duration-200 hover:text-gray-700 hover:bg-gray-100"
                >
                  Đơn hàng
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
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
                      setNotificationsOpen(false);
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
            onClick={() => {
              setMenuOpen(!menuOpen);
              setNotificationsOpen(false);
            }}
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
                  onClick={() => {
                    setMenuOpen(false);
                    setNotificationsOpen(false);
                  }}
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
                  setNotificationsOpen(false);
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
                  setNotificationsOpen(false);
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
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative flex items-center gap-2 py-1 text-gray-600 hover:text-gray-700"
                  aria-label="Notifications"
                >
                  <span>Thông báo</span>
                  {unreadCount > 0 && (
                    <span className="flex items-center justify-center w-4 h-4 text-[10px] font-medium text-white bg-red-500 rounded-full animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="w-full mt-2 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 dark:bg-gray-800 dark:border-gray-700">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        Chưa có thông báo mới
                      </div>
                    ) : (
                      <>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200 dark:border-gray-700 dark:hover:bg-gray-700 ${notification.isRead ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleNotificationClick(notification)}
                                className="flex-1 text-sm text-left text-gray-600 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-100"
                              >
                                {notification.message}
                              </button>
                              <button
                                onClick={() => {
                                  setNotifications((prev) =>
                                    prev.filter((n) => n.id !== notification.id)
                                  );
                                }}
                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                aria-label="Delete notification"
                              >
                                <FontAwesomeIcon icon={faTimes} size="sm" />
                              </button>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                          </div>
                        ))}
                        <button
                          onClick={clearAllNotifications}
                          className="w-full px-4 py-2 text-sm text-red-600 transition-colors duration-200 rounded-b-lg hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700"
                        >
                          Xóa tất cả
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/order-history");
                  setMenuOpen(false);
                  setNotificationsOpen(false);
                }}
                className="relative flex items-center gap-2 py-1 text-gray-600 hover:text-gray-700"
                aria-label="Orders"
              >
                <span>Đơn hàng</span>
                {unreadCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-medium text-white bg-red-500 rounded-full animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setNotificationsOpen(false);
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
                    setNotificationsOpen(false);
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

      {notifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          message={notification.message}
          orderId={notification.orderId}
          onClose={() => {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id)
            );
          }}
        />
      ))}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </header>
  );
}