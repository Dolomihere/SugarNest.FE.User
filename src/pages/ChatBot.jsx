import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatBotService } from '../services/ChatBotService';

export function ChatBotPage() { // Changed to default export
  // In a real app, ensure accessToken is handled securely (e.g., via Context or Redux)
  const token = localStorage.getItem('accessToken') || 'mock-token-123'; 
  const queryClient = useQueryClient();

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [localMessages, setLocalMessages] = useState([]); // For optimistic updates
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Fetch chat list
  const {
    data: chatList,
    isLoading: isChatListLoading,
  } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => chatBotService.getChatList(token),
  });

  // Auto-select the first chat from the list upon initial load or chatList update
  useEffect(() => {
    // Only auto-select if no chat is currently selected AND there are chats in the list
    if (!selectedChatId && chatList?.data?.length) {
      setSelectedChatId(chatList.data[0]); // Assumes backend returns newest chat first
    }
  }, [chatList, selectedChatId]); // Add selectedChatId to dependencies to avoid infinite loop if it changes internally

  // Fetch current chat messages for the selected chat ID
  const {
    data: currentChatMessages,
    isLoading: isMessagesLoading,
    // No need for explicit refetch here, invalidateQueries will handle it
  } = useQuery({
    queryKey: ['currentChat', selectedChatId], // Query key depends on selectedChatId
    queryFn: () => chatBotService.getCurrentChat(token, selectedChatId),
    enabled: !!selectedChatId, // Only run this query if a chat ID is selected
    // Clear local messages only when new real data for the current chat arrives
    onSuccess: () => {
      setLocalMessages([]);
    }
  });

  // Send user message mutation
  const sendMessage = useMutation({
    mutationFn: async (text) => {
      // Pass selectedChatId to the service to either continue an existing chat
      // or indicate a new chat needs to be created if selectedChatId is null
      return await chatBotService.submitMessage(text, token, selectedChatId);
    },
    // Optimistic update: Add user's message to local state immediately
    onMutate: async (text) => {
      setIsAiTyping(true);
      setLocalMessages((prev) => [
        ...prev,
        {
          userMessage: text,
          aiMessage: null, // AI response will come from server
          cbMessageId: `local-${Date.now()}` // Unique ID for local message
        }
      ]);
    },
    // On successful message submission
    onSuccess: async (responseFromSubmitMessage) => {
      setUserInput(''); // Clear input field
      setIsAiTyping(false); // Stop AI typing indicator

      const displayedMessages = isMessagesLoading ? localMessages : (currentChatMessages?.data || []);

      // Invalidate both chat history and current chat messages to trigger refetches
      await queryClient.invalidateQueries(['chatHistory']); // Update sidebar
      await queryClient.invalidateQueries(['currentChat', selectedChatId]); // Update current chat messages

      // Crucial: Check if the backend returned a new chat ID
      const newChatId = responseFromSubmitMessage?.chatId;

      if (newChatId && newChatId !== selectedChatId) {
        // If a new chat ID is returned and it's different from the current, select it
        setSelectedChatId(newChatId);
      } else if (!selectedChatId) {
        // Fallback: If no new chat ID was explicitly returned by submitMessage
        // and no chat was selected, refetch the chat list and assume the first one is the newest.
        // This relies heavily on your backend sorting the chat list by creation date (newest first).
        const updatedList = await queryClient.fetchQuery(['chatHistory'], () => chatBotService.getChatList(token));
        if (updatedList?.data?.length) {
          setSelectedChatId(updatedList.data[0]);
        }
      }
      // React Query's dependency tracking will automatically refetch 'currentChat' if selectedChatId changes.
      // If selectedChatId doesn't change (e.g., continuing an existing chat),
      // the invalidateQueries(['currentChat', selectedChatId]) will force a refetch.
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      setIsAiTyping(false);
      setLocalMessages([]); // Clear local messages on error
      // In a real app, show an error message to the user
      console.error('Gửi tin nhắn thất bại.');
    }
  });

  // Suggest product mutation
  const suggestMutation = useMutation({
    mutationFn: async () => {
      return await chatBotService.genProductSuggest({
        message: "Gợi ý sản phẩm cho sinh nhật",
        configs: [true, false, true],
        meta: {
          name: "Birthday Cake",
          description: "A sweet and colorful cake for birthdays",
          details: "Size: Medium, Flavor: Vanilla",
          keywords: ["cake", "birthday", "sweet", "party"]
        }
      }, token);
    },
    onSuccess: (data) => {
      console.log('AI Suggestions:', data);
      // Replace with a proper UI notification (e.g., toast, modal)
      console.log("Sản phẩm gợi ý đã được tạo! Xem console để biết chi tiết.");
    },
    onError: (err) => {
      console.error('AI Suggestion Failed', err);
      // Replace with a proper UI notification
      console.error('Gợi ý thất bại.');
    }
  });

  // Delete chat mutation
  const deleteChat = useMutation({
    mutationFn: async (chatId) => {
      return await chatBotService.deleteChat(chatId, token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['chatHistory']); // Refetch chat list
      setSelectedChatId(null); // Deselect current chat
      setLocalMessages([]); // Clear local messages
      // Replace with a proper UI notification
      console.log('Cuộc trò chuyện đã được xoá.');
    },
    onError: () => {
      // Replace with a proper UI notification
      console.error('Xoá cuộc trò chuyện thất bại.');
    }
  });

  // Handler for sending a message
  const handleSend = () => {
    if (!userInput.trim()) return; // Prevent sending empty messages
    sendMessage.mutate(userInput.trim());
    setUserInput(''); // Clear the input field immediately
  };

  // Combine fetched messages and local optimistic messages for display
  const displayedMessages = [
    ...(currentChatMessages?.data || []), // Existing messages from the server
    ...localMessages // Optimistic local messages
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto rounded-lg shadow-md m-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Chat History 💬</h2>
        {isChatListLoading ? (
          <p className="text-gray-500">Loading chat history...</p>
        ) : (
          <ul className="space-y-2">
            {chatList.data?.length > 0 ? (
              chatList.data.map((id) => (
                <li key={id} className="flex items-center justify-between group">
                  <div
                    onClick={() => setSelectedChatId(id)}
                    className={`flex-1 p-3 rounded-lg cursor-pointer transition-all duration-200 
                                ${selectedChatId === id ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <span className="text-sm">{id.slice(0, 8)}...</span>
                  </div>
                  <button
                    onClick={() => deleteChat.mutate(id)}
                    className="ml-2 p-2 rounded-full text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Delete Chat"
                  >
                    🗑️
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No chat history yet. Send a message to start!</p>
            )}
          </ul>
        )}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md m-4">
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {isMessagesLoading ? (
            <p className="text-center text-gray-500">Đang tải tin nhắn ...</p>
          ) : (
            <div className="space-y-4">
              {displayedMessages.length > 0 ? (
                displayedMessages.map((msg, i) => (
                  <div key={msg.cbMessageId || `msg-${i}`}>
                    {msg.userMessage && (
                      <div className="flex justify-end mb-1">
                        <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-none max-w-md shadow">
                          {msg.userMessage}
                        </div>
                      </div>
                    )}
                    {(msg.aiMessage || (isAiTyping && i === displayedMessages.length - 1)) && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-md shadow">
                          {msg.aiMessage || (isAiTyping && i === displayedMessages.length - 1 ? 'AI đang trả lời...' : '')}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Bắt đầu cuộc trò chuyện mới!</p>
              )}
            </div>
          )}
        </div>

        {/* Input + Suggest */}
        <div className="border-t p-4 bg-gray-50 space-y-3 rounded-b-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !sendMessage.isLoading) {
                  handleSend();
                }
              }}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              disabled={sendMessage.isLoading}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-blue-300"
              disabled={sendMessage.isLoading || !userInput.trim()}
            >
              {sendMessage.isLoading ? 'Đang gửi...' : 'Gửi'}
            </button>
          </div>

          <button
            onClick={() => suggestMutation.mutate()}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md disabled:bg-green-300"
            disabled={suggestMutation.isLoading}
          >
            {suggestMutation.isLoading ? 'Đang gợi ý...' : 'Gợi ý sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
}
