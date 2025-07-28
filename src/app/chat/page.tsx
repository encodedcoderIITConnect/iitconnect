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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load user's chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!session?.user?.email) return;

      try {
        console.log("Fetching chats for user:", session.user.email);
        const response = await fetch("/api/chat");
        console.log("Chat API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Chat API response data:", data);
          setChats(data.chats || []);
        } else {
          const errorData = await response.json();
          console.error("Chat API error:", errorData);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
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
    const fetchMessages = async () => {
      if (!selectedChat) {
        setMessages([]);
        return;
      }

      setLoadingMessages(true);
      try {
        const response = await fetch(`/api/chat/${selectedChat}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/chat/${selectedChat}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage("");
        // Refresh messages
        const messagesResponse = await fetch(`/api/chat/${selectedChat}`);
        if (messagesResponse.ok) {
          const data = await messagesResponse.json();
          setMessages(data.messages || []);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setShowChatList(false); // Hide chat list on mobile when chat is selected
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
    loadUsers();
  };

  // Start a new chat with a user
  const startNewChat = async (targetUser: User) => {
    if (!session?.user?.email || startingChat) return;

    setStartingChat(true);
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

      if (response.ok) {
        const data = await response.json();
        // Refresh chats
        const chatsResponse = await fetch("/api/chat");
        if (chatsResponse.ok) {
          const chatsData = await chatsResponse.json();
          setChats(chatsData.chats || []);
        }
        // Select the new chat
        setSelectedChat(data.chatId);
        setShowChatList(false);
        setShowNewChatModal(false);
      }
    } catch (error) {
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

                  {/* New Chat Dropdown */}
                  {showNewChatModal && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in-0 duration-200"
                        onClick={() => setShowNewChatModal(false)}
                      />

                      {/* Dropdown */}
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200 origin-top-left scale-in-95">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-white/30 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Start New Chat
                          </h3>
                          <Button
                            onClick={() => setShowNewChatModal(false)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-900 p-1 h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-white/30">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search users..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 bg-white/50 border border-white/30"
                            />
                          </div>
                        </div>

                        {/* Users List */}
                        <div className="max-h-64 overflow-y-auto">
                          {loadingUsers ? (
                            <div className="p-6">
                              {/* Loading Animation */}
                              <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center space-x-3 animate-pulse"
                                  >
                                    <div className="w-10 h-10 bg-gray-300/50 rounded-full"></div>
                                    <div className="flex-1">
                                      <div className="h-4 bg-gray-300/50 rounded w-3/4 mb-2"></div>
                                      <div className="h-3 bg-gray-300/30 rounded w-1/2"></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="text-center text-gray-600 mt-4">
                                <div className="inline-flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                  Loading users...
                                </div>
                              </div>
                            </div>
                          ) : filteredUsers.length === 0 ? (
                            <div className="p-6 text-center text-gray-600">
                              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No users found</p>
                              {searchQuery && (
                                <p className="text-sm mt-1">
                                  Try a different search term
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="p-2">
                              {filteredUsers.map((user) => (
                                <div
                                  key={user._id}
                                  onClick={() => startNewChat(user)}
                                  className={`p-3 rounded-lg cursor-pointer hover:bg-white/50 transition-colors mb-2 ${
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
                                          )}&background=3b82f6&color=ffffff&size=40`
                                        }
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                      {startingChat && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.name}
                                      </p>
                                      <p className="text-xs text-gray-500 truncate">
                                        @{user.username}
                                      </p>
                                      {user.department && (
                                        <p className="text-xs text-gray-400 truncate">
                                          {user.department} • {user.course}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
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
                    onClick={() => handleChatSelect(chat.id)}
                    className={`p-4 border-b border-white/20 cursor-pointer hover:bg-white/50 transition-colors ${
                      selectedChat === chat.id
                        ? "bg-white/60 border-r-2 border-r-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
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
                      <p className="text-sm text-gray-600">
                        {selectedChatData.type === "group"
                          ? `${selectedChatData.participants?.length} members`
                          : selectedChatData.isOnline
                          ? "Online"
                          : "Last seen recently"}
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
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10 bg-white/50 border border-white/30"
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
    </div>
  );
}
