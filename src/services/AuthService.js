import httpClient from '../configs/AxiosConfig'

const endpoint = '/auth'

const AuthService = {
  check: (token) => httpClient.get(endpoint, { 
    headers: {
      Authorization: `Bearer ${token.trim()}`,
    },
  }),
  register: (formdata) => httpClient.post(`${endpoint}/register`, formdata),
  login: (formdata) => httpClient.post(`${endpoint}/login`, formdata),
  enable2fa: (formdata) => httpClient.post(`${endpoint}/login2fa`, formdata),
  verifyEmail: (formdata) => httpClient.patch(`${endpoint}/verify`, formdata),
  resetPassword: (formdata) => httpClient.patch(`${endpoint}/reset-password`, formdata),
};

export default AuthService;
