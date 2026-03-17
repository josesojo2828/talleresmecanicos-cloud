import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!(session?.user as any)?.accessToken) {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:9999';
    
    // Connect to the 'chat' namespace
    const socket = io(`${apiUrl}/chat`, {
      auth: {
        token: (session?.user as any)?.accessToken,
      },
      transports: ['websocket'],
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
  }, [session]);

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sendMessage', content);
    }
  }, [isConnected]);

  return {
    messages,
    sendMessage,
    isConnected,
    user: session?.user,
  };
};
