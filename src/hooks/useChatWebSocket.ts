import { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatWebSocketHook {
  isConnected: boolean;
  sendMessage: (roomId: string, content: string) => void;
  markAsRead: (roomId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const useChatWebSocket = (): ChatWebSocketHook => {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const sendMessage = useCallback((roomId: string, content: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/send`,
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({ roomId, content, messageType: 'TEXT' }),
    });
  }, []);

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

  return { isConnected, sendMessage, markAsRead, joinRoom, leaveRoom };
};
