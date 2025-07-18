import { publicApi } from "../configs/AxiosConfig"

export const AuthService = {
  register: async (formdata) => {
    const payload = { ...formdata };
    const res = await publicApi.post('/auth/signup', payload);
    return res.data;
  },
  verifyemail: async (formdata) => {
    const payload = { ...formdata };
    const res = await publicApi.post('/auth/verify', payload);
    return res.data;
  },
  resendverifyemail: async (email) => {
    const payload = { email };
    const res = await publicApi.post('/auth/verify/send', payload);
    return res.data;
  },
  login: async (formdata) => {
    const payload = { ...formdata };
    const res = await publicApi.post('auth/signin', payload);
    return res.data;
  }
};
