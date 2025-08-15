import React, { useState, useEffect } from "react";
import ChatBotModal from "../components/modals/ChatBotModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export default function ChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [position, setPosition] = useState({ bottom: 32, right: 32 }); // Initial position in px (bottom-8 right-8 assuming 1rem=16px)
  const [dragging, setDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;

        // Check if dragged beyond threshold
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          setHasDragged(true);
        }

        // Update position
        setPosition((prev) => ({
          bottom: prev.bottom - dy,
          right: prev.right - dx,
        }));

        setLastPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      if (!hasDragged) {
        // If not dragged, treat as click and open modal
        setSelectedOrderId("12345");
        setIsModalOpen(true);
      }
      setHasDragged(false); // Reset for next interaction
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, hasDragged, startPos, lastPos]);

  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left mouse button
      setDragging(true);
      setHasDragged(false);
      setStartPos({ x: e.clientX, y: e.clientY });
      setLastPos({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <>
      <button
        onMouseDown={handleMouseDown}
        className="fixed z-50 p-5 text-white transition-all duration-300 transform rounded-full shadow-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-3xl hover:from-amber-600 hover:to-orange-700 hover:scale-110"
        style={{ bottom: `${position.bottom}px`, right: `${position.right}px` }}
        title="Mở chat"
      >
        <FontAwesomeIcon icon={faComment} size="lg" />
      </button>

      <ChatBotModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orderId={selectedOrderId}
      />
    </>
  );
}