"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./blink.css";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Users,
  Plus,
  Search,
  X,
  Trash2,
  ChevronLeft,
  Archive,
  CheckCheck,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  timestamp: string;
  type: "text" | "image" | "file";
  isOwn: boolean;
  createdAt: string;
}

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

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  department?: string;
  course?: string;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastMessageTime, setLastMessageTime] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [openChatListMenu, setOpenChatListMenu] = useState<string | null>(null);
  const [openChatHeaderMenu, setOpenChatHeaderMenu] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate total unread messages across all chats
  const calculateTotalUnread = (chatList: Chat[]) => {
    const total = chatList.reduce((total, chat) => total + chat.unreadCount, 0);
    console.log(
      "Calculating total unread:",
      total,
      "from chats:",
      chatList.map((c) => ({ name: c.name, unread: c.unreadCount }))
    );
    return total;
  };

  // Mark chat as read when user opens it
  const markChatAsRead = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update local state to reflect read status
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
          );
          // Recalculate total unread count
          const newTotal = calculateTotalUnread(updatedChats);
          setTotalUnreadCount(newTotal);
          return updatedChats;
        });
      }
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  };

  // Helper function to refresh chats manually
  const refreshChats = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch("/api/chat");
      if (response.ok) {
        const data = await response.json();
        const newChats = data.chats || [];
        setChats(newChats);

        // Calculate and update total unread count
        const totalUnread = calculateTotalUnread(newChats);
        setTotalUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error refreshing chats:", error);
    }
  };

  // Load user's chats
  useEffect(() => {
    const fetchChats = async (isPolling = false) => {
      if (!session?.user?.email) return;

      if (!isPolling) {
        setLoading(true);
      }

      try {
        if (!isPolling) {
          console.log("Fetching chats for user:", session.user.email);
        }
        const response = await fetch("/api/chat");
        if (!isPolling) {
          console.log("Chat API response status:", response.status);
        }

        if (response.ok) {
          const data = await response.json();
          if (!isPolling) {
            console.log("Chat API response data:", data);
          }
          const newChats = data.chats || [];
          setChats(newChats);

          // Calculate and update total unread count
          const totalUnread = calculateTotalUnread(newChats);
          setTotalUnreadCount(totalUnread);
        } else {
          const errorData = await response.json();
          console.error("Chat API error:", errorData);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        if (!isPolling) {
          setLoading(false);
        }
      }
    };

    // Clear any existing chat polling interval
    if (chatPollingIntervalRef.current) {
      clearInterval(chatPollingIntervalRef.current);
    }

    if (session?.user?.email) {
      // Initial fetch
      fetchChats();

      // Set up real-time polling for chats every 5 seconds
      chatPollingIntervalRef.current = setInterval(() => {
        fetchChats(true);
      }, 5000);
    }

    // Cleanup interval on unmount or session change
    return () => {
      if (chatPollingIntervalRef.current) {
        clearInterval(chatPollingIntervalRef.current);
      }
    };
  }, [session]); // Check for chatId in URL params and select that chat
  useEffect(() => {
    const chatId = searchParams.get("chatId");
    if (chatId && chats.length > 0) {
      setSelectedChat(chatId);
      setShowChatList(false);
    }
  }, [searchParams, chats]);

  // Load messages when a chat is selected
  useEffect(() => {
    const fetchMessages = async (isPolling = false) => {
      if (!selectedChat) {
        setMessages([]);
        setLastMessageTime(null);
        return;
      }

      if (!isPolling) {
        setLoadingMessages(true);
      } else {
        setIsPolling(true);
      }

      try {
        const response = await fetch(`/api/chat/${selectedChat}`);
        if (response.ok) {
          const data = await response.json();
          const newMessages = data.messages || [];

          // Update messages
          setMessages(newMessages);

          // Update last message time for polling comparison
          if (newMessages.length > 0) {
            setLastMessageTime(newMessages[newMessages.length - 1].createdAt);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        if (!isPolling) {
          setLoadingMessages(false);
        } else {
          setIsPolling(false);
        }
      }
    };

    // Clear any existing polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    if (selectedChat) {
      // Initial fetch
      fetchMessages();

      // Set up real-time polling every 2 seconds
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(true);
      }, 2000);
    }

    // Cleanup interval on unmount or chat change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update total unread count whenever chats change
  useEffect(() => {
    const total = calculateTotalUnread(chats);
    setTotalUnreadCount(total);
  }, [chats]);

  // Cleanup polling on component unmount
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Chat list menu
      if (openChatListMenu) {
        const menuElement = chatMenuRefs.current[openChatListMenu];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenChatListMenu(null);
        }
      }
      // Chat header menu
      if (openChatHeaderMenu) {
        const headerMenuElement = chatMenuRefs.current["header-menu"]; // Use a fixed key for header
        if (
          headerMenuElement &&
          !headerMenuElement.contains(event.target as Node)
        ) {
          setOpenChatHeaderMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (chatPollingIntervalRef.current) {
        clearInterval(chatPollingIntervalRef.current);
      }
    };
  }, [openChatListMenu, openChatHeaderMenu]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sending) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic update - add message immediately to UI
    const optimisticMessage: Message = {
      id: tempId,
      content: messageContent,
      senderId: session?.user?.email || "",
      senderName: session?.user?.name || "You",
      senderImage: session?.user?.image || undefined,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
      isOwn: true,
      createdAt: new Date().toISOString(),
    };

    // Add optimistic message to UI
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setSending(true);

    try {
      const response = await fetch(`/api/chat/${selectedChat}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
        }),
      });

      if (response.ok) {
        // Force immediate refresh to get the real message from server
        const messagesResponse = await fetch(`/api/chat/${selectedChat}`);
        if (messagesResponse.ok) {
          const data = await messagesResponse.json();
          const newMessages = data.messages || [];
          setMessages(newMessages);

          // Update last message time
          if (newMessages.length > 0) {
            setLastMessageTime(newMessages[newMessages.length - 1].createdAt);
          }
        }

        // Refresh chat list to update last message info
        await refreshChats();
      } else {
        // Remove optimistic message on failure
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        setNewMessage(messageContent); // Restore message content
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setNewMessage(messageContent); // Restore message content
    } finally {
      setSending(false);
      // Keep input focused after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Delete chat functionality
  const handleDeleteChat = async (chatId: string) => {
    setDeletingChatId(chatId);
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh chats to get updated list
        await refreshChats();

        // If the deleted chat was selected, clear selection
        if (selectedChat === chatId) {
          setSelectedChat(null);
          setMessages([]);
        }

        setShowDeleteConfirm(null);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete chat:", errorData.error);
        alert("Failed to delete chat. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Error deleting chat. Please try again.");
    } finally {
      setDeletingChatId(null);
    }
  };

  const confirmDeleteChat = (chatId: string) => {
    setShowDeleteConfirm(chatId);
  };

  const cancelDeleteChat = () => {
    setShowDeleteConfirm(null);
  };

  // Mark chat as read from menu
  const handleMarkAsReadFromMenu = async (chatId: string) => {
    await markChatAsRead(chatId);
    setOpenChatListMenu(null);
  };

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  const handleChatSelect = (chatId: string) => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);

    // Mark chat as read when user opens it
    markChatAsRead(chatId);

    // Change state immediately, CSS will handle the animation
    setSelectedChat(chatId);
    setShowChatList(false); // Hide chat list on mobile when chat is selected

    // Reset animation lock after transition completes
    setTimeout(() => {
      setIsAnimating(false);
      // Focus input after animation completes
      inputRef.current?.focus();
    }, 300); // Match CSS transition duration
  };

  const handleBackToChats = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);

    // Change state immediately, CSS will handle the animation
    setShowChatList(true);
    setSelectedChat(null);

    // Reset animation lock after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Match CSS transition duration
  };

  const handleBackFromMessages = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    // Add a slide-out animation class temporarily
    const container = document.querySelector(".chat-container");
    if (container) {
      container.classList.add("slide-out-right");

      // Navigate back after animation starts
      setTimeout(() => {
        router.back();
      }, 150); // Half of animation duration for smooth transition
    } else {
      // Fallback if no container found
      router.back();
    }
  };

  // Load users for new chat modal
  const loadUsers = async () => {
    if (!session?.user?.email) return;

    setLoadingUsers(true);
    try {
      console.log("Fetching users for new chat modal");
      const response = await fetch("/api/user/all");
      console.log("Users API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Users API response data:", data);
        setUsers(data.users || []);
      } else {
        const errorData = await response.json();
        console.error("Users API error:", errorData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Open new chat modal
  const openNewChatModal = () => {
    setShowNewChatModal(true);
    setError(null);
    setSearchQuery("");
    loadUsers();
  };

  // Start a new chat with a user
  const startNewChat = async (targetUser: User) => {
    if (!session?.user?.email || startingChat) return;

    setStartingChat(true);
    setError(null);

    try {
      const response = await fetch("/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUsername: targetUser.username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh chats using helper function
        await refreshChats();

        // Select the new chat
        setSelectedChat(data.chatId);
        setShowChatList(false);
        setShowNewChatModal(false);
        setSearchQuery(""); // Clear search
      } else {
        setError(data.error || "Failed to start chat");
        console.error("Error starting new chat:", data.error);
      }
    } catch (error) {
      setError("Network error occurred");
      console.error("Error starting new chat:", error);
    } finally {
      setStartingChat(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.email !== session?.user?.email &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-4">Campus Chat</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to access campus chat groups
            and messaging
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/signin")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 md:relative fixed inset-0 md:inset-auto overflow-hidden md:overflow-auto z-10">
      <div className="h-full md:h-screen p-0 md:p-4">
        {/* Chat Interface */}
        <div className="bg-white md:bg-white/70 md:backdrop-blur-xl md:border md:border-white/40 md:rounded-2xl md:shadow-xl overflow-hidden h-full w-full chat-container relative">
          {/* Mobile: Sliding wrapper for both views */}
          <div
            className={`chat-views-wrapper ${
              showChatList ? "show-list" : "show-chat"
            }`}
          >
            {/* Chat List Sidebar */}
            <div className="chat-list-view relative">
              {/* Header */}
              <div className="p-4 border-b border-white/30 relative">
                <div className="flex items-center justify-between">
                  {/* Mobile Back Button */}
                  <button
                    onClick={handleBackFromMessages}
                    className="lg:hidden flex items-center text-gray-900 hover:text-blue-600 transition-colors mr-4"
                  >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="font-medium">Messages</span>
                  </button>

                  {/* Desktop Header */}
                  <h2 className="text-xl font-semibold text-gray-900 items-center hidden lg:flex">
                    <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                    Messages
                  </h2>
                  <div className="relative">
                    <Button
                      onClick={openNewChatModal}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {/* Skeleton loading for chat list */}
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 border-b border-white/20 animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full"></div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div
                                className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"
                                style={{ width: `${60 + Math.random() * 30}%` }}
                              ></div>
                              <div className="w-12 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                            </div>
                            <div
                              className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"
                              style={{ width: `${70 + Math.random() * 25}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : chats.length === 0 ? (
                  <div className="p-4 text-gray-600 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-1">Start a new conversation.</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 border-b border-white/20 hover:bg-white/50 transition-colors group relative ${
                        selectedChat === chat.id
                          ? "bg-white/60 border-r-2 border-r-blue-500"
                          : ""
                      } ${
                        chat.unreadCount > 0
                          ? "bg-blue-50/80 border-l-4 border-l-red-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className="flex items-center flex-1 min-w-0 cursor-pointer pr-2"
                          onClick={() => handleChatSelect(chat.id)}
                        >
                          <div className="relative flex-shrink-0">
                            <Image
                              src={chat.avatar}
                              alt={chat.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {chat.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                            {chat.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-lg border-2 border-white">
                                {chat.unreadCount > 99
                                  ? "99+"
                                  : chat.unreadCount}
                              </span>
                            )}
                          </div>

                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p
                                className={`text-sm text-gray-900 truncate ${
                                  chat.unreadCount > 0
                                    ? "font-bold"
                                    : "font-medium"
                                }`}
                              >
                                {chat.name}
                              </p>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                {chat.lastMessageTime}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <p
                                className={`text-sm truncate flex-1 ${
                                  chat.unreadCount > 0
                                    ? "text-gray-900 font-semibold"
                                    : "text-gray-500"
                                }`}
                              >
                                {chat.lastMessageSender &&
                                  chat.type === "group" &&
                                  `${chat.lastMessageSender}: `}
                                {chat.lastMessage}
                              </p>
                              {chat.type === "group" && (
                                <Users className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1" />
                              )}
                            </div>

                            {chat.type === "group" && chat.participants && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {chat.participants.slice(0, 3).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Three dots menu - Fixed position */}
                        <div
                          className="relative flex-shrink-0"
                          ref={(el) => {
                            chatMenuRefs.current[chat.id] = el;
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenChatListMenu(
                                openChatListMenu === chat.id ? null : chat.id
                              );
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>

                          {/* Dropdown Menu */}
                          {openChatListMenu === chat.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white/95 backdrop-blur-xl border border-white/40 rounded-lg shadow-lg py-1 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsReadFromMenu(chat.id);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                disabled={chat.unreadCount === 0}
                              >
                                <CheckCheck className="h-4 w-4 mr-3 text-green-600" />
                                Mark as Read
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenChatListMenu(null);
                                  confirmDeleteChat(chat.id);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                disabled={deletingChatId === chat.id}
                              >
                                {deletingChatId === chat.id ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-3" />
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="h-4 w-4 mr-3" />
                                    Delete
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="chat-detail-view">
              {selectedChatData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/30 flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Back button for mobile */}
                      <button
                        onClick={handleBackToChats}
                        className="md:hidden text-blue-500 font-bold text-2xl p-2 mr-2"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>{" "}
                      {/* Combined Header for mobile and desktop */}
                      <div className="flex items-center">
                        <div className="relative">
                          <Image
                            src={selectedChatData.avatar}
                            alt={selectedChatData.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {selectedChatData.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {selectedChatData.name}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            {selectedChatData.type === "group"
                              ? `${selectedChatData.participants?.length} members`
                              : selectedChatData.isOnline
                              ? "Online"
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="relative"
                        ref={(el) => {
                          chatMenuRefs.current["header-menu"] = el;
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-blue-600"
                          onClick={() => setOpenChatHeaderMenu((prev) => !prev)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {/* Dropdown Menu for chat header */}
                        {openChatHeaderMenu && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white/95 backdrop-blur-xl border border-white/40 rounded-lg shadow-lg py-1 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedChat) {
                                  handleMarkAsReadFromMenu(selectedChat);
                                }
                                setOpenChatHeaderMenu(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              disabled={selectedChatData?.unreadCount === 0}
                            >
                              <CheckCheck className="h-4 w-4 mr-3 text-green-600" />
                              Mark as Read
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenChatHeaderMenu(false);
                                if (selectedChat) {
                                  confirmDeleteChat(selectedChat);
                                }
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              disabled={deletingChatId === selectedChat}
                            >
                              {deletingChatId === selectedChat ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-3" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-3" />
                                  Delete
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenChatHeaderMenu(false);
                                handleBackToChats();
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <ChevronLeft className="h-4 w-4 mr-3 text-gray-600" />
                              Close Chat
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages - Fill container to bottom, gradient background */}
                  <div
                    className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4"
                    style={{ paddingBottom: "100px" }}
                  >
                    {loadingMessages ? (
                      <div className="space-y-4">
                        {/* Skeleton loading for messages */}
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex ${
                              i % 3 === 0 ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg animate-pulse ${
                                i % 3 === 0
                                  ? "bg-gradient-to-r from-blue-200 to-blue-300"
                                  : "bg-gradient-to-r from-gray-200 to-gray-300"
                              }`}
                              style={{ animationDelay: `${i * 100}ms` }}
                            >
                              <div className="space-y-2">
                                <div
                                  className={`h-3 rounded ${
                                    i % 3 === 0 ? "bg-blue-400" : "bg-gray-400"
                                  } opacity-60`}
                                  style={{
                                    width: `${60 + Math.random() * 40}%`,
                                  }}
                                ></div>
                                {Math.random() > 0.5 && (
                                  <div
                                    className={`h-3 rounded ${
                                      i % 3 === 0
                                        ? "bg-blue-400"
                                        : "bg-gray-400"
                                    } opacity-40`}
                                    style={{
                                      width: `${40 + Math.random() * 30}%`,
                                    }}
                                  ></div>
                                )}
                                <div
                                  className={`h-2 rounded ${
                                    i % 3 === 0 ? "bg-blue-500" : "bg-gray-500"
                                  } opacity-30 mt-2`}
                                  style={{ width: "30%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-600">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn
                                ? "bg-blue-500 text-white"
                                : "bg-white/80 text-gray-900 border border-white/50"
                            }`}
                          >
                            {!message.isOwn &&
                              selectedChatData.type === "group" && (
                                <p className="text-xs font-medium mb-1 opacity-70">
                                  {message.senderName}
                                </p>
                              )}
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.isOwn
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input - Redesigned */}
                  <div
                    className="relative flex items-center justify-center py-4 px-2 md:px-6 bg-transparent"
                    style={{ minHeight: "72px", marginBottom: "24px" }}
                  >
                    <div
                      className="absolute left-0 right-0 mx-auto bottom-6 md:bottom-6 w-full max-w-2xl flex items-center justify-center pointer-events-none"
                      style={{ bottom: "24px" }}
                    >
                      <div className="flex w-full items-center gap-2 pointer-events-auto">
                        <Input
                          ref={inputRef}
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="rounded-full bg-white text-black border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-lg transition-all duration-200 text-base px-6 py-3 flex-1 ml-2 md:ml-0"
                          style={{ fontSize: "16px" }}
                          disabled={sending}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sending}
                          size="sm"
                          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 py-3 flex items-center justify-center shadow-lg mr-2 md:mr-0"
                          style={{ minWidth: "48px", minHeight: "48px" }}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Select a chat to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>{" "}
          {/* Close chat-views-wrapper */}
          {/* New Chat Modal - Positioned inside chat container to avoid layout shifts */}
          {showNewChatModal && (
            <>
              {/* Backdrop - covers the entire chat container */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[55] animate-in fade-in-0 duration-300"
                onClick={() => setShowNewChatModal(false)}
              />

              {/* Modal Container - centered with equal margins */}
              <div className="absolute inset-0 z-[60] flex items-center justify-center p-4">
                <div className="new-chat-modal w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden relative">
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                  {/* Modal Header */}
                  <div className="relative p-6 border-b border-white/30">
                    <div className="flex items-center justify-between">
                      {/* Icon and Title */}
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mr-3">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Start New Chat
                        </h3>
                      </div>
                      <Button
                        onClick={() => setShowNewChatModal(false)}
                        variant="ghost"
                        size="sm"
                        className="glossy-button text-gray-600 hover:text-gray-900 hover:bg-white/50 p-2 h-10 w-10 rounded-full border border-white/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative p-6 border-b border-white/30">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search by name, username, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 focus:bg-white/80 focus:border-blue-300 rounded-xl shadow-sm text-gray-900 placeholder-gray-500"
                        style={{ fontSize: "16px" }}
                        autoFocus
                      />
                    </div>
                    {filteredUsers.length > 0 && (
                      <div className="mt-3 p-2 bg-blue-50/50 backdrop-blur-sm border border-blue-200/50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">
                          Found {filteredUsers.length} user
                          {filteredUsers.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                    {error && (
                      <div className="mt-3 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg">
                        <p className="text-sm text-red-600 font-medium">
                          {error}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Users List */}
                  <div className="max-h-80 overflow-y-auto relative">
                    {loadingUsers ? (
                      <div className="p-6">
                        {/* Enhanced Loading Animation */}
                        <div className="space-y-4">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-4 animate-pulse"
                              style={{
                                animationDelay: `${i * 100}ms`,
                              }}
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-200/50 to-gray-300/50 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-lg w-3/4 mb-2"></div>
                                <div className="h-3 bg-gradient-to-r from-gray-200/30 to-gray-300/30 rounded-lg w-1/2 mb-1"></div>
                                <div className="h-3 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-lg w-2/3"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center text-gray-600 mt-6">
                          <div className="inline-flex items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mr-3"></div>
                            <span className="text-sm font-medium">
                              Loading users...
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-8 text-center text-gray-600">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          No users found
                        </p>
                        {searchQuery ? (
                          <div>
                            <p className="text-sm text-gray-600 mb-4">
                              No users match &ldquo;{searchQuery}
                              &rdquo;
                            </p>
                            <Button
                              onClick={() => setSearchQuery("")}
                              className="glossy-button bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/40 text-blue-600 font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Clear search
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No other users available to chat with
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-4">
                        {filteredUsers.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => startNewChat(user)}
                            className={`glossy-button p-4 rounded-xl cursor-pointer hover:bg-white/60 backdrop-blur-sm transition-all duration-200 mb-3 group border border-transparent hover:border-white/40 hover:shadow-lg ${
                              startingChat
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="relative">
                                <Image
                                  src={
                                    user.image ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      user.name
                                    )}&background=3b82f6&color=ffffff&size=48`
                                  }
                                  alt={user.name}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50 shadow-lg"
                                />
                                {startingChat && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full backdrop-blur-sm">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                                  {user.name}
                                </p>
                                <p className="text-xs text-blue-600 truncate font-semibold">
                                  @{user.username}
                                </p>
                                {user.department && (
                                  <p className="text-xs text-gray-500 truncate mt-1 font-medium">
                                    {user.department} • {user.course}
                                  </p>
                                )}
                              </div>
                              <div className="ml-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                  <MessageCircle className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Chat Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="delete-modal bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

            {/* Content */}
            <div className="relative p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <Trash2 className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Delete Chat
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                Are you sure you want to delete this chat? This action cannot be
                undone and you will lose all messages.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  onClick={cancelDeleteChat}
                  disabled={deletingChatId === showDeleteConfirm}
                  className="glossy-button flex-1 bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/60 text-gray-700 font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteChat(showDeleteConfirm)}
                  disabled={deletingChatId === showDeleteConfirm}
                  className="glossy-button flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  {deletingChatId === showDeleteConfirm ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Chat
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
