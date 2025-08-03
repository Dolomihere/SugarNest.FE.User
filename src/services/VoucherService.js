import { publicApi } from "../configs/AxiosConfig";

const endpoint = "/vouchers";

const VoucherService = {
  getUserVouchers: async (token) => {
    try {
      let allVouchers = [];
      let page = 0;
      let totalPages = 1;
      const pageSize = 100; // Adjust based on API limits

      while (page < totalPages) {
        const response = await publicApi.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page, // Shorthand for page: page
            size: pageSize,
          },
        });

        console.log(`API response (page ${page}):`, response.data); // Log raw response

        // Adjust based on your API's structure
        const { data, totalPages: fetchedTotalPages, total_pages } = response.data;
        const vouchers = data || response.data.results || response.data.vouchers || []; // Handle common field names
        totalPages = fetchedTotalPages || total_pages || 1; // Handle common pagination fields

        console.log(`Extracted vouchers (page ${page}):`, vouchers);

        allVouchers = [...allVouchers, ...vouchers];
        page += 1;
      }

      console.log("All user vouchers:", allVouchers);
      return { data: { data: allVouchers } }; // Match expected structure
    } catch (error) {
      console.error("Get user vouchers error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      return { data: { data: [] } }; // Fallback to empty array
    }
  },

  // Other methods (getAllVouchers, getVoucherById) remain unchanged
  getAllVouchers: async () => {
    try {
      let allVouchers = [];
      let page = 0;
      let totalPages = 1;
      const pageSize = 100;

      while (page < totalPages) {
        const response = await publicApi.get(endpoint, {
          params: {
            page,
            size: pageSize,
          },
        });

        console.log(`API response (page ${page}):`, response.data);

        const { data, totalPages: fetchedTotalPages, total_pages } = response.data;
        const vouchers = data || response.data.results || response.data.vouchers || [];
        totalPages = fetchedTotalPages || total_pages || 1;

        allVouchers = [...allVouchers, ...vouchers];
        page += 1;
      }

      console.log("All vouchers:", allVouchers);
      return { data: { data: allVouchers } };
    } catch (error) {
      console.error("Get vouchers error:", error.response?.data || error.message);
      throw error;
    }
  },

  getVoucherById: async (id, token) => {
    try {
      console.log(`Sending request to ${endpoint}/${id}`);
      const response = await publicApi.get(`${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Get voucher by id response:", response.data);
      return response;
    } catch (error) {
      console.error("Get voucher by id error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default VoucherService;