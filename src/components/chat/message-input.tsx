import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useChatWebSocketContext } from '../../hooks/useChatWebSocketContext';

const MessageInput: React.FC = () => {
  const { selectedChatRoomId } = useSelector((state: RootState) => state.chat);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocusedRef = useRef(false);

  const { sendMessage: sendStompMessage, sendTyping } =
    useChatWebSocketContext();

  // 타이핑 중단 로직
  useEffect(() => {
    if (!selectedChatRoomId || !isTyping) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      // focus 중이면 타이핑 종료 안 함
      if (isFocusedRef.current) return;
      sendTyping(selectedChatRoomId, false);
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [message, selectedChatRoomId, isTyping, sendTyping]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !selectedChatRoomId) return;

    sendStompMessage(selectedChatRoomId, message.trim());

    if (isTyping) {
      sendTyping(selectedChatRoomId, false);
      setIsTyping(false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    setMessage('');
  }, [message, selectedChatRoomId, isTyping, sendStompMessage, sendTyping]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    if (!selectedChatRoomId) return;

    if (!isTyping && newValue.length > 0) {
      sendTyping(selectedChatRoomId, true);
      setIsTyping(true);
    }

    if (newValue.length === 0 && isTyping) {
      sendTyping(selectedChatRoomId, false);
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  if (!selectedChatRoomId) return null;

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              isFocusedRef.current = true;
              // focus 시 메시지가 있으면 타이핑 시작
              if (selectedChatRoomId && message.length > 0 && !isTyping) {
                sendTyping(selectedChatRoomId, true);
                setIsTyping(true);
              }
            }}
            onBlur={() => {
              isFocusedRef.current = false;
              // focus 잃으면 즉시 타이핑 종료
              if (!selectedChatRoomId) return;
              sendTyping(selectedChatRoomId, false);
              setIsTyping(false);
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
              }
            }}
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
