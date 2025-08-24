import { useEffect, useState } from "react";
import useFetchList from "../core/hooks/useFetchList"; // Assuming the hook is available or adjust path
import GameService from "../services/GameService"; // Still need for other services, but user info via hook
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faStar,
  faGift,
  faTrophy,
  faRankingStar,
  faUser,
  faCoins,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";

const UnityGame = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [score, setScore] = useState(0);
  const [ticketNumber, setTicketNumber] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadUser, setReloadUser] = useState(true);

  const { response: userResponse } = useFetchList(
    "/games/mine",
    {},
    {},
    reloadUser
  );

  // Fetch spin rewards and leaderboard on mount or reload
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const promises = [GameService.getSpinRewards(), GameService.getLeaderBoard()];
        if (!token) {
          setUserId(null);
          setUserName("");
          setScore(0);
          setTicketNumber(0);
        }
        const data = await Promise.all(promises);
        // Send spin rewards to Unity
        const unityFrame = document.querySelector("iframe");
        if (unityFrame) {
          setTimeout(() => {
            unityFrame.contentWindow?.postMessage(
              {
                type: "initWheelReward",
                payload: data[0], // Spin rewards
              },
              "*"
            );
          }, 3000);
        }
        setLeaderboard(data[1] || []);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setError("Please login to access your game data.");
          setUserId(null);
          setUserName("");
          setScore(0);
          setTicketNumber(0);
        } else {
          setError("Failed to load game data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadUser]);

  // Set user data from userResponse
  useEffect(() => {
    if (userResponse && userResponse.data) {
      setUserId(userResponse.data.userId || null);
      setUserName(userResponse.data.username || "");
      setScore(userResponse.data.score || 0);
      setTicketNumber(userResponse.data.ticketNumber || 0);
    }
  }, [userResponse]);

  // Send user data to Unity iframe
  useEffect(() => {
    const sendDataToUnity = () => {
      const unityFrame = document.querySelector("iframe");
      if (unityFrame && userId) {
        setTimeout(() => {
          unityFrame.contentWindow?.postMessage(
            {
              type: "initGameState",
              payload: {
                UserId: userId,
                UserName: userName,
                TicketNumber: ticketNumber.toString(),
                Score: score.toString(),
              },
            },
            "*"
          );
        }, 3000);
      }
    };
    sendDataToUnity();
  }, [userId, userName, score, ticketNumber]);

  // Handle messages from Unity (e.g., minegameresult for play, randomresult for spin)
  useEffect(() => {
    const handleMessage = async (event) => {
      let raw = event.data;
      try {
        if (typeof raw === "string") {
          const jsonEnd = raw.indexOf("}") + 1;
          const cleanJson = raw.slice(0, jsonEnd);
          const data = JSON.parse(cleanJson);
          const token = localStorage.getItem("token");
          if (!token) {
            alert("Please login to submit.");
            return;
          }

          if (data?.type === "minegameresult") {
            // Handle play (submit score)
            const payload = {
              score: Number(data.Score),
            };
            try {
              const result = await GameService.playGame(payload, token);
              if (result?.isSuccess) {
                alert("Score submitted successfully!");
                setReloadUser(!reloadUser); // Reload data
              } else {
                alert(result?.message || "Failed to submit score.");
                setReloadUser(!reloadUser);
              }
            } catch (err) {
              console.error("Failed to submit score:", err);
              alert("Failed to submit score. Please try again.");
              if (err.response && err.response.status === 401) {
                setError("Session expired. Please login again.");
              }
            }
          }

          if (data?.type === "randomresult") {
            // Handle spin reward
            const payload = {
              rewardId: Number(data.Reward),
            };
            try {
              const result = await GameService.addSpinReward(payload, token);
              if (result?.isSuccess) {
                alert("Reward claimed successfully!");
                setReloadUser(!reloadUser); // Reload data
              } else {
                alert(result?.message || "Failed to claim reward.");
                setReloadUser(!reloadUser);
              }
            } catch (err) {
              console.error("Failed to claim reward:", err);
              alert("Failed to claim reward. Please try again.");
              if (err.response && err.response.status === 401) {
                setError("Session expired. Please login again.");
              }
            }
          }
        }
      } catch (err) {
        console.error("❌ Không thể parse JSON từ Unity:", err);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [reloadUser]);

  const isLoggedIn = !!userId; // Check if user is logged in based on userId

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-gradient-to-br from-amber-50 via-white to-amber-50 text-gray-800">
      <Header />
      <main className="container flex-1 px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="flex items-center justify-center gap-4 mb-4 text-3xl font-extrabold text-amber-700 sm:text-4xl">
            <FontAwesomeIcon icon={faGamepad} className="text-amber-600" />
            Trò Chơi Giải Trí
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg">
            Thư giãn và thử thách bản thân với trò chơi thú vị của{" "}
            <span className="font-semibold text-amber-700">SugarNest</span>. Gửi
            điểm số của bạn để nhận quà hấp dẫn!
          </p>
        </div>

        {/* Display User Info */}
        {loading ? (
          <div className="py-4 text-center animate-pulse">
            <p className="text-lg text-gray-600">Đang tải thông tin người dùng...</p>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-red-600">
            {error}
          </div>
        ) : isLoggedIn ? (
          <section className="mb-12">
            <h3 className="mb-4 text-xl font-bold text-center text-amber-700">
              Thông Tin Người Chơi
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="p-4 text-center bg-white rounded-lg shadow-md">
                <FontAwesomeIcon icon={faUser} className="mb-2 text-2xl text-blue-500" />
                <p className="text-sm text-gray-600">ID Người dùng</p>
                <p className="font-semibold">{userId || "N/A"}</p>
              </div>
              <div className="p-4 text-center bg-white rounded-lg shadow-md">
                <FontAwesomeIcon icon={faUser} className="mb-2 text-2xl text-blue-500" />
                <p className="text-sm text-gray-600">Tên tài khoản</p>
                <p className="font-semibold">{userName || "N/A"}</p>
              </div>
              <div className="p-4 text-center bg-white rounded-lg shadow-md">
                <FontAwesomeIcon icon={faCoins} className="mb-2 text-2xl text-yellow-500" />
                <p className="text-sm text-gray-600">Điểm số</p>
                <p className="font-semibold">{score || 0}</p>
              </div>
              <div className="p-4 text-center bg-white rounded-lg shadow-md">
                <FontAwesomeIcon icon={faTicketAlt} className="mb-2 text-2xl text-green-500" />
                <p className="text-sm text-gray-600">Vé quay</p>
                <p className="font-semibold">{ticketNumber || 0}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-12">
            <h3 className="mb-4 text-xl font-bold text-center text-amber-700">
              Thông Tin Người Chơi
            </h3>
            <div className="py-4 text-center text-gray-600">
              Vui lòng đăng nhập để xem thông tin cá nhân của bạn.
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
          <div className="relative overflow-hidden transition-all duration-300 shadow-xl rounded-2xl ring-2 ring-amber-400/50 ring-offset-2 ring-offset-amber-50 hover:ring-amber-500/70">
            <img
              src="/images/Game.png"
              alt="Game illustration"
              className="object-cover w-full h-80"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                icon: faStar,
                color: "text-yellow-500",
                title: "Giao diện mượt mà",
                desc: "Trò chơi được xây dựng với Unity WebGL, tối ưu hóa cho mọi thiết bị.",
              },
              {
                icon: faTrophy,
                color: "text-indigo-500",
                title: "Ghi điểm cao",
                desc: "Ghi lại điểm số của bạn và cạnh tranh cùng bạn bè.",
              },
              {
                icon: faGift,
                color: "text-pink-500",
                title: "Phần thưởng hấp dẫn",
                desc: "Đổi điểm lấy quà tặng từ SugarNest mỗi tuần.",
              },
              {
                icon: faGamepad,
                color: "text-green-500",
                title: "Trò chơi đa dạng",
                desc: "Nhiều thể loại game thú vị đang chờ bạn khám phá.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 transition-all duration-300 bg-white border-2 border-transparent shadow-md rounded-xl bg-clip-padding border-gradient-to-r from-amber-200 to-amber-400/50 hover:shadow-xl hover:border-amber-500/70"
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`mb-3 text-3xl ${item.color}`}
                />
                <h4 className="mb-1 text-lg font-bold text-gray-800">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="relative overflow-hidden transition-all duration-500 shadow-2xl rounded-2xl ring-4 ring-amber-300/60 ring-offset-2 ring-offset-white hover:ring-amber-400/80">
          {loading ? (
            <div className="py-12 text-center animate-pulse">
              <p className="text-lg text-gray-600">Đang tải trò chơi...</p>
            </div>
          ) : (
            <iframe
              src="/UnityGame/BuildWebGL/index.html"
              title="Unity WebGL Game"
              className="w-full h-[600px] sm:h-[700px] lg:h-[800px] rounded-b-xl"
              allowFullScreen
            ></iframe>
          )}
        </div>

        <section className="mt-16">
          <h3 className="mb-6 text-2xl font-bold text-center text-amber-700">
            Khám phá thêm về trò chơi
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Cách chơi đơn giản",
                desc: "Trò chơi phù hợp mọi lứa tuổi với cơ chế điều khiển dễ hiểu và lối chơi gây nghiện.",
                image: "/images/Game1.png",
              },
              {
                title: "Thử thách hấp dẫn",
                desc: "Mỗi cấp độ sẽ đưa bạn đến một thế giới mới với độ khó tăng dần.",
                image: "/images/Game2.png",
              },
              {
                title: "Tích điểm đổi quà",
                desc: "Điểm số bạn đạt được có thể đổi lấy các phần thưởng độc quyền từ SugarNest.",
                image: "/images/Game3.png",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="overflow-hidden transition-all duration-300 bg-white border-2 border-transparent shadow-md rounded-xl bg-clip-padding border-gradient-to-r from-amber-300/50 to-amber-500/50 hover:shadow-xl hover:border-amber-600/70"
              >
                <div className="overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="object-cover w-full h-48 transition-transform duration-300 ease-in-out transform hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">
                    {card.title}
                  </h4>
                  <p className="text-sm text-gray-600">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h3 className="mb-6 text-2xl font-bold text-center text-amber-700">
            Bảng Xếp Hạng
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="order-1 p-5 transition-all duration-300 bg-white border-2 border-transparent shadow-md rounded-xl bg-clip-padding border-gradient-to-r from-amber-200 to-amber-400/50 hover:shadow-xl hover:border-amber-500/70">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon
                  icon={faRankingStar}
                  className="text-2xl text-amber-600"
                />
                <h4 className="text-lg font-bold text-gray-800">
                  Top Người Chơi
                </h4>
              </div>
              <ul className="space-y-2 overflow-y-auto max-h-48">
                {leaderboard.length > 0 ? (
                  leaderboard.map((player, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between py-1 text-sm text-gray-600"
                    >
                      <span>
                        {idx + 1}. {player.username || "Player" + (idx + 1)}
                      </span>
                      <span className="font-semibold">{player.score} điểm</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-600">No data available</li>
                )}
              </ul>
            </div>
            <div className="relative order-2 overflow-hidden transition-all duration-300 shadow-xl rounded-2xl ring-2 ring-amber-400/50 ring-offset-2 ring-offset-amber-50 hover:ring-amber-500/70">
              <img
                src="/images/Game5.jpg"
                alt="Leaderboard illustration"
                className="object-cover w-full h-80"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UnityGame;