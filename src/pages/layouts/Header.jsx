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
    <header className="w-full bg-white shadow-md relative z-10">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <div className="text-2xl font-bold text-pink-600">SweetCake</div>

        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">

          {navLinks.map((link, i) => (
            <li key={i}>
              <Link
                to={link.to}
                className="hover:text-gray-500 hover:underline transition"
              >
                {link.label}
              </Link>
            </li>
          ))}

        </ul>

        <div className="flex items-center gap-4">

          <button 
            onClick={() => navigate('/cart')}
            className="text-gray-600 hover:text-pink-600 cursor-pointer text-2xl">
            🛒
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-4 py-1 border border-pink-600 text-pink-600 rounded hover:bg-pink-600 hover:text-white transition hidden md:block"
          >
            Đăng nhập
          </button>

          <button
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md">
          <ul className="flex flex-col items-start px-4 py-2 space-y-2 text-gray-700 font-medium">

            {navLinks.map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className="block w-full py-1 hover:text-gray-500 hover:underline"
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
                className="w-full text-left px-2 py-1 border border-pink-600 text-pink-600 rounded hover:bg-pink-600 hover:text-white transition"
              >
                Đăng nhập
              </button>
            </li>

          </ul>
        </div>
      )}

    </header>
  );
}
