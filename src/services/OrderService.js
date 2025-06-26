import httpClient from '../configs/AxiosConfig'

const endpoint = '/orders'

const OrderService = {
  getAllOrderById: (orderId) => httpClient.get(`${endpoint}/${orderId}`),
  createOrder: (cartId, cart) => httpClient.post(`${endpoint}/bycart/${cartId}`, cart),
  createOrderItem: (orderId, cartItem) => httpClient.post(`${endpoint}/${orderId}`, cartItem),
};

export default OrderService;
