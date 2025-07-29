import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface Chat {
  id: string;
  name: string;
  type: "direct" | "group";
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender?: string;
  unreadCount: number;
  isOnline: boolean;
  participants?: string[];
  otherMembers?: Array<{
    _id: string;
    name: string;
    username: string;
    image?: string;
  }>;
  createdAt: string;
}

export function useUnreadCount() {
  const { data: session } = useSession();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateTotalUnread = (chatList: Chat[]) => {
    return chatList.reduce((total, chat) => total + chat.unreadCount, 0);
  };

  const refreshUnreadCount = useCallback(async () => {
    if (!session?.user?.email) {
      setTotalUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/chat");
      if (response.ok) {
        const data = await response.json();
        const chats = data.chats || [];
        const total = calculateTotalUnread(chats);
        setTotalUnreadCount(total);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  // Fetch unread count on mount and when session changes
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  // Poll for updates every 10 seconds (less frequent than chat page)
  useEffect(() => {
    if (!session?.user?.email) return;

    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [refreshUnreadCount, session?.user?.email]);

  return {
    totalUnreadCount,
    loading,
    refreshUnreadCount,
  };
}
