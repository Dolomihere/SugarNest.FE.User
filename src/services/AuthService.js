import { publicApi } from "../configs/AxiosConfig"

export const AuthService = {
  register: async (formdata) => {
    const payload = { ...formdata };
    const res = await publicApi.post('/auth/register', payload);
    return res.data;
  },
  verifyemail: async (formdata) => {
    const payload = { ...formdata };
    const res = await publicApi.post('/auth/verify', payload);
    return res.data;
  },
  login: async (formdata) => {
    const payload = { ...formdata };
    const res = await publicApi.post('auth/login', payload);
    return res.data;
  }
};
