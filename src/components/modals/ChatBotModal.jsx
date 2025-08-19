import { useState, useEffect, useRef } from "react";
import { Modal } from "../ui";
import ChatService from "../../services/ChatService";
import ProductCard from "../Product/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
  const [supportMessages, setSupportMessages] = useState([]);
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
        message: error.response?.data?.message || error.response?.data?.title || "Hiện tại bạn không có hội thoại để hiển thị!",
      });
    }
  };

  useEffect(() => {
    if (conversationIds?.length > 0) {
      setConversationId(conversationIds[0]);
    } else {
      setConversationId(null); // Đảm bảo không có conversationId nếu không có cuộc trò chuyện
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

  const handleSendMessage = async (messageToSend = null) => {
    const msg = messageToSend || message.trim();
    if (!msg) return;

    if (!accessToken) {
      setToast({
        type: "error",
        message: "Vui lòng đăng nhập để gửi tin nhắn!",
      });
      return;
    }

    const userMessage = {
      cbMessageId: `temp-${Date.now()}`,
      userMessage: msg,
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
    if (!messageToSend) setMessage(""); // Chỉ reset nếu không phải từ suggestion
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
      console.log("Sending payload:", msg);
      const fullResponse = await ChatService.sendMessage(
        msg,
        accessToken,
        conversationId
      );

      // Remove typing indicator and add AI message
      setChatMessages((prev) => {
        const filteredMessages = prev.filter((msg) => !msg.isTyping);
        const aiMessage = {
          cbMessageId: fullResponse.data.cbMessageId || `ai-${Date.now()}`,
          userMessage: null,
          aiMessage: fullResponse.data.aiMessage || "Tôi đã nhận được tin nhắn của bạn!",
          createdAt: fullResponse.data.createdAt || new Date().toISOString(),
          attachedProducts: fullResponse.data.attachedProducts || [],
        };
        const updatedMessages = [...filteredMessages, aiMessage];
        setTimeout(() => {
          if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }, 0);
        return updatedMessages;
      });
      setSupportMessages(fullResponse.meta?.supportMessages || []);
      setIsTyping(false);

      // Tạo một conversationId mới nếu chưa có
      if (!conversationId && fullResponse.data.conversationId) {
        setConversationId(fullResponse.data.conversationId);
        setConversationIds((prev) => [fullResponse.data.conversationId, ...(prev || [])]);
      }
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

  const handleDeleteConversation = async () => {
    if (!accessToken) {
      setToast({
        type: "error",
        message: "Vui lòng đăng nhập để xóa cuộc trò chuyện!",
      });
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện này?")) {
      return;
    }

    try {
      if (conversationId) {
        await ChatService.deleteConversation(accessToken, conversationId);
      }
      setToast({
        type: "success",
        message: "Xóa cuộc trò chuyện thành công!",
      });
      setChatMessages([]); // Xóa toàn bộ tin nhắn trên giao diện
      setConversationId(null); // Reset conversationId
      loadConversations(); // Tải lại danh sách conversations
    } catch (error) {
      console.error("Failed to delete conversation:", error.response?.data || error.message);
      setToast({
        type: "error",
        message: error.response?.data?.message || error.response?.data?.title || "Lỗi khi xóa cuộc trò chuyện. Vui lòng thử lại!",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when opening or messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={false}
        className="max-w-[95%] w-[400px] sm:max-w-md md:max-w-[26rem] my-6 shadow-2xl rounded-2xl"
      >
        <div className="max-h-[85vh] h-[650px] flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shadow-sm dark:border-gray-700 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-gray-800 dark:to-gray-700">
            <h4 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Trò chuyện với AI
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteConversation}
                className="p-1.5 text-gray-600 transition-all duration-200 bg-gray-100 rounded-full dark:text-red-300 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-100 hover:scale-105"
                aria-label="Xóa cuộc trò chuyện"
                title="Xóa toàn bộ cuộc trò chuyện"
              >
                <FontAwesomeIcon icon={faTrash} size="sm" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-600 transition-all duration-200 bg-gray-100 rounded-full dark:text-gray-300 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-amber-900 hover:text-amber-700 dark:hover:text-amber-100 hover:scale-105"
                aria-label="Đóng"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 px-4 py-4 space-y-4 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm"
          >
            {chatMessages.length === 0 && !isTyping ? (
              <div className="flex flex-col items-center justify-center h-full space-y-2 text-center text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 21l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-medium">Chưa có tin nhắn. Bắt đầu trò chuyện ngay!</p>
                <p className="text-xs">Mình sẽ giúp bạn giải đáp mọi thắc mắc về sản phẩm hoặc bất kỳ câu hỏi nào khác.</p>
              </div>
            ) : (
              chatMessages.map((item, index) => (
                <div
                  key={item.cbMessageId}
                  className="space-y-2"
                  ref={index === chatMessages.length - 1 ? latestMessageRef : null}
                >
                  {item.userMessage && (
                    <div className="flex justify-end group">
                      <div className="max-w-[80%] bg-gradient-to-r from-amber-400 to-amber-500 text-white p-3 rounded-l-2xl rounded-tr-2xl shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:scale-102">
                        <p className="text-sm break-words">{item.userMessage}</p>
                        <span className="block mt-1 text-xs text-right text-amber-100/80">
                          {new Date(item.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  )}
                  {item.aiMessage && (
                    <div className="flex justify-start group">
                      <div className="max-w-[80%] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-3 rounded-r-2xl rounded-tl-2xl shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:scale-102">
                        <p className="text-sm break-words">
                          {item.isTyping ? (
                            <span className="flex items-center text-gray-500 dark:text-gray-400">
                              Đang trả lời...
                              <span className="inline-block w-1.5 h-1.5 ml-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                              <span className="inline-block w-1.5 h-1.5 ml-0.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                              <span className="inline-block w-1.5 h-1.5 ml-0.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                            </span>
                          ) : (
                            item.aiMessage
                          )}
                        </p>
                        {!item.isTyping && (
                          <span className="block mt-1 text-xs text-left text-gray-400 dark:text-gray-500">
                            {new Date(item.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {item.attachedProducts?.length > 0 && (
                    <div className="flex flex-wrap justify-start gap-3 mt-4">
                      {item.attachedProducts.map((productId) => (
                        <ProductCard key={productId} id={productId} index={index} borderClass="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm" />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            {!isTyping && supportMessages.length > 0 && (
              <div className="flex flex-wrap justify-start gap-2 mt-4">
                {supportMessages.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(item.autoGeneratedMessage)}
                    className="px-3 py-1.5 text-sm text-amber-600 transition-all duration-200 bg-amber-100 rounded-full dark:bg-amber-900/50 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900 hover:scale-105"
                  >
                    {item.display}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 left-0 right-0 flex items-center gap-2 p-3 bg-white border-t border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-grow min-h-[40px] max-h-[100px] p-2.5 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 bg-gray-100 border border-gray-200 rounded-full dark:text-gray-100 dark:placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y overflow-auto"
              rows="1"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!message.trim() || isTyping}
              className="p-2.5 text-white transition-all duration-200 rounded-full shadow-md bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
              aria-label="Gửi tin nhắn"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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