import httpClient from '../configs/AxiosConfig'

const endpoint = '/auth'

const AuthService = {
  register: (formdata) => httpClient.post(`${endpoint}/register`, formdata),
  login: (formdata) => httpClient.post(`${endpoint}/login`, formdata),
  verifyEmail: (formdata) => httpClient.patch(`${endpoint}/verify`, formdata),
};

export default AuthService;

