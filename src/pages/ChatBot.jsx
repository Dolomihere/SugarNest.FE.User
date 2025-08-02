import{ use, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { chatBotService } from '../services/ChatBotService';

export function ChatBotPage({ jwtToken }) {
  const token = localStorage.getItem('accessToken');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [userInput, setUserInput] = useState('');

  const { data: chatHistory, isLoading, error } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const res = await chatBotService.getChatList(token);
      return res.data;
    },
  });

  const { data: currentChatMessages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['currentChat', selectedChatId],
    queryFn: async () => {
      const res = await chatBotService.getCurrentChat(token, selectedChatId);
      return res.data;
    },
    enabled: !!selectedChatId,
  });

  const sendMessage = useMutation({
    queryKey: ['sendMgs'],
    queryFn: async (text) => {
      const res = await chatBotService.submitMessage(text, token);
      console.log('point')
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['currentChat', variables.cbConversationId]);
    }
  });

  const sendUserMgs = () => {
    sendMessage.mutate(userInput);
    setUserInput('');
  }

  return (
    <div className="flex h-screen bg-gray-100">

      <div className="w-1/4 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Dang nhap vao de xem chat</p>
          ) : (
            <ul className="space-y-2">

              {chatHistory.map((chat, i) => (
                <li
                  key={i}
                  onClick={() => setSelectedChatId(chat)}
                  className={`p-2 hover:bg-gray-100 rounded cursor-pointer ${
                    selectedChatId === chat ? 'bg-blue-100' : ''
                  }`}
                >
                  <span className="text-blue-600">{chat} a</span>
                </li>
              ))}

            </ul>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">

        <div className="flex-1 p-6 overflow-y-auto">

          {isMessagesLoading ? (
            <p>Loading messages...</p>
          ) : (
            <div className="space-y-4">
              {currentChatMessages?.map((msg) => (
                <div key={msg.cbMessageId}>

                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-md">
                      {msg.userMessage}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
                      {msg.aiMessage}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={sendUserMgs}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
