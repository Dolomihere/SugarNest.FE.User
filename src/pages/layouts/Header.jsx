import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faSearch } from '@fortawesome/free-solid-svg-icons'

export function Header() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navLinks = [
    { to: "/", label: "Trang chủ", end: true },
    { to: "/products", label: "Sản phẩm" },
    { to: "/about", label: "Về chúng tôi" },
    { to: "/contact", label: "Liên hệ" }, // Thêm mục liên hệ
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

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <button
            onClick={() => navigate('/search')}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => navigate('/user')}
            className="text-2xl text-amber-600 cursor-pointer hover:text-amber-700"
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </button>

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

          {/* Mobile Menu Toggle */}
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
                navigate('/search')
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition duration-200"
            >
              <span className="text-base">🔍</span>
              <span>Tìm kiếm</span>
            </button>
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
<button
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/login')
                  }}
                  className="px-2 py-1 text-left text-amber-600 transition border border-amber-600 rounded hover:bg-amber-600 hover:text-white"
                >
                  Đăng nhập
                </button>