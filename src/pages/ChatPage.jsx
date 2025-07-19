import React, { useState, useEffect, useRef } from "react";
import {
  faPaperPlane,
  faCommentDots,
  faXmark,
  faUser,
  faCakeCandles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// FAQ data với emoji
const faqList = [
  {
    keywords: ["bánh", "ngọt", "loại"],
    answer: "Tiệm có bánh bông lan, tiramisu, cheesecake, mousse và bánh kem sinh nhật.",
    emoji: "🍰",
  },
  {
    keywords: ["giá", "bao nhiêu", "bánh"],
    answer: "Giá bánh dao động từ 25.000đ đến 150.000đ tùy loại.",
    emoji: "💸",
  },
  {
    keywords: ["giảm giá", "khuyến mãi"],
    answer: "Hiện đang có giảm 10% cho đơn hàng từ 200.000đ.",
    emoji: "🎉",
  },
  {
    keywords: ["giao hàng", "ship"],
    answer: "Có giao hàng nội thành. Phí từ 15.000đ.",
    emoji: "🚚",
  },
  {
    keywords: ["giờ", "mở cửa"],
    answer: "Tiệm mở cửa từ 8:00 đến 21:00 mỗi ngày.",
    emoji: "⏰",
  },
];

// Trả về { answer, emoji }
const getBotReply = (message) => {
  const lower = message.toLowerCase();
  for (const item of faqList) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { answer: item.answer, emoji: item.emoji || "" };
    }
  }
  return { answer: "Câu hỏi của bạn sẽ được nhân viên hỗ trợ sớm nhất!", emoji: "🎧" };
};

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Chào bạn! Mình có thể giúp gì hôm nay? 🎂" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [sendRipple, setSendRipple] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const [userClosed, setUserClosed] = useState(false);

  const sendMessage = (customInput) => {
    const msg = customInput || input;
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSendRipple(true);

    const reply = getBotReply(msg);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setConnecting(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `${reply.answer} ${reply.emoji}` },
      ]);
      audioRef.current?.play();
    }, reply.emoji === "🎧" ? 1500 : 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (sendRipple) {
      const timer = setTimeout(() => setSendRipple(false), 300);
      return () => clearTimeout(timer);
    }
  }, [sendRipple]);

  useEffect(() => {
  const handleScroll = () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrollPercent > 0.7 && !open && !userClosed) handleOpen();
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [open, userClosed]);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => setVisible(true), 50);
  };

 const handleClose = () => {
  setVisible(false);
  setTimeout(() => {
    setOpen(false);
    setUserClosed(true); // Mark as user closed manually
  }, 300);
};


  return (
    <>
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/download/mixkit-bell-notification-933.wav" preload="auto" />

      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-5 right-5 bg-[#d4a373] hover:bg-[#c28c5d] text-white p-3 rounded-full shadow-lg transition-all outline-none border-none focus:outline-none"
        >
          <FontAwesomeIcon icon={faCommentDots} size="lg" />
        </button>
      )}

      {open && (
        <div
          className={`fixed bottom-5 right-5 w-[360px] h-[540px] rounded-2xl overflow-hidden font-sans shadow-xl border border-[#eac9aa] bg-[#fffaf5] 
            flex flex-col transition-all duration-300 transform
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Header */}
          <div className="bg-[#d4a373] text-white text-center py-3 font-semibold text-lg relative shadow-md rounded-t-2xl">
            <FontAwesomeIcon icon={faCakeCandles} className="mr-2" />
            Trợ Lý Bánh Ngọt
            <button
              onClick={handleClose}
              className="absolute top-2 right-3 text-white hover:opacity-80 text-xl focus:outline-none"
              title="Đóng"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Chat content */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#fffaf7] text-sm scroll-smooth">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 mr-2 flex-shrink-0 bg-[#f2d5b8] text-white rounded-full flex items-center justify-center text-xs">
                    <FontAwesomeIcon icon={faCakeCandles} />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-md transition transform duration-200
                    ${msg.sender === "user" ? "bg-[#f2d5b8] text-gray-800" : "bg-[#fcefe6] text-gray-700"}`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 ml-2 flex-shrink-0 bg-[#d4a373] text-white rounded-full flex items-center justify-center text-xs">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 text-xs text-gray-400 pl-10">
                {connecting ? (
                  <>
                    <span>Đang kết nối với nhân viên</span>
                    <span className="loading-dots ml-1" />
                  </>
                ) : (
                  <span>Trợ lý đang nhập...</span>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input + Gợi ý */}
          <div className="flex flex-col gap-2 p-3 border-t border-[#eac9aa] bg-[#fffaf7]">
            <div className="relative flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Bạn muốn hỏi gì?"
                className="flex-1 px-4 py-2 text-sm rounded-full border border-[#deb887] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              />
              <button
                onClick={() => sendMessage()}
                className={`bg-[#d4a373] hover:bg-[#c28c5d] text-white px-4 py-2 rounded-full transition-all duration-300 overflow-hidden relative ${
                  sendRipple ? "animate-ping-once" : ""
                }`}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {faqList.slice(0, 4).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(item.keywords.join(" "))}
                  className="bg-[#fcefe6] hover:bg-[#f2d5b8] text-gray-700 px-3 py-1 rounded-full border border-[#eac9aa] transition"
                >
                  {item.keywords.join(" + ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom styles */}
      <style>{`
        .animate-ping-once::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid rgba(255,255,255,0.6);
          animation: ripple 0.4s ease-out forwards;
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2); opacity: 0; }
        }

        .loading-dots::after {
          content: '...';
          animation: dots 1.4s steps(4, end) infinite;
        }

        @keyframes dots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
          100% { content: ''; }
        }
      `}</style>
    </>
  );
}
