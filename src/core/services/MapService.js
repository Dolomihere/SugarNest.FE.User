export const mapService = {
  getAddressInfo: async (lat, lng) => {
    const apiKey = "df581d3dc5a5449c91907c4b3a5ab51c"; // 🔑 Thay bằng key thật
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=vi`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.results?.[0]?.formatted || null;
    } catch (error) {
      console.error("Lỗi khi reverse geocode:", error);
      return null;
    }
  }
};
