import React, { useState } from "react";
import ChatBotModal from "../components/modals/ChatBotModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export default function ChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <button
        onClick={() => openModal("12345")}
        className="fixed z-50 p-5 text-white transition-all duration-300 transform rounded-full shadow-2xl bottom-8 right-8 bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-3xl hover:from-amber-600 hover:to-orange-700 hover:scale-110"
        title="Mở chat"
      >
        <FontAwesomeIcon icon={faComment} size="lg" />
      </button>

      <ChatBotModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orderId={selectedOrderId}
      />
    </div>
  );
}