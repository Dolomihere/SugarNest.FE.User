import { useState } from 'react'
import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCreditCard,
  faGift,
  faBoxOpen,
  faSignOutAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faInstagram,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'

export function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [viewOrderId, setViewOrderId] = useState(null)

  const user = {
    name: 'Phùng Ngọc Yến Nhi',
    email: 'ynhi.sugarnest@gmail.com',
    phone: '0905123456',
    avatar: 'images/owner.png',
    location: 'TP. Hồ Chí Minh, Việt Nam'
  }
  const [avatar, setAvatar] = useState(user.avatar)

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf3] text-brown-800">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* BIO + SLIDE */}
       <section className="bg-white rounded-xl shadow-md p-6">
  <div className="flex flex-col md:flex-row items-center gap-6">
    {/* Avatar upload */}
    <div className="relative group w-28 h-28 cursor-pointer"
         onClick={() => document.getElementById('avatarInput')?.click()}>
      <img
        src={avatar}
        alt="avatar"
        className="w-full h-full rounded-full object-cover border-4 border-amber-300 transition duration-300"
      />
      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <span className="text-white text-sm">Thay đổi ảnh</span>
      </div>
      <input
        type="file"
        id="avatarInput"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setAvatar(reader.result)
            reader.readAsDataURL(file)
          }
        }}
        className="hidden"
      />
    </div>

    {/* Thông tin cá nhân */}
    <div className="flex-1 space-y-2 text-center md:text-left">
      <h2 className="text-2xl font-bold text-amber-700">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.location}</p>
      <p className="mt-2 text-sm text-gray-700">
        Khách hàng trung thành của SugarNest từ năm 2023 – Ưa chuộng bánh kem,
        combo ngọt và săn mã giảm giá hàng tuần.
      </p>
      <div className="mt-2 flex justify-center md:justify-start gap-4 text-amber-600 text-xl">
        <a href="#" className="hover:text-amber-800"><FontAwesomeIcon icon={faFacebook} /></a>
        <a href="#" className="hover:text-amber-800"><FontAwesomeIcon icon={faInstagram} /></a>
        <a href="#" className="hover:text-amber-800"><FontAwesomeIcon icon={faTwitter} /></a>
      </div>
    </div>
  </div>
</section>



        {/* TAGS */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-md font-semibold text-brown-700 mb-2">Sở thích</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Bánh kem dâu tây', 'Trà đào cam sả', 'Bánh mì bơ tỏi',
              'Voucher giảm giá', 'Combo bánh + trà', 'Tặng quà sinh nhật',
              'Ưu đãi cuối tuần', 'Bánh mousse chanh dây', 'Socola handmade', 'Combo tiệc sinh nhật'
            ].map((tag,i) => (
              <span key={i} className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-full">{tag}</span>
            ))}
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* SIDEBAR */}
          <aside className="space-y-6">
            <nav className="bg-white p-4 rounded-xl shadow space-y-3 text-sm">
              {[
                { key: 'profile', icon: faUser, label: 'Thông tin cá nhân' },
                { key: 'orders', icon: faBoxOpen, label: 'Lịch sử đơn hàng' },
                { key: 'coupons', icon: faGift, label: 'Mã giảm giá' }
              ].map(btn => (
                <button key={btn.key} onClick={() => { setActiveTab(btn.key); setViewOrderId(null) }}
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-md text-left hover:bg-amber-50 ${
                    activeTab === btn.key ? 'bg-amber-100 text-amber-700 font-semibold' : 'text-gray-700'
                  }`}>
                  <FontAwesomeIcon icon={btn.icon} /> {btn.label}
                </button>
              ))}
             
            </nav>
          </aside>

          {/* TAB CONTENT */}
          <section className="md:col-span-2 space-y-6">
            {activeTab === 'profile' && <ProfileTab user={user} />}
            {activeTab === 'orders' &&
              (viewOrderId
                ? <OrderDetailTab orderId={viewOrderId} onBack={() => setViewOrderId(null)} />
                : <OrderHistoryTab onViewDetail={setViewOrderId} />)
            }
            {activeTab === 'coupons' && <CouponTab />}
          </section>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// ------------------ Subcomponents ------------------

function ProfileTab({ user }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-amber-700">Thông Tin Khách Hàng</h2>
      <div className="grid sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        {[
          { icon: faUser, label: 'Họ và tên', value: user.name },
          { icon: faEnvelope, label: 'Email', value: user.email },
          { icon: faPhone, label: 'Số điện thoại', value: user.phone },
          { icon: faMapMarkerAlt, label: 'Địa chỉ', value: user.location },
          { icon: faCreditCard, label: 'Thành viên', value: 'Khách hàng thân thiết' },
          { icon: faGift, label: 'Điểm thưởng', value: '1.250 điểm' },
        ].map((field, i) => (
          <p key={i}>
            <FontAwesomeIcon icon={field.icon} className="text-amber-600 mr-2" />
            <strong>{field.label}:</strong> {field.value}
          </p>
        ))}
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-semibold text-brown-700 mb-2">Lịch sử đăng nhập gần đây</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>01/07/2025 - 20:45 từ IP: 192.168.1.10</li>
          <li>30/06/2025 - 09:30 từ IP: 192.168.1.11</li>
          <li>28/06/2025 - 22:15 từ IP: 192.168.1.12</li>
        </ul>
      </div>
    </div>
  )
}

function OrderHistoryTab({ onViewDetail }) {
  const orders = [
  {
    id: 'SN001',
    date: '30/06/2025',
    status: 'Đã giao',
    total: 310000, 
    transactions: [
      {
        id: 'T001',
        method: 'Chuyển khoản',
        amount: 310000, 
        status: 'Đã thanh toán',
        time: '30/06/2025 09:30'
      }
    ]
  },
  {
    id: 'SN002',
    date: '22/06/2025',
    status: 'Đang xử lý',
    total: 205000,
    transactions: [
      {
        id: 'T002',
        method: 'Ví điện tử',
        amount: 205000,
        status: 'Chờ thanh toán',
        time: '22/06/2025 14:10'
      }
    ]
  }
]



  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-amber-700">Lịch sử đơn hàng</h2>
      {orders.map(o => (
        <div key={o.id} className="border rounded-lg p-4 bg-amber-50">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>Mã đơn:</strong> {o.id}</p>
              <p><strong>Ngày:</strong> {o.date}</p>
              <p><strong>Trạng thái:</strong> {o.status}</p>
              <p className="text-amber-700 font-semibold"><strong>Tổng:</strong> {o.total.toLocaleString()}đ</p>
            </div>
            <button
              onClick={() => onViewDetail(o.id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition"
            >
              <FontAwesomeIcon icon={faBoxOpen} />
              Xem chi tiết
            </button>

          </div>
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-brown-600 mb-1">Lịch sử giao dịch</h4>
            {o.transactions.map(t => (
              <div key={t.id} className="text-sm text-gray-700 mb-1">
                <p><strong>Mã giao dịch:</strong> {t.id}</p>
                <p><strong>Phương thức:</strong> {t.method}</p>
                <p><strong>Số tiền:</strong> {t.amount.toLocaleString()}đ</p>
                <p><strong>Trạng thái:</strong> {t.status}</p>
                <p><strong>Thời gian:</strong> {t.time}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function OrderDetailTab({ orderId, onBack }) {
  const orders = {
    SN001: {
      id: 'SN001',
      date: '30/06/2025',
      status: 'Đã giao',
      address: '12 Nguyễn Huệ, Q1, TP.HCM',
      note: 'Giao trước 5h chiều nhé',
      shippingFee: 20000,
      discount: 0,
      items: [
        { name: 'Bánh kem dâu', image: 'https://i.pinimg.com/736x/a9/e5/43/a9e5437c625162fb181c010358c1af81.jpg', qty: 1, price: 120000 },
        { name: 'Bánh quy bơ Pháp', image: 'https://i.pinimg.com/736x/d8/dc/a8/d8dca83f175367d6ca6e7ada7f4a9e36.jpg', qty: 2, price: 85000 }
      ],
      history: [
        { time: '30/06/2025 09:00', status: 'Đã đặt hàng' },
        { time: '30/06/2025 10:00', status: 'Đã thanh toán' },
        { time: '30/06/2025 12:00', status: 'Đang giao hàng' },
        { time: '30/06/2025 16:00', status: 'Đã giao' }
      ]
    },
    SN002: {
      id: 'SN002',
      date: '22/06/2025',
      status: 'Đang xử lý',
      address: '45 Lê Lợi, Quận 1, TP.HCM',
      note: 'Giao vào buổi sáng',
      shippingFee: 15000,
      discount: 10000,
      items: [
        { name: 'Bánh mì bơ tỏi', image: 'https://i.pinimg.com/736x/ff/81/e8/ff81e8d3a3466b0987c1d3b92464c38d.jpg', qty: 1, price: 50000 },
        { name: 'Bánh su kem trứng muối	', image: 'https://i.pinimg.com/736x/18/af/56/18af5692047dce13fb627e5fca6275d2.jpg', qty: 2, price: 75000 }
      ],
      history: [
        { time: '22/06/2025 13:00', status: 'Đã đặt hàng' },
        { time: '22/06/2025 14:10', status: 'Chờ thanh toán' }
      ]
    }
  }

  const order = orders[orderId]
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + order.shippingFee - order.discount

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition"
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      Quay lại
    </button>
      <h2 className="text-xl font-semibold text-amber-700">Chi tiết đơn {order.id}</h2>

      <div className="text-sm text-gray-700 space-y-2">
        <p><strong>Ngày đặt:</strong> {order.date}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
        <p><strong>Địa chỉ giao:</strong> {order.address}</p>
        {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
      </div>

      <div>
        <h3 className="font-semibold text-brown-700 mb-2">Sản phẩm</h3>
        <div className="space-y-4">
          {order.items.map((i, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <img src={i.image} alt={i.name} className="w-16 h-16 rounded object-cover border" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{i.name}</p>
                <p>Số lượng: {i.qty}</p>
                <p>Đơn giá: {i.price.toLocaleString()}đ</p>
              </div>
              <p className="text-amber-700 font-semibold">
                {(i.price * i.qty).toLocaleString()}đ
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 text-sm space-y-1 text-gray-700">
        <div className="flex justify-between"><span>Tạm tính:</span><span>{subtotal.toLocaleString()}đ</span></div>
        <div className="flex justify-between"><span>Giảm giá:</span><span>-{order.discount.toLocaleString()}đ</span></div>
        <div className="flex justify-between"><span>Phí vận chuyển:</span><span>{order.shippingFee.toLocaleString()}đ</span></div>
        <div className="flex justify-between font-semibold text-brown-700"><span>Tổng cộng:</span><span>{total.toLocaleString()}đ</span></div>
      </div>

      <div className="pt-6 space-y-2 text-sm text-gray-700">
        <h4 className="font-semibold text-brown-600">Lịch sử trạng thái</h4>
        {order.history.map((h, i) => (
          <div key={i} className="flex items-start gap-2">
            <FontAwesomeIcon icon={faClock} className="text-amber-600 mt-1" />
            <p><strong>{h.time}</strong> — {h.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


function CouponTab() {
  const coupons = [
    { code: 'GIAM10', desc: 'Giảm 10% cho đơn từ 200k', expiry: '31/07/2025' },
    { code: 'FREESHIP', desc: 'Miễn phí vận chuyển toàn quốc', expiry: '15/08/2025' },
    { code: 'BIRTHDAY25', desc: 'Giảm 25% dịp sinh nhật', expiry: '01/12/2025' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-amber-700">Mã giảm giá</h2>
      {coupons.map((c, idx) => (
        <div key={idx} className="border border-amber-200 rounded-lg p-4 bg-amber-50 text-sm">
          <p><strong>Mã:</strong> <span className="text-amber-700 font-bold">{c.code}</span></p>
          <p><strong>Chi tiết:</strong> {c.desc}</p>
          <p><strong>Hạn dùng:</strong> {c.expiry}</p>
        </div>
      ))}
    </div>
  )
}
