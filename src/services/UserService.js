
const UserService = {
  getProfile: () => localStorage.getItem("accessToken"),
}

export default UserService;
