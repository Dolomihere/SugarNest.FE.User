import { useState, useEffect } from 'react';
import AxiosInstance from '../core/services/AxiosInstance';
import { logout } from '../core/services/AuthService';
import { Header } from './layouts/Header';
import { Footer } from './layouts/Footer';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FavoriteService from '../services/FavoriteService';
import { ProductCard } from '../components/ProductCard';
import { useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToastMessage from '../components/ToastMessage';
import OrderHistory from './OrderHistory'; // Hoặc đúng path tương ứng

import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faVenusMars,
  faEnvelope,
  faAlignLeft,
  faCheck,
  faTimes,
  faEdit,
  faSignOutAlt,

} from '@fortawesome/free-solid-svg-icons';

import {
  faFacebook,
  faInstagram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

const AccountPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editProfile, setEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [previewAvatar, setPreviewAvatar] = useState('');

  const [address, setAddress] = useState({ address: '', latitude: 0, longitude: 0 });
  const [avatarFile, setAvatarFile] = useState(null);
  const [bio, setBio] = useState('');
  const [fullname, setFullname] = useState('');
  const [gender, setGender] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar, setAvatar] = useState('');

  // Lấy sản phẩm yêu thích
  const {
    data: favoriteProducts = [],
    isLoading: favoritesLoading,
    isError: favoritesError,
  } = useQuery({
    queryKey: ['favorite-products'],
    queryFn: async () => {
      const res = await FavoriteService.getFavorites();
      return res.data.data || [];
    },
  });
  const queryClient = useQueryClient();

  const handleRemoveFavorite = async (productId) => {
    try {
      await FavoriteService.removeFavorites([productId]);
      queryClient.invalidateQueries(['favorite-products']);
      setSuccess('Đã xoá sản phẩm khỏi danh sách yêu thích.');
      setError('');
    } catch (err) {
      setError('Lỗi khi xoá sản phẩm yêu thích.');
      setSuccess('');
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await AxiosInstance.get('/users/personal');
        if (response.data.isSuccess && response.data.data) {
          const userData = response.data.data;
          setUser(userData);
          setAddress({
            address: userData.address || '',
            latitude: userData.latitude || 0,
            longitude: userData.longitude || 0,
          });
          setBio(userData.bio || '');
          setFullname(userData.fullname || '');
          setGender(userData.gender?.toString() || '');
          setPhoneNumber(userData.phoneNumber || '');
          setAvatar(userData.avatar || 'https://via.placeholder.com/150');
          setLoading(false);
        } else {
          setError(response.data.message || 'Không thể tải dữ liệu người dùng.');
          setLoading(false);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Lỗi khi tải dữ liệu người dùng. Vui lòng thử lại.');
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ TỰ ĐỘNG ẨN THÔNG BÁO
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleUpdateAvatar = async () => {
    if (!avatarFile) {
      setError('Vui lòng chọn một tệp hình ảnh.');
      return;
    }
    const formData = new FormData();
    formData.append('file', avatarFile);
    try {
      const response = await AxiosInstance.patch('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.isSuccess && response.data.data) {
        const newAvatar = response.data.data.avatar || user.avatar;
        setUser({ ...user, avatar: newAvatar });
        setAvatar(newAvatar);
        setSuccess('Cập nhật ảnh đại diện thành công.');
        setError('');
        setAvatarFile(null);
      } else {
        setError(response.data.message || 'Không thể cập nhật ảnh đại diện.');
        setSuccess('');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật ảnh đại diện.');
      setSuccess('');
    }
  };

 const handleUpdateAddress = async () => {
  if (!address.address.trim()) {
    setError("Vui lòng nhập địa chỉ.");
    return;
  }

  try {
    const response = await AxiosInstance.patch('/users/address', address);
    if (response.data.isSuccess) {
      setUser((prev) => ({
        ...prev,
        address: address.address,
        latitude: address.latitude,
        longitude: address.longitude,
      }));
      setSuccess("Cập nhật địa chỉ thành công.");
      setError('');
      setEditProfile(false);
    } else {
      setError(response.data.message || "Không thể cập nhật địa chỉ.");
      setSuccess('');
    }
  } catch (err) {
    setError("Lỗi khi cập nhật địa chỉ.");
    setSuccess('');
  }
};

  const handleUpdateBio = async () => {
  if (bio.length > 300) {
    setError("Tiểu sử không được vượt quá 300 ký tự.");
    return;
  }

  try {
    const response = await AxiosInstance.patch('/users/bio', { Bio: bio });
    if (response.data.isSuccess) {
      setUser((prev) => ({ ...prev, bio }));
      setSuccess("Cập nhật tiểu sử thành công.");
      setError('');
      setEditProfile(false);
    } else {
      setError(response.data.message || "Không thể cập nhật tiểu sử.");
      setSuccess('');
    }
  } catch (err) {
    setError("Lỗi khi cập nhật tiểu sử.");
    setSuccess('');
  }
};


  const handleUpdateFullname = async () => {
  const name = fullname.trim();
  if (!name) {
    setError("Vui lòng nhập họ tên.");
    return;
  }
  if (name.length < 2) {
    setError("Họ tên phải có ít nhất 2 ký tự.");
    return;
  }

  try {
    const response = await AxiosInstance.patch('/users/fullname', { Fullname: name });
    if (response.data.isSuccess) {
      setUser((prev) => ({ ...prev, fullname: name }));
      setSuccess("Cập nhật họ tên thành công.");
      setError('');
      setEditProfile(false);
    } else {
      setError(response.data.message || "Không thể cập nhật họ tên.");
      setSuccess('');
    }
  } catch (err) {
    setError("Lỗi khi cập nhật họ tên.");
    setSuccess('');
  }
};


  const handleUpdateGender = async () => {
    try {
      const response = await AxiosInstance.patch('/users/gender', { Gender: parseInt(gender) });
      if (response.data.isSuccess) {
        setUser((prev) => ({ ...prev, gender: parseInt(gender) }));
        setSuccess('Cập nhật giới tính thành công.');
        setError('');
        setEditProfile(false);
      } else {
        setError(response.data.message || 'Không thể cập nhật giới tính.');
        setSuccess('');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật giới tính.');
      setSuccess('');
    }
  };

  const handleUpdatePhoneNumber = async () => {
  const phone = phoneNumber.trim();

  if (!phone) {
    setError("Vui lòng nhập số điện thoại.");
    return;
  }

  if (!/^\d+$/.test(phone)) {
    setError("Số điện thoại chỉ được chứa chữ số (0–9).");
    return;
  }

  if (phone.length !== 10) {
    setError("Số điện thoại phải gồm đúng 10 chữ số.");
    return;
  }

  if (!/^(03|05|07|08|09)\d{8}$/.test(phone)) {
    setError("Số điện thoại không hợp lệ. Vui lòng dùng các đầu số: 03, 05, 07, 08 hoặc 09.");
    return;
  }

  try {
    const response = await AxiosInstance.patch('/users/phone', { PhoneNumber: phone });
    if (response.data.isSuccess) {
      setUser((prev) => ({ ...prev, phoneNumber: phone }));
      setSuccess("Cập nhật số điện thoại thành công.");
      setError('');
      setEditProfile(false);
    } else {
      setError(response.data.message || "Không thể cập nhật số điện thoại.");
      setSuccess('');
    }
  } catch (err) {
    setError("Lỗi khi cập nhật số điện thoại.");
    setSuccess('');
  }
};


  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fffaf3] text-brown-800">
        <Header />
        <div className="flex justify-center items-center h-screen">Đang tải...</div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fffaf3] text-brown-800">
        <Header />
        <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
        <Footer />
      </div>
    );
  }


  return (
<div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-section text-main">
      <Header />

      <main className="w-full px-4 py-8 mx-auto space-y-6 max-w-7xl">
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            
          </div>

          <section className="p-6 mb-6 bg-white border shadow-md rounded-xl">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="relative cursor-pointer group w-28 h-28" onClick={() => document.getElementById('avatarInput')?.click()}>
                <img
                  src={previewAvatar || avatar}
                  alt="avatar"
                  className="object-cover w-full h-full transition duration-300 border-4 rounded-full border-amber-300 hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center transition rounded-full opacity-0 bg-black/50 group-hover:opacity-100">
                  <span className="text-sm text-white">Thay đổi ảnh</span>
                </div>
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewAvatar(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </div>
              <div className="flex-1 space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-bold text-amber-700">{user.fullname}</h2>
                <p className="text-sm text-gray-500">{user.address}</p>
                <p className="mt-2 text-sm text-gray-700">{user.bio || 'Chưa có tiểu sử.'}</p>
                <div className="flex justify-center gap-4 mt-2 text-xl md:justify-start text-amber-600">
                  <FontAwesomeIcon icon={faFacebook} />
                  <FontAwesomeIcon icon={faInstagram} />
                  <FontAwesomeIcon icon={faTwitter} />
                </div>
              </div>
            </div>

            <button
              onClick={handleUpdateAvatar}
              className="mt-4 w-full bg-amber-500 text-white p-2 rounded hover:bg-amber-600"
            >
              Cập nhật ảnh đại diện
            </button>
          </section>

        <section className="space-y-6">
  {/* Thanh điều hướng ngang */}
  <nav className="flex flex-wrap justify-start gap-3 p-4 bg-white shadow rounded-xl mb-6">
    <button
      onClick={() => setActiveTab('profile')}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-amber-50 transition-colors ${
        activeTab === 'profile' ? 'bg-amber-100 text-amber-700 font-semibold' : 'text-gray-700'
      }`}
    >
      <FontAwesomeIcon icon={faUser} /> Thông tin cá nhân
    </button>
     <button
  onClick={() => setActiveTab('favorites')}
  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-amber-50 transition-colors ${
    activeTab === 'favorites' ? 'bg-amber-100 text-amber-700 font-semibold' : 'text-gray-700'
  }`}
>
  <i className="fa-solid fa-heart text-orange-300"></i>
  Sản phẩm yêu thích
  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-amber-500 text-white rounded-full">
    {favoriteProducts.length}
  </span>
</button>

    <button
      onClick={() => setActiveTab('orderHistory')}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-amber-50 transition-colors ${
        activeTab === 'orderHistory' ? 'bg-amber-100 text-amber-700 font-semibold' : 'text-gray-700'
      }`}
    >
      <i className="fa-solid fa-clock-rotate-left text-orange-300"></i>
      Lịch sử đơn hàng
    </button>

    
  </nav>

  {/* 👤 THÔNG TIN CÁ NHÂN */}
  {/* 👤 THÔNG TIN CÁ NHÂN */}
  {activeTab === 'profile' && (
     <div className="grid gap-6 text-sm text-gray-800 sm:grid-cols-2">
  {[
    {
      label: 'Họ và tên',
      key: 'fullname',
      icon: faUser,
      value: fullname,
      onChange: (e) => setFullname(e.target.value),
      onSave: handleUpdateFullname,
    },
    {
      label: 'Số điện thoại',
      key: 'phone',
      icon: faPhone,
      value: phoneNumber,
      onChange: (e) => setPhoneNumber(e.target.value),
      onSave: handleUpdatePhoneNumber,
    },
    {
      label: 'Địa chỉ',
      key: 'address',
      icon: faMapMarkerAlt,
      value: address.address,
      onChange: (e) => setAddress({ ...address, address: e.target.value }),
      onSave: handleUpdateAddress,
    },
    {
      label: 'Giới tính',
      key: 'gender',
      icon: faVenusMars,
      isSelect: true,
      value: gender,
      onChange: (e) => setGender(e.target.value),
      onSave: handleUpdateGender,
    },
  ].map(({ label, key, icon, value, onChange, onSave, isSelect }) => (
    <div
      key={key}
      className="flex flex-col gap-1 p-4 border border-amber-400  rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <label className="text-sm text-amber-700 font-semibold flex items-center gap-2">
        <FontAwesomeIcon icon={icon} className="text-amber-400" />
        {label}
      </label>
      {editProfile === key ? (
        <div className="flex items-center gap-2 transition-all duration-200">
          {isSelect ? (
            <select
              value={value}
              onChange={onChange}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-amber-300 focus:outline-none"
            >
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
            </select>
          ) : (
            <input
              value={value}
              onChange={onChange}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-amber-300 focus:outline-none"
            />
          )}
          <button
            onClick={onSave}
            className="text-green-600 hover:text-green-800 p-2 rounded-full bg-white hover:bg-green-50 transition"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            onClick={() => setEditProfile(false)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-white hover:bg-gray-100 transition"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span>{key === 'gender' ? (value === '1' ? 'Nam' : 'Nữ') : value}</span>
          <button
            onClick={() => setEditProfile(key)}
            className="text-amber-600 hover:text-amber-800 p-2 rounded-full bg-white hover:bg-amber-100 transition"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      )}
    </div>
  ))}

  {/* Email (không chỉnh sửa)
  <div className="flex flex-col gap-1 p-4 border border-amber-400 bg-amber-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <label className="text-sm text-amber-700 font-semibold flex items-center gap-2">
      <FontAwesomeIcon icon={faEnvelope} className="text-amber-400" />
      Email
    </label>
    <span>{user.email}</span>
  </div> */}

  {/* Bio (textarea full chiều rộng) */}
  <div className="flex flex-col gap-1 p-4 border border-amber-400  rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 sm:col-span-2">
    <label className="text-sm text-amber-700 font-semibold flex items-center gap-2">
      <FontAwesomeIcon icon={faAlignLeft} className="text-amber-400" />
      Tiểu sử
    </label>
    {editProfile === 'bio' ? (
      <div className="flex items-start gap-2 transition-all duration-200">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={2}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-300 focus:outline-none"
        />
        <div className="flex flex-col gap-1 pt-1">
          <button
            onClick={handleUpdateBio}
            className="text-green-600 hover:text-green-800 p-2 rounded-full bg-white hover:bg-green-50 transition"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            onClick={() => setEditProfile(false)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-white hover:bg-gray-100 transition"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <span>{bio || 'Chưa có'}</span>
        <button
          onClick={() => setEditProfile('bio')}
          className="text-amber-600 hover:text-amber-800 p-2 rounded-full bg-white hover:bg-amber-100 transition"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
    )}
  </div>
</div>
  )}

  {/* ❤️ SẢN PHẨM YÊU THÍCH */}
  {activeTab === 'favorites' && (
  <div className="p-6 bg-white border rounded-xl shadow-md space-y-4">

      
      {favoritesLoading ? (
        <p>Đang tải danh sách yêu thích...</p>
      ) : favoritesError ? (
        <p className="text-red-500">Lỗi khi tải sản phẩm yêu thích.</p>
      ) : favoriteProducts.length === 0 ? (
        <p>Bạn chưa có sản phẩm yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              isFavorite={true}
              viewMode="grid"
              onAddFavorite={() => handleRemoveFavorite(product.productId)}
              hidePrice={true}
            />
          ))}
        </div>
      )}
    </div>
  )}
 {activeTab === "orderHistory" && <OrderHistory embedded />}




</section> 
</div>
</main>
      <Footer />

      {/* ✅ HIỂN THỊ TOAST MESSAGE */}
      {success && (
        <ToastMessage
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}
      {error && (
        <ToastMessage
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}
    </div>
  );
};

export default AccountPage;