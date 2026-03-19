import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useChatWebSocketContext } from '../../hooks/useChatWebSocketContext';

const MessageInput: React.FC = () => {
  const { selectedChatRoomId } = useSelector((state: RootState) => state.chat);
  const [message, setMessage] = useState('');
  const { sendMessage: sendStompMessage } = useChatWebSocketContext();

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !selectedChatRoomId) return;
    sendStompMessage(selectedChatRoomId, message.trim());
    setMessage('');
  }, [message, selectedChatRoomId, sendStompMessage]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChatRoomId) return null;

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
            rows={1}
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="flex-shrink-0 rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          보내기
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
