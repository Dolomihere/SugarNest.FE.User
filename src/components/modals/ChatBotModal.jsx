import { useState, useEffect, useRef } from "react";
import { Modal } from "../ui";
import ChatService from "../../services/ChatService";
import ProductCard from "../Product/ProductCard";

const ToastMessage = ({ type, message, onClose }) => {
  const bgColor = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div
      className={`fixed bottom-6 right-6 px-6 py-4 text-white ${bgColor} rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out max-w-[90%] sm:max-w-lg break-words animate-slide-up`}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 ml-3 text-white transition-colors duration-200 hover:text-gray-100"
        aria-label="Đóng thông báo"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const ChatBotModal = ({ isOpen, onClose, orderId }) => {
  const [message, setMessage] = useState("");
  const [conversationIds, setConversationIds] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [toast, setToast] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const chatContainerRef = useRef(null);
  const latestMessageRef = useRef(null);

  useEffect(() => {
    if (isOpen) loadConversations();
  }, [isOpen]);

  const loadConversations = async () => {
    try {
      const ids = await ChatService.getUserConversations(accessToken);
      setConversationIds(ids);
    } catch (error) {
      console.error("Failed to load conversations:", error.response?.data || error.message);
      setToast({
        type: "error",
        message: error.response?.data?.message || error.response?.data?.title || "Lỗi khi tải danh sách hội thoại. Vui lòng thử lại!",
      });
    }
  };

  useEffect(() => {
    if (conversationIds?.length > 0) {
      setConversationId(conversationIds[0]);
    }
  }, [conversationIds]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await ChatService.getMessages(
          accessToken,
          conversationId,
          999,
          null
        );
        setChatMessages(messages);
      } catch (error) {
        console.error("Failed to fetch messages:", error.response?.data || error.message);
        setToast({
          type: "error",
          message: error.response?.data?.message || error.response?.data?.title || "Lỗi khi tải tin nhắn. Vui lòng thử lại!",
        });
      }
    };
    if (conversationId) fetchMessages();
  }, [conversationId, accessToken]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!accessToken) {
      setToast({
        type: "error",
        message: "Vui lòng đăng nhập để gửi tin nhắn!",
      });
      return;
    }

    const userMessage = {
      cbMessageId: `temp-${Date.now()}`,
      userMessage: message,
      aiMessage: null,
      createdAt: new Date().toISOString(),
      attachedProducts: [],
    };

    setChatMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      setTimeout(() => {
        if (latestMessageRef.current) {
          latestMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 0);
      return updatedMessages;
    });
    setMessage("");
    setIsTyping(true); // Show typing indicator

    // Add typing indicator as a temporary message
    setChatMessages((prev) => {
      const typingMessage = {
        cbMessageId: `typing-${Date.now()}`,
        userMessage: null,
        aiMessage: "Đang trả lời...",
        createdAt: new Date().toISOString(),
        attachedProducts: [],
        isTyping: true,
      };
      const updatedMessages = [...prev, typingMessage];
      setTimeout(() => {
        if (latestMessageRef.current) {
          latestMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 0);
      return updatedMessages;
    });

    try {
      console.log("Sending payload:", message);
      const response = await ChatService.sendMessage(
        message,
        accessToken,
        conversationId
      );

      // Remove typing indicator and add AI message
      setChatMessages((prev) => {
        const filteredMessages = prev.filter((msg) => !msg.isTyping);
        const aiMessage = {
          cbMessageId: response.data.cbMessageId || `ai-${Date.now()}`,
          userMessage: null,
          aiMessage: response.data.aiMessage || "Tôi đã nhận được tin nhắn của bạn!",
          createdAt: response.data.createdAt || new Date().toISOString(),
          attachedProducts: response.data.attachedProducts || [],
        };
        const updatedMessages = [...filteredMessages, aiMessage];
        setTimeout(() => {
          if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }, 0);
        return updatedMessages;
      });
      setIsTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error.response?.data || error.message);
      setIsTyping(false);
      // Remove typing indicator on error
      setChatMessages((prev) => prev.filter((msg) => !msg.isTyping));
      const errorDetails = error.response?.data?.errors?.message?.[0] ||
                           error.response?.data?.message ||
                           error.response?.data?.title ||
                           "Lỗi khi gửi tin nhắn. Vui lòng thử lại!";
      setToast({
        type: "error",
        message: errorDetails,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={false}
        className="max-w-[95%] sm:max-w-sm my-6 shadow-2xl rounded-2xl"
      >
        <div className="max-h-[85vh] h-[650px] flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-gray-700 dark:to-gray-800">
            <h4 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Trò chuyện với AI
            </h4>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 transition-all duration-200 bg-gray-100 rounded-full dark:text-gray-300 dark:bg-gray-700 hover:bg-amber-300 dark:hover:bg-amber-600 hover:text-gray-900 dark:hover:text-white"
              aria-label="Đóng"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 px-6 py-5 space-y-6 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900"
          >
            {chatMessages.map((item, index) => (
              <div
                key={item.cbMessageId}
                className="space-y-4"
                ref={index === chatMessages.length - 1 ? latestMessageRef : null}
              >
                {item.userMessage && (
                  <div className="flex justify-end">
                    <div className="max-w-[75%] bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <p className="text-sm font-medium">{item.userMessage}</p>
                      <span className="block mt-2 text-xs text-amber-100 opacity-90">
                        {new Date(item.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                )}
                {item.aiMessage && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <p className="text-sm font-medium">
                        {item.isTyping ? (
                          <span className="flex items-center">
                            Đang trả lời...
                            <span className="inline-block w-2 h-2 ml-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                            <span className="inline-block w-2 h-2 ml-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            <span className="inline-block w-2 h-2 ml-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                          </span>
                        ) : (
                          item.aiMessage
                        )}
                      </p>
                      {!item.isTyping && (
                        <span className="block mt-2 text-xs text-gray-400 dark:text-gray-500 opacity-90">
                          {new Date(item.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {item.attachedProducts?.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-6">
                    {item.attachedProducts.map((productId) => (
                      <ProductCard key={productId} id={productId} index={index} borderClass="" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 left-0 right-0 flex items-center gap-4 p-5 bg-white border-t border-gray-200 shadow-inner dark:bg-gray-800 dark:border-gray-700">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-grow h-12 p-3 text-gray-800 placeholder-gray-400 transition-all duration-200 bg-gray-100 border border-gray-200 rounded-lg resize-none dark:text-gray-100 dark:placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              rows="1"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="p-3 text-white transition-all duration-200 rounded-lg shadow-md bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg"
              aria-label="Gửi tin nhắn"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </Modal>

      {toast && (
        <ToastMessage
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ChatBotModal;