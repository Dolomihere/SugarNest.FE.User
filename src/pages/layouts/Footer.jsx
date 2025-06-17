import { Link } from 'react-router-dom'

export function Footer() {
  const navLinks = [
    { to: "/about", label: "Về chúng tôi" },
    { to: "/menu", label: "Thực đơn" },
    { to: "/qna", label: "Câu hỏi thường gặp" },
    { to: "/policy", label: "Chính sách giao hàng" },
    { to: "/safety", label: "Chính sách bảo mật" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        <section>
          <h2 className="text-xl font-bold text-white">SugarNest</h2>
          <p className="mt-2 text-sm text-gray-400">
            Tiệm bánh chất lượng với công thức độc quyền, mang đến hương vị tuyệt hảo cho mọi dịp đặc biệt của bạn.
          </p>
        </section>

        <nav>
          <h3 className="font-semibold text-white mb-2">Liên kết nhanh</h3>
          <ul className="space-y-1 text-sm text-gray-400">

            {navLinks.map((link, i) => (
              <li key={i}>

                <Link to={link.to} className="hover:text-white hover:underline transition">
                  {link.label}
                </Link>

              </li>
            ))}

          </ul>
        </nav>

        <section>
          <h3 className="font-semibold text-white mb-2">Thông tin liên hệ</h3>
          <p className="text-sm text-gray-400">📍 123 Bakery Street, Sweetville</p>
          <p className="text-sm text-gray-400">📧 contact@sweetcake.com</p>
          <p className="text-sm text-gray-400">📞 (555) 123-4567</p>
        </section>

        <div>
          <h3 className="font-semibold text-white mb-2">Giờ mở cửa</h3>

          <ul className="space-y-1 text-sm text-gray-400">

            <li className="flex justify-between">
              <span>Thứ 2 - thứ 6:</span>
              <span>7:00 - 21:00</span>
            </li>

            <li className="flex justify-between">
              <span>Thứ 7:</span>
              <span>8:00 - 22:00</span>
            </li>

            <li className="flex justify-between">
              <span>Chủ nhật:</span> 
              <span>8:00 - 20:00</span>
            </li>
            
          </ul>

          <div className="flex gap-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>

        </div>
        
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SweetCake Bakery. All rights reserved.
      </div>
    </footer>
  );
}
