import { publicApi } from "../configs/AxiosConfig";

const GameService = {
  getGameReward: async (token = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const url = "/games/gamerewards";
      console.log("Fetching game reward - URL:", url, "Config:", config);
      const response = await publicApi.get(url, config);
      console.log("Game reward response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Get game reward failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },

  getLeaderBoards: async (token = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const url = "/games/leaderboards";
      console.log("Fetching leaderboards - URL:", url, "Config:", config);
      const response = await publicApi.get(url, config);
      console.log("Leaderboards response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Get leaderboards failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },

  getUserInfo: async (token = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const url = "/games/mine";
      console.log("Fetching user game info - URL:", url, "Config:", config);
      const response = await publicApi.get(url, config);
      console.log("User game info response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Get user game info failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },

  getSpinRewards: async () => {
    try {
      const url = "/games/spinrewards";
      console.log("Fetching spin rewards - URL:", url);
      const response = await publicApi.get(url);
      console.log("Spin rewards response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Get spin rewards failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },

  playGame: async (model, token = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const url = "/games/play";
      console.log("Playing game - URL:", url, "Model:", model, "Config:", config);
      const response = await publicApi.post(url, model, config);
      console.log("Play game response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Play game failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          model: model,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },

  addSpinReward: async (model, token = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const url = "/games/spin";
      console.log("Adding spin reward - URL:", url, "Model:", model, "Config:", config);
      const response = await publicApi.post(url, model, config);
      console.log("Add spin reward response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Add spin reward failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          model: model,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },

  updateGameReward: async (model, token = null) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const url = "/games/gamerewards";
      console.log("Updating game reward - URL:", url, "Model:", model, "Config:", config);
      const response = await publicApi.put(url, model, config);
      console.log("Update game reward response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Update game reward failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          model: model,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },

  getLeaderBoard: async () => {
    try {
      const url = "/games/leaderboard";
      console.log("Fetching leaderboard - URL:", url);
      const response = await publicApi.get(url);
      console.log("Leaderboard response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Get leaderboard failed:",
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          headers: error.config?.headers,
        }
      );
      throw error;
    }
  },
};

export default GameService;