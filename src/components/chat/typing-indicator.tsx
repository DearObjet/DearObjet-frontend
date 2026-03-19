import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="mb-3 flex justify-start">
      <div className="rounded-2xl rounded-tl-none bg-black px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-white"
              style={{
                animation: 'typingBounce 1.2s infinite ease-in-out',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
