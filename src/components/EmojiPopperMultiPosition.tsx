import React, { useState, useEffect } from "react";
import "./EmojiPopper.css"; // đảm bảo bạn đã tạo file này

interface EmojiPopperMultiPositionProps {
  children: React.ReactNode;
  popupIcon: React.ReactNode;
  duration?: number;
  count?: number;
  zoneWidth?: number;
  zoneHeight?: number;
  trigger?: "click" | "hover"; // 👈 hỗ trợ trigger tùy chỉnh
}

const EmojiPopperMultiPosition: React.FC<EmojiPopperMultiPositionProps> = ({
  children,
  popupIcon,
  duration = 1000,
  count = 6,
  zoneWidth = 100,
  zoneHeight = 100,
  trigger = "click",
}) => {
  const [showBurst, setShowBurst] = useState(false);
  const [burstPositions, setBurstPositions] = useState<
    { top: string; left: string; delay: string }[]
  >([]);

  const triggerBurst = () => {
    if (showBurst) return;

    const positions = Array.from({ length: count }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.4}s`,
    }));

    setBurstPositions(positions);
    setShowBurst(true);

    setTimeout(() => {
      setShowBurst(false);
      setBurstPositions([]);
    }, duration);
  };

  const eventProps =
    trigger === "hover"
      ? { onMouseEnter: triggerBurst }
      : { onClick: triggerBurst };

  return (
    <div className="multi-emoji-wrapper relative inline-block" {...eventProps}>
      <div className="hover:scale-110 transition-transform duration-300 ease-out flex items-center justify-center">
        {children}
      </div>

      {showBurst && (
        <div
          className="emoji-burst-zone absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{ width: `${zoneWidth}px`, height: `${zoneHeight}px` }}
        >
          {burstPositions.map((pos, index) => (
            <div
              key={index}
              className="multi-emoji-burst"
              style={{
                top: pos.top,
                left: pos.left,
                animationDelay: pos.delay,
                animationDuration: `${duration}ms`,
              }}
            >
              {popupIcon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiPopperMultiPosition;
