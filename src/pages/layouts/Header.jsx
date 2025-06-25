import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Trang chủ", end: true },
    { to: "/products", label: "Sản phẩm" },
    { to: "/about", label: "Về chúng tôi" },
    { to: "/intro", label: "Giới thiệu" },
  ];

  return (
    <header className="relative z-10 bg-white shadow-md">
      <nav className="flex items-center justify-between p-5">

        <div className="text-2xl font-bold text-yellow-600">SweetCake</div>

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

        <div className="flex items-center gap-4">

          <button 
            onClick={() => navigate('/user')}
            className="text-2xl text-gray-600 cursor-pointer hover:text-pink-600">
            <i className="fa-solid fa-cart-shopping"></i>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="hidden px-4 py-1 text-yellow-600 transition border border-yellow-600 rounded hover:bg-yellow-600 hover:text-white md:block"
          >
            Đăng nhập
          </button>

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
                  navigate('/login');
                }}
                className="px-2 py-1 text-left text-yellow-600 transition border border-yellow-600 rounded hover:bg-yellow-600 hover:text-white"
              >
                Đăng nhập
              </button>
            </li>

          </ul>
        </div>
      )}

    </header>
  )
}
