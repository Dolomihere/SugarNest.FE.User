// src/context/ChatContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import ChatService from "../services/ChatService";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

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
            const messagesData = await ChatService.getMessages(token, firstConversationId);
            if (isMounted) setMessages(messagesData?.data || []);
          } else if (isMounted) {
            const res = await ChatService.sendMessage("start", token);
            if (isMounted && res?.data?.conversationId) {
              setConversationId(res.data.conversationId);
              setMessages([{ sender: "bot", text: "Chào bạn! Bạn cần giúp gì không? 🎂" }]);
            } else {
              setMessages([{ sender: "bot", text: "Chưa có cuộc trò chuyện nào. Hãy bắt đầu nhé! 🎂" }]);
            }
          }
        } else {
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

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        conversationId,
        setConversationId,
        isOpen,
        setIsOpen,
        isVisible,
        setIsVisible,
        isTyping,
        setIsTyping,
        error,
        setError,
        token,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);