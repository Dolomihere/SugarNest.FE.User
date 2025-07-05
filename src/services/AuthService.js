const httpCLient = axios.create({
  baseURL: 'https://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

const endpoint = '/auth'

const AuthService = {
  check: (token) => httpClient.get(endpoint, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  register: (formdata) => httpClient.post(`${endpoint}/register`, formdata),
  login: (formdata) => httpClient.post(`${endpoint}/login`, formdata),
  on2fa: (formdata) => httpClient.post(`${endpoint}/login2fa`, formdata),
  refreshtoken: (token) => httpClient.post(`${endpoint}/refresh-token`, { token }),
  verifyemail: (formdata) => httpClient.post(`${endpoint}/verify`, formdata),
  resendverifyemail: (email) => httpClient.post(`${endpoint}/resend`, email),
  resetpassword: (formdata) => httpClient.post(`${endpoint}/reset-password`, formdata),
};

export default AuthService;
