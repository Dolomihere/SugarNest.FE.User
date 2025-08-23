import UserService from "../../services/UserService"
import { useState, useEffect, useMemo, useRef } from "react";

const UserMiniProfile = ({ userId }) => {
  const [avatarImg, setAvatarImg] = useState(
    "https://res.cloudinary.com/dwlvd5lxt/image/upload/v1750868725/user1_tym9ts.jpg"
  );
  const [name, setName] = useState("Không xác định");
  const [email, setEmail] = useState();

  // load user public informations
  const { response } = UserService.getPersonalUser(userId);

  useEffect(() => {
    if (response?.data) {
      const userInfo = response.data;
      setAvatarImg(userInfo.avatar || userInfo.externalAvatar || avatarImg);
      if (userInfo.fullname) setName(userInfo.fullname);
      if (userInfo.email) setEmail(userInfo.email);
    }
  }, [response]);

  return (
    <div className={""}>
      <div className="flex items-center gap-2">
        {/* Avatar */}
        <div
          className={` rounded-full border border-gray-200 dark:border-gray-800 overflow-hidden`}
        >
          <img
            src={avatarImg}
            alt="User Avatar"
            className="w-6 h-6 object-cover rounded-full"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col font-[Roboto]">
          <span
            className={`font-medium text-gray-700 dark:text-gray-200`}
          >
            {name}
          </span>
          <span className={` text-gray-500 dark:text-gray-500`}>
            {email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserMiniProfile;
