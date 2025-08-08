import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faComment,
  faTimes,
  faUser,
  faRobot,
  faTrash,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import ChatService from "../services/ChatService";

// Mock ProductService
const ProductService = {
  getProducts: async (names) => {
    const productMap = {
      "Bánh Kem Vani Dâu Tây": {
        name: "Bánh Kem Vani Dâu Tây",
        imageUrl: "https://via.placeholder.com/50x50.png?text=Bánh+Dâu",
      },
    };
    if (!names || !Array.isArray(names)) return [];
    return names.map((name) => productMap[name] || { name, imageUrl: "https://via.placeholder.com/50x50.png?text=Unknown" });
  },
};

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const loadConversations = async () => {
      try {
        setError(null);
        if (token) {
          const conversations = await ChatService.getUserConversations(token);
          if (isMounted && conversations?.length > 0) {
            const firstConversationId = conversations[0];
            setConversationId(firstConversationId);
          } else if (isMounted) {
            const res = await ChatService.sendMessage("start", token);
            if (isMounted && res?.data?.conversationId) {
              setConversationId(res.data.conversationId);
              setMessages([{ sender: "bot", text: "Chào bạn! Bạn cần giúp gì không? 🎂" }]);
            } else {
              setMessages([{ sender: "bot", text: "Chưa có cuộc trò chuyện nào. Hãy bắt đầu nhé! 🎂" }]);
            }
          }
        } else if (isMounted) {
          setMessages([{ sender: "bot", text: "Chào bạn! Bạn cần giúp gì không? 🎂" }]);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load conversations:", err.response?.data || err.message);
          setError("Không thể tải danh sách cuộc trò chuyện. Vui lòng thử lại.");
        }
      }
    };

    loadConversations();
    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      if (conversationId && token) {
        try {
          setError(null);
          const messagesData = await ChatService.getMessages(token, conversationId);
          if (isMounted) {
            setMessages(messagesData?.data || []);
          }
        } catch (err) {
          if (isMounted) {
            console.error("Failed to load messages:", err.response?.data || err.message);
            setError("Không thể tải tin nhắn. Vui lòng thử lại.");
          }
        }
      }
    };

    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [conversationId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const res = await ChatService.sendMessage(input, token, conversationId);

      const productDetails = await ProductService.getProducts(res?.data?.attachedProducts || []);

      if (res?.data?.conversationId) {
        setConversationId(res.data.conversationId);
      }

      const botMsg = {
        sender: "bot",
        text: res?.data?.aiMessage || "Không nhận được phản hồi từ trợ lý.",
        products: productDetails,
        supportMessages: res?.meta?.supportMessages || [],
      };

      setMessages((prev) => [...prev, botMsg]);

      // Load lại toàn bộ tin nhắn để đồng bộ
      if (res?.data?.conversationId && token) {
        const updatedMessagesData = await ChatService.getMessages(token, res.data.conversationId);
        setMessages(updatedMessagesData?.data || [botMsg]);
      }
    } catch (err) {
      console.error("Send message error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.errors?.message?.[0] || "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.";
      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage }]);
      setError(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    try {
      setError(null);
      if (token && conversationId) {
        await ChatService.deleteConversation(token, conversationId);
        setConversationId(null);
        setMessages([{ sender: "bot", text: "Lịch sử trò chuyện đã được xóa. Bạn cần giúp gì tiếp theo? 🎂" }]);
      } else {
        setError("Vui lòng đăng nhập và chọn cuộc trò chuyện để xóa lịch sử.");
      }
    } catch (err) {
      console.error("Clear chat error:", err.response?.data || err.message);
      setError("Không thể xóa lịch sử trò chuyện. Vui lòng thử lại.");
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setIsVisible(true), 50);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleProductClick = (name) => {
    window.location.href = `/products/${encodeURIComponent(name)}`;
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-gradient-to-tr from-[#f3b57c] to-[#e2a76f] hover:opacity-90 text-white p-4 rounded-full shadow-lg transition-all z-50"
          title="Mở chat"
        >
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-[380px] h-[560px] bg-white rounded-3xl shadow-2xl border border-[#f4e0c9] flex flex-col transition-all duration-300 ease-in-out z-50 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="bg-gradient-to-r from-[#f3b57c] to-[#e2a76f] text-white text-center py-4 font-semibold text-lg relative rounded-t-3xl">
            <FontAwesomeIcon icon={faRobot} className="mr-2" /> Chat Hỏi Đáp Bánh Ngọt
            <div className="absolute flex gap-2 top-3 right-4">
              <button
                onClick={handleClearChat}
                className="text-xl text-white hover:opacity-80"
                title="Xóa cuộc trò chuyện hiện tại"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={handleClose} className="text-xl text-white hover:opacity-80" title="Đóng chat">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          <div className="flex-1 px-4 py-3 overflow-y-auto bg-[#fffaf5] space-y-4 text-sm custom-scrollbar">
            {error && <div className="text-xs text-center text-red-500">{error}</div>}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "bot" && (
                  <div className="w-9 h-9 mr-3 bg-[#f3b57c] text-white rounded-full flex items-center justify-center text-sm shadow-md">
                    <FontAwesomeIcon icon={faRobot} />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[75%] shadow-md whitespace-pre-line ${
                    msg.sender === "user" ? "bg-[#fdebd8] text-right" : "bg-white text-left"
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.products?.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      Sản phẩm liên quan:{" "}
                      {msg.products.map((p) => (
                        <span
                          key={p.name}
                          className="inline-block mx-1 text-blue-500 cursor-pointer hover:underline"
                          onClick={() => handleProductClick(p.name)}
                        >
                          {p.imageUrl && (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="inline-block w-6 h-6 mr-1 rounded-full"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/50x50.png?text=Error")}
                            />
                          )}
                          {p.name}
                        </span>
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
            {isTyping && (
              <div className="flex items-center pl-10 text-xs text-gray-400">
                <span className="animate-pulse">Trợ lý đang nhập...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[#f3d6b4] bg-[#fffaf5]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
                placeholder="Bạn muốn hỏi gì?"
                className="flex-1 px-4 py-2 text-sm rounded-full border border-[#e2a76f] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#e2a76f]"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className={`bg-gradient-to-tr from-[#f3b57c] to-[#e2a76f] text-white px-4 py-2 rounded-full shadow-md transition-all ${
                  isTyping ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #e2a76f;
              border-radius: 10px;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
