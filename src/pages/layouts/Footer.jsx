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
    { to: '/', label: 'Trang chủ' },
    { to: '/products', label: 'Sản phẩm' },
    { to: '/about', label: 'Về chúng tôi' },
    { to: '/contact', label: 'Liên hệ' },
    { to: '/discounts', label: 'Chương trình giảm giá' },
    { to: '/unity-game', label: 'Giải trí' },
  ];

  return (
    <footer className="bg-[#4B2E2B] text-[#F9E8D9]">
      <div className="grid grid-cols-1 gap-12 px-6 py-12 mx-auto max-w-7xl sm:grid-cols-2 md:grid-cols-4">
        <section>
          <h2 className="text-xl font-bold text-[#FFDAB9] uppercase mb-4">SugarNest</h2>
          <p className="mt-2 text-sm text-[#EFD8C5]">
            Tiệm bánh chất lượng với công thức độc quyền, mang đến hương vị tuyệt hảo cho mọi dịp đặc biệt của bạn.
          </p>
        </section>

        <nav>
          <h3 className="text-xl font-bold text-[#FFDAB9] uppercase mb-4">Liên kết nhanh</h3>
          <ul className="space-y-1 text-sm text-[#EFD8C5]">
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
          <h3 className="text-xl font-bold text-[#FFDAB9] uppercase mb-4">Thông tin liên hệ</h3>
          <p className="text-sm text-[#EFD8C5] flex items-center gap-2 mb-5">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#FFB877]" />
            <a
              href="https://www.google.com/maps/search/?api=1&query=QTSC+Building+1,+Đ.+Quang+Trung,+Tân+Hưng+Thuận,+Hóc+Môn,+Hồ+Chí+Minh,+Việt+Nam"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white hover:underline"
            >
              QTSC Building 1, Đ. Quang Trung, Tân Hưng Thuận, Hóc Môn, Hồ Chí Minh, Việt Nam
            </a>
          </p>
          <p className="text-sm text-[#EFD8C5] flex items-center gap-2 mb-5">
            <FontAwesomeIcon icon={faEnvelope} className="text-[#FFB877]" />
            contact@sugarnestcake.com
          </p>
          <p className="text-sm text-[#EFD8C5] flex items-center gap-2 mb-5">
            <FontAwesomeIcon icon={faPhone} className="text-[#FFB877]" />
            0915 027 930
          </p>
        </section>

        <div>
          <h3 className="text-xl font-bold text-[#FFDAB9] uppercase mb-4">Giờ mở cửa</h3>
          <ul className="space-y-1 text-sm text-[#EFD8C5]">
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
              href="https://www.facebook.com/yn.nhi.2975"
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

      <div className="border-t border-[#6C4C42] text-center py-4 text-sm text-[#DCC5AF]">
        &copy; {new Date().getFullYear()} SugarNest Bakery. All rights reserved.
      </div>
    </footer>
  );
}