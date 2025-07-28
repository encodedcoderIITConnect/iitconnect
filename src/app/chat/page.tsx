"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Users,
  ArrowLeft,
  Plus,
  Search,
  X,
  Trash2,
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
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);
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
  const [lastMessageTime, setLastMessageTime] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper function to refresh chats manually
  const refreshChats = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch("/api/chat");
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
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
          setChats(data.chats || []);
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

  // Cleanup polling on component unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (chatPollingIntervalRef.current) {
        clearInterval(chatPollingIntervalRef.current);
      }
    };
  }, []);

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

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setShowChatList(false); // Hide chat list on mobile when chat is selected
    // Focus input after a short delay to ensure chat is loaded
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleBackToChats = () => {
    setShowChatList(true);
    setSelectedChat(null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      <div className="h-screen p-2 md:p-4">
        {/* Chat Interface */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl overflow-hidden h-full flex">
          {/* Chat List Sidebar - Hidden on mobile when chat is selected */}
          <div
            className={`${
              showChatList ? "flex" : "hidden"
            } md:flex w-full md:w-80 border-r border-white/30 flex-col`}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/30 relative">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                  Chats
                </h2>
                <div className="relative">
                  <Button
                    onClick={openNewChatModal}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  {/* New Chat Modal */}
                  {showNewChatModal && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in-0 duration-200"
                        onClick={() => setShowNewChatModal(false)}
                      />

                      {/* Modal Container - Centered */}
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in-0 duration-300 scale-in-95">
                          {/* Modal Header */}
                          <div className="p-6 border-b border-white/30 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">
                              Start New Chat
                            </h3>
                            <Button
                              onClick={() => setShowNewChatModal(false)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-900 p-2 h-8 w-8 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Search */}
                          <div className="p-6 border-b border-white/30">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Search by name, username, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/70 border border-white/30 focus:bg-white focus:border-blue-300"
                                autoFocus
                              />
                            </div>
                            {filteredUsers.length > 0 && (
                              <p className="text-xs text-gray-500 mt-2">
                                Found {filteredUsers.length} user
                                {filteredUsers.length !== 1 ? "s" : ""}
                              </p>
                            )}
                            {error && (
                              <div className="mt-3 p-3 bg-red-50/80 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                              </div>
                            )}
                          </div>

                          {/* Users List */}
                          <div className="max-h-80 overflow-y-auto">
                            {loadingUsers ? (
                              <div className="p-6">
                                {/* Enhanced Loading Animation */}
                                <div className="space-y-4">
                                  {[...Array(4)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center space-x-3 animate-pulse"
                                      style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                      <div className="w-12 h-12 bg-gray-300/50 rounded-full"></div>
                                      <div className="flex-1">
                                        <div className="h-4 bg-gray-300/50 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-300/30 rounded w-1/2 mb-1"></div>
                                        <div className="h-3 bg-gray-300/20 rounded w-2/3"></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="text-center text-gray-600 mt-6">
                                  <div className="inline-flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
                                    <span className="text-sm">
                                      Loading users...
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : filteredUsers.length === 0 ? (
                              <div className="p-8 text-center text-gray-600">
                                <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                <p className="text-lg font-medium mb-2">
                                  No users found
                                </p>
                                {searchQuery ? (
                                  <div>
                                    <p className="text-sm mb-3">
                                      No users match &ldquo;{searchQuery}&rdquo;
                                    </p>
                                    <Button
                                      onClick={() => setSearchQuery("")}
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-600 border-blue-200"
                                    >
                                      Clear search
                                    </Button>
                                  </div>
                                ) : (
                                  <p className="text-sm">
                                    No other users available to chat with
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="p-3">
                                {filteredUsers.map((user) => (
                                  <div
                                    key={user._id}
                                    onClick={() => startNewChat(user)}
                                    className={`p-4 rounded-xl cursor-pointer hover:bg-blue-50/70 transition-all duration-200 mb-2 group ${
                                      startingChat
                                        ? "opacity-50 pointer-events-none"
                                        : "hover:shadow-sm"
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
                                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                        />
                                        {startingChat && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="ml-4 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                                          {user.name}
                                        </p>
                                        <p className="text-xs text-blue-600 truncate font-medium">
                                          @{user.username}
                                        </p>
                                        {user.department && (
                                          <p className="text-xs text-gray-500 truncate mt-1">
                                            {user.department} • {user.course}
                                          </p>
                                        )}
                                      </div>
                                      <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                          <MessageCircle className="h-4 w-4 text-blue-600" />
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
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-gray-600 text-center">
                  Loading chats...
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
                    className={`p-4 border-b border-white/20 hover:bg-white/50 transition-colors group ${
                      selectedChat === chat.id
                        ? "bg-white/60 border-r-2 border-r-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => handleChatSelect(chat.id)}
                      >
                        <div className="relative">
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
                        </div>

                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {chat.name}
                            </p>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">
                                {chat.lastMessageTime}
                              </span>
                              {chat.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[18px] h-[18px] flex items-center justify-center">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">
                              {chat.lastMessageSender &&
                                chat.type === "group" &&
                                `${chat.lastMessageSender}: `}
                              {chat.lastMessage}
                            </p>
                            {chat.type === "group" && (
                              <Users className="h-4 w-4 text-gray-400 shrink-0 ml-1" />
                            )}
                          </div>

                          {chat.type === "group" && chat.participants && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {chat.participants.slice(0, 3).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delete button - appears on hover */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteChat(chat.id);
                        }}
                        disabled={deletingChatId === chat.id}
                      >
                        {deletingChatId === chat.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area - Full width on mobile when chat is selected */}
          <div
            className={`${
              !showChatList ? "flex" : "hidden"
            } md:flex flex-1 flex-col`}
          >
            {selectedChatData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/30 flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Back button for mobile */}
                    <button
                      onClick={handleBackToChats}
                      className="md:hidden mr-3 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>

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
                          : "Last seen recently"}
                        {isPolling && (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-600">Live</span>
                          </div>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hidden sm:flex"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hidden sm:flex"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-red-600"
                      onClick={() =>
                        selectedChat && confirmDeleteChat(selectedChat)
                      }
                      title="Delete Chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="text-center text-gray-600">
                      Loading messages...
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
                              message.isOwn ? "text-blue-100" : "text-gray-500"
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

                {/* Message Input */}
                <div className="p-3 md:p-4 border-t border-white/30">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hidden sm:flex"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10 bg-white text-black !border-gray-300 focus:!border-gray-300 focus:outline-none focus:ring-0 focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        style={{
                          borderColor: "#d1d5db !important",
                          boxShadow: "none !important",
                          outline: "none !important",
                        }}
                        disabled={sending}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600 hidden sm:flex"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
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
        </div>
      </div>

      {/* Delete Chat Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Chat
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this chat? This action cannot be
              undone and you will lose all messages.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={cancelDeleteChat}
                disabled={deletingChatId === showDeleteConfirm}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleDeleteChat(showDeleteConfirm)}
                disabled={deletingChatId === showDeleteConfirm}
              >
                {deletingChatId === showDeleteConfirm ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Chat"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
