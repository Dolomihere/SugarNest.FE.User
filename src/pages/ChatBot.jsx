import React, { useState, useRef, useEffect } from 'react';

export function ChatBotPage() {
  // State to hold chat messages
  // Each message object could have properties like { id, text, sender: 'user' | 'bot' }
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your friendly Bakery Bot. How can I help you with your sweet or savory cravings today? Ask me about our pastries, breads, cakes, or anything else!", sender: 'bot' }
  ]);
  // State for the current user input
  const [inputValue, setInputValue] = useState('');
  // State for loading indicator (e.g., while waiting for API response)
  const [isLoading, setIsLoading] = useState(false);

  // Ref to scroll the chat messages to the bottom
  const messagesEndRef = useRef(null);

  // Effect to scroll to the latest message whenever messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return; // Don't send empty messages

    // Add user message to state
    const newUserMessage = { id: messages.length + 1, text: trimmedInput, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue(''); // Clear input field

    setIsLoading(true); // Show loading indicator

    // --- YOUR SERVICE ROUTE INTEGRATION GOES HERE ---
    // This is where you would typically make a fetch or axios call to your backend.
    // Replace this placeholder with your actual API call.
    // Example:
    try {
      // const response = await fetch('/api/your-bakery-bot-route', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message: trimmedInput }),
      // });
      // const data = await response.json();
      // const botResponseText = data.botReply; // Assuming your API returns a 'botReply' field

      // For demonstration, we'll simulate a delay and a dummy bot response
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      const botResponseText = `You asked about "${trimmedInput}". As a Bakery Bot, I'd say that sounds delicious! What specifically would you like to know?`;


      // Add bot's response to state
      setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, text: botResponseText, sender: 'bot' }]);

    } catch (error) {
      console.error("Error calling your service route:", error);
      setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, text: "Oops! I'm having trouble connecting to the bakery kitchen right now. Please try again later!", sender: 'bot' }]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
    // --- END OF YOUR SERVICE ROUTE INTEGRATION ---
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Main Chat Container */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] md:h-[700px]">

        {/* Chat Header */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-5 text-center text-2xl font-bold rounded-t-xl shadow-md">
          🥐 Bakery Bot 🍞
        </div>

        {/* Chat Messages Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-orange-50 custom-scrollbar">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-4 rounded-xl max-w-[85%] shadow-sm ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            </div>
          ))}
          {/* Loading indicator for bot's response */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-700 p-4 rounded-xl max-w-[85%] shadow-sm">
                Thinking... <span className="animate-pulse">🍪</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Scroll target */}
        </div>

        {/* Chat Input Area */}
        <div className="flex p-4 border-t border-gray-200 bg-white">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about our delicious treats..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading} // Disable button while loading
            className={`ml-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-200 ease-in-out transform
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-400 hover:scale-105'}`}
          >
            Send
          </button>
        </div>
      </div>

      {/* Custom scrollbar style for React component - typically in a global CSS file or <style> tag in index.html */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #fca5a5; /* Light red/orange for bakery theme */
            border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #ef4444; /* Darker red/orange on hover */
        }
        body {
            font-family: "Inter", sans-serif;
            background-color: #f3f4f6; /* Light gray background */
        }
      `}</style>
    </div>
  );
}
