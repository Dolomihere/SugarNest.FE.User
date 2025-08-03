// ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faComment,
  faTimes,
  faUser,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import ChatService from "../services/ChatService";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await ChatService.sendMessage({ message: input });
      const botMsg = {
        sender: "bot",
        text: res?.answer || "Xin lỗi, có lỗi xảy ra.",
        image: res?.image || null,
        products: res?.products || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Đã xảy ra lỗi khi gửi tin nhắn." },
      ]);
    }
    setTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => setVisible(true), 50);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  };

  return (
    <>
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-gradient-to-tr from-[#f3b57c] to-[#e2a76f] hover:opacity-90 text-white p-4 rounded-full shadow-lg transition-all z-50"
        >
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
      )}

      {open && (
        <div
          className={`fixed bottom-6 right-6 w-[380px] h-[560px] bg-white rounded-3xl shadow-2xl border border-[#f4e0c9] flex flex-col transition-all duration-300 ease-in-out z-50 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#f3b57c] to-[#e2a76f] text-white text-center py-4 font-semibold text-lg relative rounded-t-3xl">
            <FontAwesomeIcon icon={faRobot} className="mr-2" /> Chat Hỏi Đáp Bánh Ngọt
            <button
              onClick={handleClose}
              className="absolute text-xl text-white top-3 right-4 hover:opacity-80"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 overflow-y-auto bg-[#fffaf5] space-y-4 text-sm custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-9 h-9 mr-3 bg-[#f3b57c] text-white rounded-full flex items-center justify-center text-sm shadow-md">
                    <FontAwesomeIcon icon={faRobot} />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[75%] shadow-md whitespace-pre-line ${msg.sender === "user" ? "bg-[#fdebd8] text-right" : "bg-white text-left"}`}
                >
                  <div>{msg.text}</div>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="AI image"
                      className="mt-2 rounded-xl w-full object-cover border border-[#f3d6b4]"
                    />
                  )}

                  {msg.products?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {msg.products.map((p, i) => (
                        <div
                          key={i}
                          className="border rounded-lg p-2 bg-[#fffefb] shadow-sm"
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="object-cover w-full h-20 rounded-md"
                          />
                          <div className="mt-1 text-xs font-medium text-gray-700 line-clamp-2">
                            {p.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-9 h-9 ml-3 bg-[#e2a76f] text-white rounded-full flex items-center justify-center text-sm shadow-md">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
              </div>
            ))}

            {typing && <div className="pl-10 text-xs text-gray-400">Trợ lý đang nhập...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#f3d6b4] bg-[#fffaf5]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Bạn muốn hỏi gì?"
                className="flex-1 px-4 py-2 text-sm rounded-full border border-[#e2a76f] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#e2a76f]"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-tr from-[#f3b57c] to-[#e2a76f] hover:opacity-90 text-white px-4 py-2 rounded-full shadow-md transition-all"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2a76f;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
