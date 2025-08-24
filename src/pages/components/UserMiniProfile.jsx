import { useState, useEffect } from "react";
import UserService from "../../services/UserService";

const UserMiniProfile = ({ userId }) => {
  const [avatarImg, setAvatarImg] = useState("/images/default-avatar.png");
  const [name, setName] = useState("Người dùng ẩn danh");
  const [email, setEmail] = useState("");

  useEffect(() => {
  if (!userId) return;

  const fetchUser = async () => {
    try {
      const res = await UserService.getPublicUser(userId);
      if (res.isSuccess && res.data) {
        const userInfo = res.data;
        setAvatarImg(
          userInfo.avatar ||
          userInfo.externalAvatar ||
          "/images/default-avatar.png"
        );
        setName(userInfo.fullname || "Người dùng ẩn danh");
        setEmail(userInfo.email || "");
      }
    } catch (err) {
      console.error("Lỗi fetch public user:", err);
    }
  };

  fetchUser();
}, [userId]);


  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <img
        src={avatarImg}
        alt="User Avatar"
        className="w-8 h-8 rounded-full border border-gray-200 object-cover"
        onError={(e) => (e.target.src = "/images/default-avatar.png")}
      />

      {/* Info */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        {email && <span className="text-xs text-gray-500">{email}</span>}
      </div>
    </div>
  );
};

export default UserMiniProfile;
