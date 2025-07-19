import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Header } from './layouts/Header';
import { Footer } from './layouts/Footer';

const LeafletMap = ({ onAddressSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([10.762622, 106.660172], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const marker = L.marker([10.762622, 106.660172], { draggable: true }).addTo(map);
    markerRef.current = marker;
    fetchAddress(10.762622, 106.660172);

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      fetchAddress(lat, lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current = newMarker;
        newMarker.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          fetchAddress(lat, lng);
        });
      }
      fetchAddress(lat, lng);
    });

    return () => map.remove();
  }, []);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      onAddressSelect(data.display_name || `${lat}, ${lng}`);
    } catch (err) {
      console.error('Lỗi lấy địa chỉ:', err);
      onAddressSelect(`${lat}, ${lng}`);
    }
  };

  return (
    <>
      <div ref={mapRef} className="w-full h-64 rounded-lg border" />
      <p className="text-sm text-gray-500 mt-2">
        🔍 Bấm vào bản đồ hoặc kéo marker để chọn vị trí giao hàng.
      </p>
    </>
  );
};

const CheckoutPage = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [addressFromMap, setAddressFromMap] = useState('');

  const products = [
    {
      name: 'Bánh sandwich cam',
      description: 'Bánh mềm thơm vị cam, đóng gói 3 cái',
      price: 12000,
      originalPrice: 20000,
      image: 'https://i.pinimg.com/736x/62/69/ae/6269aef34a3350f503b78cd52375ceeb.jpg',
    },
    {
      name: 'Bánh tart trứng Hồng Kông',
      description: 'Vỏ bánh giòn, nhân trứng mềm béo',
      price: 22000,
      originalPrice: 28000,
      image: 'https://i.pinimg.com/736x/26/75/d7/2675d71396d515785595ec4f641be2f5.jpg',
    },
    {
      name: 'Bánh donut chocolate',
      description: 'Bánh donut phủ chocolate ngọt ngào',
      price: 16000,
      originalPrice: 20000,
      image: 'https://i.pinimg.com/736x/4e/13/9d/4e139d2276aba52b7cfb7d0524300f57.jpg',
    },
    {
      name: 'Bánh su kem mini',
      description: 'Hộp 5 bánh su kem, nhân vanilla béo nhẹ',
      price: 19000,
      originalPrice: 25000,
      image: 'https://i.pinimg.com/736x/90/aa/c5/90aac5189a4707e2f6dc4e7c702c3a74.jpg',
    },
  ];

  const shippingFee = 40000;
  const totalPrice = products.reduce((acc, item) => acc + item.price, 0) + shippingFee;

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error('Lỗi tải tỉnh:', err));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts))
        .catch((err) => console.error('Lỗi tải quận/huyện:', err));
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: '',
    phoneNumber: '',
    email: '',
    deliveryTime: '',
    note: '',
    userVoucher: '',
  });
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken;

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] text-gray-700 bg-[#fffaf3]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái */}
          <div className="lg:col-span-1 space-y-6 order-1 lg:order-none sticky top-8 h-fit">
            <div className="p-6 rounded-2xl shadow-md space-y-4 bg-white">
              <h2 className="text-xl font-semibold text-heading">Đơn hàng của bạn</h2>
              {products.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.price.toLocaleString()} ₫</span>
                </div>
              ))}
              <div className="flex justify-between mt-2 text-sm">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee.toLocaleString()} ₫</span>
              </div>
              <div className="border-t pt-2 font-bold text-base flex justify-between text-amber-600">
                <span>Tổng thanh toán:</span>
                <span>{totalPrice.toLocaleString()} ₫</span>
              </div>
              <button type="submit" className="btn-primary w-full text-center">
                Đặt mua ngay
              </button>
            </div>

            <div className="p-6 rounded-2xl shadow-md text-sm bg-white text-main space-y-4">
              <div className="grid grid-cols-1 gap-2 text-yellow-700 font-semibold text-center">
                <div>✔ Miễn phí vận chuyển đơn từ 300k</div>
                <div>✔ Giao hàng 2–3 ngày</div>
                <div>✔ Hỗ trợ hoàn 100%</div>
                <div>✔ Thanh toán khi nhận</div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-bold mb-2 text-heading text-base">Hướng dẫn đặt hàng</h3>
                <ul className="list-disc pl-5 space-y-1 text-sub">
                  <li>Chọn sản phẩm và thêm vào giỏ</li>
                  <li>Điền đầy đủ thông tin giao hàng</li>
                  <li>Nhấn <strong className="text-heading">Đặt mua ngay</strong> để hoàn tất</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl shadow-md space-y-6 bg-white">
              <h2 className="text-xl font-semibold text-heading">Sản phẩm đã chọn</h2>
              <div className="overflow-x-auto">
                {products.map((product, idx) => (
                  <div key={idx} className="flex md:flex-row items-start gap-6 mb-6">
                    <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg border" />
                    <div>
                      <h3 className="text-lg font-semibold text-heading">{product.name}</h3>
                      <p className="text-sub text-sm">{product.description}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">{product.price.toLocaleString()} ₫</span>
                        <span className="text-gray-400 line-through text-sm">{product.originalPrice.toLocaleString()} ₫</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl shadow-md space-y-6 bg-white">
              <h2 className="text-xl font-semibold text-heading">Thông tin giao hàng</h2>
              <form className="space-y-5 text-main">
                <div>
                  <label className="block text-sm font-medium text-sub mb-1">Tên của bạn</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-3" placeholder="Nhập tên của bạn" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sub mb-1">Điện thoại</label>
                  <input type="tel" className="w-full border border-gray-300 rounded-lg p-3" placeholder="Nhập số điện thoại" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sub mb-1">Chọn vị trí trên bản đồ</label>
                  <LeafletMap onAddressSelect={(addr) => setAddressFromMap(addr)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sub mb-1">Địa chỉ chi tiết</label>
                  <textarea
                    value={addressFromMap}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg p-3"
                    rows="3"
                    placeholder="Địa chỉ tự động từ bản đồ"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
