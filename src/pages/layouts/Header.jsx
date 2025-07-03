import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

export function Header() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navLinks = [
    { to: "/", label: "Trang chủ", end: true },
    { to: "/products", label: "Sản phẩm" },
    { to: "/about", label: "Về chúng tôi" },
    { to: "/contact", label: "Liên hệ" },
  ]

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    sessionStorage.removeItem("accessToken")
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <header className="relative z-10 bg-white shadow-md">
      <nav className="flex items-center justify-between p-5">

        {/* Logo */}
        <div className="text-2xl font-bold text-amber-600">SugarNest</div>

        {/* Nav Links */}
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

        {/* Right controls (desktop) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/user')}
            className="text-2xl text-amber-600 cursor-pointer hover:text-amber-700"
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </button>

          {/* Avatar icon (luôn hiển thị) */}
          <img
            onClick={() => navigate('/account')}
            src="/images/owner.png"
            alt="avatar"
            className="w-9 h-9 rounded-full cursor-pointer border "
          />

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden px-4 py-1 text-amber-600 transition border border-amber-600 rounded hover:bg-amber-600 hover:text-white md:block"
            >
              Đăng xuất
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden px-4 py-1 text-amber-600 transition border border-amber-600 rounded hover:bg-amber-600 hover:text-white md:block"
            >
              Đăng nhập
            </button>
          )}

          {/* Mobile Toggle */}
          <button
            className="text-2xl text-gray-700 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
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
                  setMenuOpen(false)
                  navigate('/user')
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
                  setMenuOpen(false)
                  navigate('/account')
                }}
                src="https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
                alt="avatar"
                className="w-9 h-9 rounded-full cursor-pointer border border-amber-600 hover:shadow-md"
              />
            </li>

            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    handleLogout()
                  }}
                  className="px-2 py-1 text-left text-amber-600 transition border border-amber-600 rounded hover:bg-amber-600 hover:text-white"
                >
                  Đăng xuất
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/login')
                  }}
                  className="px-2 py-1 text-left text-amber-600 transition border border-amber-600 rounded hover:bg-amber-600 hover:text-white"
                >
                  Đăng nhập
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
