import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../core/services/AxiosInstance';

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState('/public/images/owner.png');

  const navLinks = [
    { to: '/', label: 'Trang chủ', end: true },
    { to: '/products', label: 'Sản phẩm' },
    { to: '/about', label: 'Về chúng tôi' },
    { to: '/contact', label: 'Liên hệ' },
    { to: '/discounts', label: 'Chương trình giảm giá' },
    { to: '/unity-game', label: 'Giải trí' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    if (token) {
      const fetchUser = async () => {
        try {
          const response = await AxiosInstance.get('/users/personal');
          console.log('API Response:', response.data); // Debug
          if (response.data.isSuccess && response.data.data) {
            const userData = response.data.data;
            setAvatar(userData.avatar || 'https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg');
          }
        } catch (err) {
          console.error('Lỗi khi tải dữ liệu người dùng:', err);
        }
      };
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setAvatar('https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg');
    navigate('/');
  };

  return (
    <header className="relative z-10 bg-white shadow-md">
      <nav className="flex items-center justify-between p-5">
        <div className="text-2xl font-bold text-amber-600">SugarNest</div>
        <ul className="hidden gap-6 font-medium text-gray-600 md:flex">
          {navLinks.map((link, i) => (
            <li key={i}>
              <Link to={link.to} className="transition hover:text-gray-700 hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user")}
            className="text-2xl cursor-pointer text-amber-600 hover:text-amber-700"
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </button>
          <img
            onClick={() => navigate('/account')}
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
                  setMenuOpen(false);
                  navigate("/user");
                }}
                className="flex items-center gap-1 text-amber-600"
              >
                <FontAwesomeIcon icon={faCartShopping} />
                <span>Giỏ hàng</span>
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
              )

 : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/signin");
                  }}
                  className="px-2 py-1 text-left transition rounded border text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white"
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
