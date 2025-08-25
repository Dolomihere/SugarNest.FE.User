import { useEffect, useState } from "react";
import useFetchList from "../core/hooks/useFetchList";
import useFetchList2 from "../core/hooks/useFetchList2";
import GameService from "../services/GameService";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faStar,
  faGift,
  faTrophy,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { useApiAction } from "../core/hooks/useApiAction";

const UnityGame = () => {
  const [reloadTrigger, setReloadTrigger] = useState(true);
  const [reloadUser, setReloadUser] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const { trigger } = useApiAction();
  const [isDataAlready, setIsDataAlready] = useState(false);

  // Rewards
  const { response: rewardsResponse } = useFetchList2(
    "/games/spinrewards",
    {},
    {},
    true
  );

  // User state
  const { response: userResponse } = useFetchList(
    "/games/mine",
    {},
    {},
    reloadUser
  );

  // Init rewards to Unity
  useEffect(() => {
    if(isDataAlready) return;
    if (rewardsResponse?.data) {
      console.log(rewardsResponse?.data)      
      const unityFrame = document.querySelector("iframe");
      if (unityFrame) {
        setTimeout(() => {
          unityFrame.contentWindow?.postMessage(
            { type: "initWheelReward", payload: rewardsResponse.data },
            "*"
          );
        }, 3000);
      }
      setIsDataAlready(true);
    }
  }, [rewardsResponse]);

  // Init user game state to Unity
  useEffect(() => {
    if (userResponse?.data) {
      const unityFrame = document.querySelector("iframe");
      if (unityFrame) {
        setTimeout(() => {
          unityFrame.contentWindow?.postMessage(
            {
              type: "initGameState",
              payload: {
                UserId: userResponse.data.userId,
                UserName: userResponse.data.username,
                TicketNumber: userResponse.data.ticketNumber.toString(),
                Score: userResponse.data.score.toString(),
              },
            },
            "*"
          );
        }, 3000);
      }
    }
  }, [userResponse]);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await GameService.getCurrentLeaderBoard(token);

        const entries = res?.data?.entries || [];
        setLeaderboard(entries);

        const unityFrame = document.querySelector("iframe");
        if (unityFrame) {
          setTimeout(() => {
            unityFrame.contentWindow?.postMessage(
              { type: "initLeaderboard", payload: entries },
              "*"
            );
          }, 3000);
        }
      } catch (err) {
        console.error("❌ Get leaderboard failed:", err);
        setLeaderboard([]);
      }
    };

    fetchLeaderboard();
  }, [reloadUser]);

  // Unity messages
  useEffect(() => {
    const handleUnityMessage = (event) => {
      try {
        let raw = event.data;
        if (typeof raw === "string") {
          const jsonEnd = raw.indexOf("}") + 1;
          const cleanJson = raw.slice(0, jsonEnd);
          const data = JSON.parse(cleanJson);

          if (data?.type === "randomresult") handleGift(data);
          if (data?.type === "minegameresult") handlePlay(data);
        }
      } catch (err) {
        console.error("❌ Lỗi parse JSON từ Unity:", err);
      }
    };

    window.addEventListener("message", handleUnityMessage);
    return () => window.removeEventListener("message", handleUnityMessage);
  }, []);

  // Handle play result
  const handlePlay = async (data) => {
    const payload = { score: Number(data.Score) };
    const result = await trigger("/games/play", "POST", payload, {}, false);

    if (result?.isSuccess) {
      setReloadUser((prev) => !prev);
    } else {
      setReloadUser((prev) => !prev);
    }
  };

  // Handle spin gift result
  const handleGift = async (data) => {
    const payload = { rewardId: Number(data.Reward) };
    const result = await trigger("/games/spin", "POST", payload, {}, false);

    if (result?.isSuccess) {
      setReloadUser((prev) => !prev);
      alert(`Gửi thưởng thành công! Hãy vào tài khoản của bạn để kiểm tra!`);
    } else {
      setReloadUser((prev) => !prev);
    }
  };

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-gradient-to-br from-amber-50 via-white to-amber-50 text-gray-800">
      <Header />
      <main className="container flex-1 px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mb-12 text-center">
          <h2 className="flex items-center justify-center gap-4 mb-4 text-3xl font-extrabold text-amber-700 sm:text-4xl">
            <FontAwesomeIcon icon={faGamepad} className="text-amber-600" />
            Trò Chơi Giải Trí
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg">
            Thư giãn và thử thách bản thân với trò chơi thú vị của{" "}
            <span className="font-semibold text-amber-700">SugarNest</span>.
            Gửi điểm số để nhận quà hấp dẫn!
          </p>
        </div>

        {/* Features */}
        <section className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
          <div className="relative overflow-hidden shadow-xl rounded-2xl ring-2 ring-amber-400/50 ring-offset-2 ring-offset-amber-50 hover:ring-amber-500/70">
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
                desc: "Xây dựng với Unity WebGL, tối ưu hóa cho mọi thiết bị.",
              },
              {
                icon: faTrophy,
                color: "text-indigo-500",
                title: "Ghi điểm cao",
                desc: "Lưu điểm số và cạnh tranh cùng bạn bè.",
              },
              {
                icon: faGift,
                color: "text-pink-500",
                title: "Phần thưởng hấp dẫn",
                desc: "Đổi điểm lấy quà tặng từ SugarNest.",
              },
              {
                icon: faGamepad,
                color: "text-green-500",
                title: "Trò chơi đa dạng",
                desc: "Nhiều thể loại game thú vị đang chờ bạn khám phá.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 bg-white border-2 border-transparent shadow-md rounded-xl hover:shadow-xl hover:border-amber-500/70"
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`mb-3 text-3xl ${item.color}`}
                />
                <h4 className="mb-1 text-lg font-bold">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Unity Game Frame */}
        <div className="relative overflow-hidden shadow-2xl rounded-2xl ring-4 ring-amber-300/60 ring-offset-2 ring-offset-white hover:ring-amber-400/80">
          <iframe
            src="/UnityGame/SugarNest/index.html"
            title="Unity WebGL Game"
            className="w-full h-[600px] sm:h-[700px] lg:h-[800px] rounded-b-xl"
            allowFullScreen
          ></iframe>
        </div>

        {/* Extra Info */}
        <section className="mt-16">
          <h3 className="mb-6 text-2xl font-bold text-center text-amber-700">
            Khám phá thêm về trò chơi
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Cách chơi đơn giản",
                desc: "Phù hợp mọi lứa tuổi, dễ điều khiển và gây nghiện.",
                image: "/images/Game1.png",
              },
              {
                title: "Thử thách hấp dẫn",
                desc: "Mỗi cấp độ mở ra thế giới mới, độ khó tăng dần.",
                image: "/images/Game2.png",
              },
              {
                title: "Tích điểm đổi quà",
                desc: "Điểm số đổi lấy phần thưởng độc quyền từ SugarNest.",
                image: "/images/Game3.png",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="overflow-hidden bg-white border-2 border-transparent shadow-md rounded-xl hover:shadow-xl hover:border-amber-600/70"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="object-cover w-full h-48 transition-transform duration-300 transform hover:scale-110"
                />
                <div className="p-5">
                  <h4 className="mb-2 text-lg font-semibold">{c.title}</h4>
                  <p className="text-sm text-gray-600">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section className="mt-16">
          <h3 className="mb-6 text-2xl font-bold text-center text-amber-700">
            Bảng Xếp Hạng
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="p-5 bg-white border-2 border-transparent shadow-md rounded-xl hover:shadow-xl hover:border-amber-500/70">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon
                  icon={faRankingStar}
                  className="text-2xl text-amber-600"
                />
                <h4 className="text-lg font-bold">Top Người Chơi</h4>
              </div>
              <ul className="space-y-2 overflow-y-auto max-h-48">
                {leaderboard.length > 0 ? (
                  leaderboard.map((player) => (
                    <li
                      key={player.userId}
                      className="flex justify-between py-1 text-sm text-gray-600"
                    >
                      <span>
                        {player.rank}. {player.username}
                      </span>
                      <span className="font-semibold">
                        {player.score} điểm
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-600">
                    Không có dữ liệu bảng xếp hạng
                  </li>
                )}
              </ul>
            </div>
            <div className="overflow-hidden shadow-xl rounded-2xl ring-2 ring-amber-400/50 hover:ring-amber-500/70">
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