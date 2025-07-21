import { useState, useEffect } from 'react';
import AxiosInstance from '../core/services/AxiosInstance';
import { logout } from '../core/services/AuthService';
import { Header } from './layouts/Header'; // Giả sử bạn có component Header
import { Footer } from './layouts/Footer'; // Giả sử bạn có component Footer
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
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

  // State cho form cập nhật
  const [address, setAddress] = useState({ address: '', latitude: 0, longitude: 0 });
  const [avatarFile, setAvatarFile] = useState(null);
  const [bio, setBio] = useState('');
  const [fullname, setFullname] = useState('');
  const [gender, setGender] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar, setAvatar] = useState('');

  // Fetch dữ liệu người dùng khi component mount
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

  // Xử lý cập nhật địa chỉ
  const handleUpdateAddress = async () => {
    try {
      const response = await AxiosInstance.patch('/users/address', address);
      if (response.data.isSuccess) {
        setUser({ ...user, address: address.address, latitude: address.latitude, longitude: address.longitude });
        setSuccess('Cập nhật địa chỉ thành công.');
        setError('');
      } else {
        setError(response.data.message || 'Không thể cập nhật địa chỉ.');
        setSuccess('');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật địa chỉ.');
      setSuccess('');
    }
  };

  // Xử lý cập nhật ảnh đại diện
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
      console.error('Avatar Update Error:', err);
      setError('Lỗi khi cập nhật ảnh đại diện.');
      setSuccess('');
    }
  };

  // Xử lý cập nhật tiểu sử
  const handleUpdateBio = async () => {
    try {
      const response = await AxiosInstance.patch('/users/bio', { Bio: bio });
      if (response.data.isSuccess) {
        setUser({ ...user, bio });
        setSuccess('Cập nhật tiểu sử thành công.');
        setError('');
      } else {
        setError(response.data.message || 'Không thể cập nhật tiểu sử.');
        setSuccess('');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật tiểu sử.');
      setSuccess('');
    }
  };

  // Xử lý cập nhật họ tên
  const handleUpdateFullname = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const newFullname = `${firstName} ${lastName}`.trim();
    try {
      const response = await AxiosInstance.patch('/users/fullname', { Fullname: newFullname });
      if (response.data.isSuccess) {
        setUser({ ...user, fullname: newFullname });
        setFullname(newFullname);
        setSuccess('Cập nhật họ tên thành công.');
        setError('');
        setEditProfile(false);
      } else {
        setError(response.data.message || 'Không thể cập nhật họ tên.');
        setSuccess('');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật họ tên.');
      setSuccess('');
    }
  };

  // Xử lý cập nhật giới tính
  const handleUpdateGender = async () => {
    try {
      const response = await AxiosInstance.patch('/users/gender', { Gender: parseInt(gender) });
      if (response.data.isSuccess) {
        setUser({ ...user, gender: parseInt(gender) });
        setSuccess('Cập nhật giới tính thành công.');
        setError('');
      } else {
        setError(response.data.message || 'Không thể cập nhật giới tính.');
        setSuccess('');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật giới tính.');
      setSuccess('');
    }
  };

  // Xử lý cập nhật số điện thoại
  const handleUpdatePhoneNumber = async () => {
    try {
      const response = await AxiosInstance.patch('/users/phone', { PhoneNumber: phoneNumber });
      if (response.data.isSuccess) {
        setUser({ ...user, phoneNumber });
        setSuccess('Cập nhật số điện thoại thành công.');
        setError('');
      } else {
        setError(response.data.message || 'Không thể cập nhật số điện thoại.');
        setSuccess('');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật số điện thoại.');
      setSuccess('');
    }
  };

  // Xử lý đăng xuất
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
    <div className="min-h-screen flex flex-col bg-[#fffaf3] text-brown-800">
      <Header />

      <main className="w-full px-4 py-8 mx-auto space-y-6 max-w-7xl">
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-amber-700">
              Thông tin người dùng
            </h1>
            {!editProfile && (
              <button
                onClick={() => setEditProfile(true)}
                className="px-4 py-2 text-white transition-colors rounded-md bg-amber-500 hover:bg-amber-600"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" /> Chỉnh sửa
              </button>
            )}
          </div>

          {/* BIO + AVATAR */}
          <section className="p-6 mb-6 bg-white border shadow-md rounded-xl">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="relative cursor-pointer group w-28 h-28"
                   onClick={() => document.getElementById('avatarInput')?.click()}>
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
                  <a href="#" className="hover:text-amber-800">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                  <a href="#" className="hover:text-amber-800">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="#" className="hover:text-amber-800">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
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

          {/* MAIN CONTENT */}
          <section className="grid gap-6 md:grid-cols-3">
            {/* SIDEBAR */}
            <aside className="space-y-6">
              <nav className="p-4 space-y-3 brief bg-white shadow rounded-xl">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-md text-left hover:bg-amber-50 transition-colors ${
                    activeTab === 'profile' ? 'bg-amber-100 text-amber-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} /> Thông tin cá nhân
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-left text-gray-700 hover:bg-amber-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                </button>
              </nav>
            </aside>

            {/* TAB CONTENT */}
            <section className="space-y-6 md:col-span-2">
              {activeTab === 'profile' && !editProfile && (
                <div className="p-6 space-y-4 bg-white shadow-md rounded-xl">
                  <h2 className="text-2xl font-semibold text-amber-700">Thông Tin Cá Nhân</h2>
                  {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}
                  {success && <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">{success}</div>}
                  <div className="grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
                    <p>
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-amber-600" />
                      <strong>Họ và tên:</strong> {user.fullname}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-amber-600" />
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faPhone} className="mr-2 text-amber-600" />
                      <strong>Số điện thoại:</strong> {user.phoneNumber}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-amber-600" />
                      <strong>Địa chỉ:</strong> {user.address}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-amber-600" />
                      <strong>Giới tính:</strong> {user.gender === 1 ? 'Nam' : 'Nữ'}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-amber-600" />
                      <strong>Tiểu sử:</strong> {user.bio || 'Chưa có'}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>

      {/* Overlay cho chỉnh sửa hồ sơ */}
      {editProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between pb-2 mb-4 border-b">
              <h2 className="text-lg font-semibold text-amber-700">
                Chỉnh sửa thông tin cá nhân
              </h2>
              <button
                onClick={() => setEditProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span>×</span>
              </button>
            </div>
            <form onSubmit={handleUpdateFullname} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={user.fullname?.split(' ')[0] || ''}
                    className="w-full p-2 mt-1 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={user.fullname?.split(' ').slice(1).join(' ') || ''}

                    className="w-full p-2 mt-1 border rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleUpdatePhoneNumber}
                    className="mt-2 w-full bg-amber-500 text-white p-2 rounded hover:bg-amber-600"
                  >
                    Cập nhật số điện thoại
                  </button>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    type="text"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full p-2 mt-1 border rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleUpdateAddress}
                    className="mt-2 w-full bg-amber-500 text-white p-2 rounded hover:bg-amber-600"
                  >
                    Cập nhật địa chỉ
                  </button>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Tiểu sử</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateBio}
                    className="mt-2 w-full bg-amber-500 text-white p-2 rounded hover:bg-amber-600"
                  >
                    Cập nhật tiểu sử
                  </button>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(parseInt(e.target.value))}
                    className="w-full p-2 mt-1 border rounded-md"
                  >
                    <option value="1">Nam</option>
                    <option value="2">Nữ</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleUpdateGender}
                    className="mt-2 w-full bg-amber-500 text-white p-2 rounded hover:bg-amber-600"
                  >
                    Cập nhật giới tính
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditProfile(false)}
                  className="px-4 py-2 text-gray-700 transition-colors bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white transition-colors rounded-md bg-amber-600 hover:bg-amber-700"
                >
                  Lưu họ tên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AccountPage;
