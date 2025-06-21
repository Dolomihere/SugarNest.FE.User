import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faEnvelope,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

export function Footer() {
  const navLinks = [
    { to: "/about", label: "Về chúng tôi" },
    { to: "/menu", label: "Thực đơn" },
    { to: "/qna", label: "Câu hỏi thường gặp" },
    { to: "/policy", label: "Chính sách giao hàng" },
    { to: "/safety", label: "Chính sách bảo mật" }
  ];

  return (
    <footer className="text-gray-100 bg-gray-900">
      <div className="grid grid-cols-1 gap-8 px-6 py-12 mx-auto max-w-7xl sm:grid-cols-2 md:grid-cols-4">
        
        <section>
          <h2 className="text-xl font-bold text-[#FFDAB9] uppercase mb-4">SugarNest</h2>
          <p className="mt-2 text-sm text-[#EFD8C5]">
            Tiệm bánh chất lượng với công thức độc quyền, mang đến hương vị tuyệt hảo cho mọi dịp đặc biệt của bạn.
          </p>
        </section>

        <nav>
          <h3 className="mb-2 font-semibold text-white">Liên kết nhanh</h3>
          <ul className="space-y-1 text-sm text-gray-400">

            {navLinks.map((link, i) => (
              <li key={i}>

                <Link to={link.to} className="transition hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}

          </ul>
        </nav>

        <section>
          <h3 className="mb-2 font-semibold text-white">Thông tin liên hệ</h3>
          <p className="text-sm text-gray-400">📍 123 Bakery Street, Sweetville</p>
          <p className="text-sm text-gray-400">📧 contact@sweetcake.com</p>
          <p className="text-sm text-gray-400">📞 (555) 123-4567</p>
        </section>

        <div>
          <h3 className="mb-2 font-semibold text-white">Giờ mở cửa</h3>

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

          <div className="flex gap-4 mt-4 text-[#FFDAB9] text-sm">
            <a
              href="https://https://www.facebook.com/yn.nhi.2975"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFB877] transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFB877] transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faInstagram} /> Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="py-4 text-sm text-center text-gray-600 border-t border-gray-700">
        &copy; {new Date().getFullYear()} SweetCake Bakery. All rights reserved.
      </div>
    </footer>
  );
}
