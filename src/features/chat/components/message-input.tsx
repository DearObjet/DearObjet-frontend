import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';

import { useAppSelector } from '../../../app/hooks';
import { useChatWebSocketContext } from '../hooks/use-chat-websocket-context';
import { useUploadImageMutation } from '../api/chat-api';

export const MessageInput = () => {
  const { selectedChatRoomId } = useAppSelector((state) => state.chat);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocusedRef = useRef(false);

  const { sendMessage: sendStompMessage, sendTyping } =
    useChatWebSocketContext();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  // 타이핑 중단 감지:
  // message가 바뀔 때마다 1초 타이머를 리셋
  // 입력이 없는 상태, focus -> blur 되면 타이핑 종료 이벤트 전송
  useEffect(() => {
    if (!selectedChatRoomId || !isTyping) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (isFocusedRef.current) return; // 포커스 중이면 타이핑 종료 안 함

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

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
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
    },
    [selectedChatRoomId, isTyping, sendTyping]
  );

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    if (selectedChatRoomId && message.length > 0 && !isTyping) {
      sendTyping(selectedChatRoomId, true);
      setIsTyping(true);
    }
  }, [selectedChatRoomId, message, isTyping, sendTyping]);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (!selectedChatRoomId) return;
    sendTyping(selectedChatRoomId, false);
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [selectedChatRoomId, sendTyping]);

  const handleFileAttach = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !selectedChatRoomId) return;

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        const { url } = await uploadImage(formData).unwrap();
        sendStompMessage(selectedChatRoomId, url);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch {
        console.error('이미지 업로드 실패:', e);
        alert('파일 업로드에 실패했습니다.');
      }
    },
    [selectedChatRoomId, uploadImage, sendStompMessage]
  );

  if (!selectedChatRoomId) return null;

  return (
    <div className="border-t border-theme-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleFileAttach}
          disabled={isUploading}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-theme-900 text-white transition-colors hover:bg-theme-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="relative flex-1">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="메시지를 입력하세요"
            disabled={isUploading}
            rows={1}
            className="block max-h-[7.5rem] min-h-[3rem] w-full resize-none rounded-lg border border-theme-300 px-4 py-3 pr-12 placeholder-theme-300 focus:outline-none focus:ring-1 focus:ring-theme-300 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isUploading}
          className="flex-shrink-0 rounded-lg bg-theme-900 px-6 py-3 font-medium text-white transition-colors hover:bg-theme-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          보내기
        </button>
      </div>
    </div>
  );
};
