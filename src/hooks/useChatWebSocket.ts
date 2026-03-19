import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  addMessage,
  setTypingUsers,
  clearUnreadCount,
} from '../store/slices/chat-slice';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type {
  MessageResponse,
  TypingIndicatorDto,
  ReadReceiptDto,
  WebSocketError,
} from '../types/chatTypes';

interface ChatWebSocketHook {
  isConnected: boolean;
  sendMessage: (roomId: string, content: string) => void;
  sendTyping: (roomId: string, isTyping: boolean) => void;
  markAsRead: (roomId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const useChatWebSocket = (): ChatWebSocketHook => {
  const dispatch = useDispatch();
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribedRoomsRef = useRef<Set<string>>(new Set());

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { selectedChatRoomId, chatRooms } = useSelector(
    (state: RootState) => state.chat
  );

  const sendMessage = useCallback((roomId: string, content: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/send`,
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({ roomId, content, messageType: 'TEXT' }),
    });
  }, []);

  const sendTyping = useCallback(
    (roomId: string, isTyping: boolean) => {
      if (!clientRef.current?.connected || !currentUser) return;
      clientRef.current.publish({
        destination: `/app/chat/${roomId}/typing`,
        body: JSON.stringify({
          roomId,
          userId: currentUser.userId,
          userName: currentUser.name,
          typing: isTyping,
        }),
      });
    },
    [currentUser]
  );

  const markAsRead = useCallback((roomId: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/read`,
      body: '{}',
    });
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/join`,
      body: '{}',
    });
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/leave`,
      body: '{}',
    });
  }, []);

  const subscribeToRoom = useCallback(
    (client: Client, roomId: string) => {
      if (!currentUser) return;
      if (subscribedRoomsRef.current.has(roomId)) return;

      const currentUserId = currentUser.userId;

      client.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
        try {
          const chatMessage: MessageResponse = JSON.parse(message.body);
          dispatch(addMessage({ message: chatMessage, currentUserId }));
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      });

      client.subscribe(`/topic/chat/${roomId}/typing`, (message: IMessage) => {
        try {
          const typing: TypingIndicatorDto = JSON.parse(message.body);
          if (typing.userId !== currentUser.userId) {
            dispatch(
              setTypingUsers({
                roomId: typing.roomId,
                typingUsers: typing.typing
                  ? [
                      {
                        userId: typing.userId,
                        userName: typing.userName,
                        roomId: typing.roomId,
                      },
                    ]
                  : [],
              })
            );
          }
        } catch (e) {
          console.error('Failed to parse typing event:', e);
        }
      });

      client.subscribe(`/topic/chat/${roomId}/read`, (message: IMessage) => {
        try {
          const readReceipt: ReadReceiptDto = JSON.parse(message.body);
          if (readReceipt.userId === currentUser.userId) {
            dispatch(clearUnreadCount(readReceipt.roomId));
          }
        } catch (e) {
          console.error('Failed to parse read receipt:', e);
        }
      });

      client.subscribe(
        `/topic/chat/${roomId}/presence`,
        (message: IMessage) => {
          try {
            JSON.parse(message.body);
          } catch (e) {
            console.error('Failed to parse presence event:', e);
          }
        }
      );

      subscribedRoomsRef.current.add(roomId);
    },
    [currentUser, dispatch]
  );

  useEffect(() => {
    if (!isConnected) subscribedRoomsRef.current.clear();
  }, [isConnected]);

  useEffect(() => {
    if (!currentUser) {
      setIsConnected(false);
      return;
    }

    const wsBaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
    const token = accessToken || localStorage.getItem('accessToken');

    const client = new Client({
      webSocketFactory: () => new SockJS(`${wsBaseUrl}/ws`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      client.subscribe('/user/queue/errors', (message: IMessage) => {
        try {
          const error: WebSocketError = JSON.parse(message.body);
          console.error('WebSocket Error:', error);
        } catch (e) {
          console.error('Failed to parse error message:', e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
      setIsConnected(false);
    };

    client.onWebSocketError = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      setIsConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
        setIsConnected(false);
      }
    };
  }, [currentUser, accessToken]);

  // 모든 채팅방 구독
  useEffect(() => {
    if (!isConnected || !clientRef.current || chatRooms.length === 0) return;
    chatRooms.forEach((room) => {
      subscribeToRoom(clientRef.current!, room.roomId);
    });
  }, [isConnected, chatRooms, subscribeToRoom]);

  // 선택된 채팅방 구독
  useEffect(() => {
    if (!isConnected || !clientRef.current || !selectedChatRoomId) return;
    subscribeToRoom(clientRef.current, selectedChatRoomId);
  }, [isConnected, selectedChatRoomId, subscribeToRoom]);

  return {
    isConnected,
    sendMessage,
    sendTyping,
    markAsRead,
    joinRoom,
    leaveRoom,
  };
};
