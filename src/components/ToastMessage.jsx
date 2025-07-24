import React from 'react';

const ToastMessage = ({ type = 'success', message, onClose }) => {
  const styles = {
    success: {
      bg: 'from-[#fff1e6] to-[#fdebd3]',
      border: 'border-[#f9c89b]',
      text: 'text-[#5c4033]',
      emoji: '🎉',
      title: 'Thành công!',
    },
    error: {
      bg: 'from-[#fff0f0] to-[#ffe3e3]',
      border: 'border-[#f9a8a8]',
      text: 'text-[#7b1e1e]',
      emoji: '⚠️',
      title: 'Lỗi xảy ra!',
    },
  };

  const { bg, border, text, emoji, title } = styles[type] || styles.success;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div
        className={`relative max-w-sm w-full px-6 py-5 bg-gradient-to-br ${bg} border ${border} ${text} rounded-2xl shadow-xl`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">{emoji}</div>
          <div className="flex-1">
            <h3 className="text-base font-semibold mb-1">{title}</h3>
            <p className="text-sm leading-snug">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-black leading-none absolute top-2 right-3"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
