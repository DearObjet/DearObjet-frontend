import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  addMessage,
  setTypingUsers,
  clearUnreadCount,
  updatePartnerReadAt,
} from '../slices/chat-slice';
import { chatApi } from '../api/chat-api';
import type {
  MessageResponse,
  TypingIndicatorDto,
  ReadReceiptDto,
  WebSocketError,
} from '../types/chat-types';

interface ChatWebSocketHook {
  isConnected: boolean;
  sendMessage: (roomId: string, content: string) => void;
  sendTyping: (roomId: string, isTyping: boolean) => void;
  markAsRead: (roomId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const useChatWebSocket = (): ChatWebSocketHook => {
  const dispatch = useAppDispatch();

  // STOMP 클라이언트 인스턴스
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 이미 구독한 채팅방 ID 목록
  const subscribedRoomsRef = useRef<Set<string>>(new Set());

  // 각 채팅방의 마지막 수신 메시지 ID — 재연결 시 누락 메시지 복구에 사용
  const lastMessageIdsRef = useRef<Record<string, number>>({});

  // 최초 연결 또는 재연결 구분 플래그  (누락 메시지 복구 필요)
  const isReconnectingRef = useRef(false);

  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { selectedChatRoomId, chatRooms } = useAppSelector(
    (state) => state.chat
  );

  // ===== 재연결 시 누락 메시지 복구 =====
  // WebSocket이 끊겼다 재연결됐을 때 그 사이에 받지 못한 메시지를 REST API로 동기화
  const syncMissingMessages = useCallback(async () => {
    const roomsWithMessages = Object.keys(lastMessageIdsRef.current);
    if (roomsWithMessages.length === 0) return;

    for (const roomId of roomsWithMessages) {
      const afterMessageId = lastMessageIdsRef.current[roomId];
      try {
        // 마지막으로 받은 메시지 이후의 메시지를 서버에서 가져옴
        const result = await dispatch(
          chatApi.endpoints.syncMessages.initiate(
            { roomId, afterMessageId, limit: 200 },
            { forceRefetch: true }
          )
        ).unwrap();

        if (result.messages.length > 0) {
          result.messages.forEach((message) => {
            dispatch(
              addMessage({
                message,
                currentUserId: currentUser!.userId,
                skipUnreadUpdate: true,
              })
            );
          });
        }
      } catch (e) {
        console.error(`[${roomId}] 메시지 동기화 실패:`, e);
      }
    }
  }, [dispatch, currentUser]);

  // syncMissingMessages를 ref로 감싸는 이유:
  // onConnect 콜백은 클로저로 등록되어 최초 함수 참조를 캡처하므로,
  // currentUser가 바뀌어도 onConnect 안에서 최신 syncMissingMessages를 호출하려면 ref가 필요
  const syncMissingMessagesRef = useRef(syncMissingMessages);
  useEffect(() => {
    syncMissingMessagesRef.current = syncMissingMessages;
  }, [syncMissingMessages]);

  // ===== STOMP 메시지 전송 =====

  const sendMessage = useCallback((roomId: string, content: string) => {
    if (!clientRef.current?.connected) {
      console.error('WebSocket not connected');
      return;
    }
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/send`,
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({ roomId, content, messageType: 'TEXT' }),
    });
  }, []);

  // 타이핑 상태 전송 — 상대방에게 "..." 표시를 위해 사용
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

  // 읽음 처리 전송 — 채팅방 입장 또는 새 메시지 수신 시 호출
  const markAsRead = useCallback((roomId: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/read`,
      body: '{}',
    });
  }, []);

  // 채팅방 입장 — 서버에 presence 이벤트 전송
  const joinRoom = useCallback((roomId: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/join`,
      body: '{}',
    });
  }, []);

  // 채팅방 퇴장 — 다른 방으로 이동하거나 언마운트 시 호출
  const leaveRoom = useCallback((roomId: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${roomId}/leave`,
      body: '{}',
    });
  }, []);

  // ===== 채팅방 구독 =====
  // 하나의 채팅방에 대해 메시지/타이핑/읽음/presence 4개 토픽을 구독
  const subscribeToRoom = useCallback(
    (client: Client, roomId: string) => {
      // 이미 구독한 방은 중복 구독하지 않음
      if (!currentUser || subscribedRoomsRef.current.has(roomId)) return;

      const currentUserId = currentUser.userId;

      // 1. 일반 메시지 수신
      client.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
        try {
          const chatMessage: MessageResponse = JSON.parse(message.body);
          // 마지막 수신 메시지 ID 갱신 — 재연결 시 이 ID 이후 메시지를 동기화
          lastMessageIdsRef.current[roomId] = chatMessage.id;
          dispatch(addMessage({ message: chatMessage, currentUserId }));
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      });

      // 2. 타이핑 이벤트 수신 — 내가 보낸 이벤트는 무시
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

      // 3. 읽음 처리 수신
      // - 내가 읽은 경우: unreadCount 초기화
      // - 상대방이 읽은 경우: partnerLastReadAt 갱신 (내 메시지의 읽음 표시 업데이트)
      client.subscribe(`/topic/chat/${roomId}/read`, (message: IMessage) => {
        try {
          const readReceipt: ReadReceiptDto = JSON.parse(message.body);
          if (readReceipt.userId === currentUser.userId) {
            dispatch(clearUnreadCount(readReceipt.roomId));
          } else {
            dispatch(
              updatePartnerReadAt({
                roomId: readReceipt.roomId,
                readAt: readReceipt.readAt,
              })
            );
          }
        } catch (e) {
          console.error('Failed to parse read receipt:', e);
        }
      });

      // 4. presence 이벤트 수신 (입장/퇴장)
      client.subscribe(
        `/topic/chat/${roomId}/presence`,
        (message: IMessage) => {
          try {
            const presence = JSON.parse(message.body);
            console.log(`[${roomId}] presence:`, presence);
          } catch (e) {
            console.error('Failed to parse presence event:', e);
          }
        }
      );

      subscribedRoomsRef.current.add(roomId);
    },
    [currentUser, dispatch]
  );

  // WebSocket 연결이 끊기면 구독 목록 초기화 — 재연결 시 전체 재구독
  useEffect(() => {
    if (!isConnected) subscribedRoomsRef.current.clear();
  }, [isConnected]);

  // ===== WebSocket 연결 관리 =====
  // currentUser 또는 accessToken이 바뀔 때마다 재연결
  useEffect(() => {
    if (!currentUser || !accessToken) {
      setIsConnected(false);
      return;
    }

    const wsBaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

    const client = new Client({
      webSocketFactory: () => new SockJS(`${wsBaseUrl}/ws`),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000, // 5초 후 자동 재연결 시도
      heartbeatIncoming: 4000, // 서버 → 클라이언트 heartbeat 주기
      heartbeatOutgoing: 4000, // 클라이언트 → 서버 heartbeat 주기
    });

    client.onConnect = () => {
      setIsConnected(true);

      // 재연결인 경우: 누락 메시지 복구 + 채팅방 목록 갱신
      if (isReconnectingRef.current) {
        syncMissingMessagesRef.current();
        dispatch(chatApi.util.invalidateTags(['ChatRooms', 'Messages']));
      }

      // 다음 연결부터는 재연결로 처리
      isReconnectingRef.current = true;

      // 서버에서 오는 에러 메시지 수신 (인증 실패, 권한 없음 등)
      client.subscribe('/user/queue/errors', (message: IMessage) => {
        try {
          const error: WebSocketError = JSON.parse(message.body);
          console.error('❌ WebSocket Error:', error);
        } catch (e) {
          console.error('Failed to parse error message:', e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('❌ STOMP Error:', frame.headers['message']);
      setIsConnected(false);
    };

    client.onWebSocketError = (error) => {
      console.error('❌ WebSocket Error:', error);
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      console.warn('⚠️ WebSocket Closed');
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
  }, [currentUser, accessToken, dispatch]);

  // 연결 후 기존 채팅방 전체 구독 — 새 메시지 실시간 수신을 위해
  useEffect(() => {
    if (!isConnected || !clientRef.current || chatRooms.length === 0) return;
    chatRooms.forEach((room) =>
      subscribeToRoom(clientRef.current!, room.roomId)
    );
  }, [isConnected, chatRooms, subscribeToRoom]);

  // 선택된 채팅방 구독 — 채팅방 목록에 없는 방을 직접 선택한 경우 대비
  useEffect(() => {
    if (!isConnected || !clientRef.current || !selectedChatRoomId) return;
    subscribeToRoom(clientRef.current, selectedChatRoomId);
  }, [isConnected, selectedChatRoomId, subscribeToRoom]);

  return useMemo(
    () => ({
      isConnected,
      sendMessage,
      sendTyping,
      markAsRead,
      joinRoom,
      leaveRoom,
    }),
    [isConnected, sendMessage, sendTyping, markAsRead, joinRoom, leaveRoom]
  );
};
