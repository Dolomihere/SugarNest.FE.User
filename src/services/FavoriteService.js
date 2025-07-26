import axios from "../core/services/AxiosInstance.ts";

const FavoriteService = {
  getFavorites: () => axios.get("/favorites"),
  addFavorites: (productIds) =>
    axios.post("/favorites", { productIds }),
  removeFavorites: (productIds) => 
  axios.put("/favorites", { productIds }),
};

export default FavoriteService;
