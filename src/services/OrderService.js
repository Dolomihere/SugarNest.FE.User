import httpClient from '../configs/AxiosConfig'

const endpoint = '/orders'

const OrderService = {
  getAllOrderById: (orderId) => httpClient.get(`${endpoint}/${orderId}`),
  createOrder: (formdata, token) => httpClient.post(`${endpoint}/bycart`, formdata, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  createOrderItem: (orderId, cartItem) => httpClient.post(`${endpoint}/${orderId}`, cartItem),
};

export default OrderService;
