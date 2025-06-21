import httpClient from '../configs/AxiosConfig'

const endpoint = '/vouchers'

const VoucherService = {
  getAllVouchers: () => httpClient.get(endpoint),
  getVoucherById: (voucherId) => httpClient.get(`${endpoint}/${voucherId}`),
};

export default VoucherService;
