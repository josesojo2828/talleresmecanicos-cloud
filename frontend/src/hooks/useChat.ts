import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';

export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  profile?: {
    avatarUrl?: string;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  user: ChatUser;
}

export const useChat = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !isAuthenticated) {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        return;
    }

    // Clean the URL from trailing slashes
    const rawUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:9999';
    const apiUrl = rawUrl.replace(/\/$/, "");
    
    // Connect to the 'chat' namespace
    const socket = io(`${apiUrl}/chat`, {
      auth: {
        token: token,
      },
      // Remove transport restriction to allow polling fallback if websocket is blocked
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on('newMessage', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, isAuthenticated]);

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sendMessage', content);
    }
  }, [isConnected]);

  return {
    messages,
    sendMessage,
    isConnected,
    user,
  };
};
