import { serverApi } from '../../configs/AxiosConfig';

const path = '/users';

export const userService = {
  getUserInfo: async (token) => {
    const res = await serverApi.get(`${path}/personal`, {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return res.data;
  },
  updateAddress: async (token, address, latitude, longitude) => {
    const res = await serverApi.patch(`${path}/address`, {
      address: address,
      latitude: latitude,
      longitude: longitude,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
    }});
    return res.data;
  },
  updateAvatar: async (formData) => {
    const res = await serverApi.patch(`${path}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
    }});
    return res.data;
  },
  updateBio: async (bio) => {
    const res = await serverApi.patch(`${path}/bio`, bio, {
      headers: {
        Authorization: `Bearer ${token}`
    }});
    return res.data;
  },
  updateFullName: async (fullName) => {
    const res = await serverApi.patch(`${path}/fullname`, fullName, {
      headers: {
        Authorization: `Bearer ${token}`
    }});
    return res.data;
  },
  updateGender: async (gender) => {
    const res = await serverApi.patch(`${path}/gender`, gender, {
      headers: {
        Authorization: `Bearer ${token}`
    }});
    return res.data;
  },
  updatePhoneNum: async (phone) => {
    const res = await serverApi.patch(`${path}/phone`, phone, {
      headers: {
        Authorization: `Bearer ${token}`
    }});
    return res.data;
  }
}


