import { serverApi } from '../../configs/AxiosConfig';

const path = '/auth';

export const authService = {
  register: async (registerData) => {
    const res = await serverApi.post(`${path}/signup`, { ...registerData });
    return res.data;
  },
  login: async (loginData) => {
    const res = await serverApi.post(`${path}/signin`, { ...loginData });
    return res.data;
  },
  verifyemail: async (verifyData) => {
    const res = await serverApi.post(`${path}/verify`, { ...verifyData });
    return res.data;
  },
  resendverifyemail: async (email) => {
    const res = await serverApi.post(`${path}/verify/send`, { email });
    return res.data;
  },
  on2fa: async (enable2faData) => {
    const res = await serverApi.post(`${path}/signin2fa`, { ...enable2faData });
    return res.data;
  },
  resetpassword: async (changePwdData) => {
    const res = await serverApi.post(`${path}/reset-password`, { ...changePwdData });
    return res.data;
  },
  resendresetpassword: async (email) => {
    const res = await serverApi.post(`${path}/reset-password/send`, { email });
    return res.data;
  }
};
