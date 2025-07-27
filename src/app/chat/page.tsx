"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Users,
  UserPlus,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  type: "text" | "image" | "file";
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  type: "direct" | "group";
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  participants?: string[];
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  // Sample chats data
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      name: "General Discussion",
      type: "group",
      avatar:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100",
      lastMessage: "Anyone interested in playing cricket tomorrow?",
      lastMessageTime: "2 min ago",
      unreadCount: 3,
      isOnline: true,
      participants: ["You", "Rahul", "Priya", "Arjun", "+45 others"],
    },
    {
      id: "2",
      name: "Cab Sharing - Delhi",
      type: "group",
      avatar:
        "https://images.unsplash.com/photo-1517094503204-e7dafd81ae76?w=100",
      lastMessage: "I'm going to IGI Airport at 6 AM",
      lastMessageTime: "5 min ago",
      unreadCount: 1,
      isOnline: true,
      participants: ["You", "Vikash", "Sneha", "Rohit", "+12 others"],
    },
    {
      id: "3",
      name: "Rahul Sharma",
      type: "direct",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      lastMessage: "Hey, do you have the assignment notes?",
      lastMessageTime: "10 min ago",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "4",
      name: "Project Team - IIT Connect",
      type: "group",
      avatar:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100",
      lastMessage: "Great work on the profile page!",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      isOnline: false,
      participants: ["You", "Priya", "Arjun", "Sneha"],
    },
    {
      id: "5",
      name: "Coding Club",
      type: "group",
      avatar:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=100",
      lastMessage: "Next coding contest is on Saturday",
      lastMessageTime: "2 hours ago",
      unreadCount: 0,
      isOnline: true,
      participants: ["You", "Vikash", "Rohit", "+23 others"],
    },
    {
      id: "6",
      name: "Priya Patel",
      type: "direct",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100",
      lastMessage: "Thanks for helping with the project!",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      isOnline: false,
    },
  ]);

  // Sample messages for selected chat
  const [messages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey everyone! How's it going?",
      senderId: "user1",
      senderName: "Rahul Sharma",
      timestamp: "10:30 AM",
      type: "text",
      isOwn: false,
    },
    {
      id: "2",
      content: "All good! Just finished my assignment",
      senderId: "current-user",
      senderName: "You",
      timestamp: "10:32 AM",
      type: "text",
      isOwn: true,
    },
    {
      id: "3",
      content: "Anyone free for badminton this evening?",
      senderId: "user2",
      senderName: "Priya Patel",
      timestamp: "10:35 AM",
      type: "text",
      isOwn: false,
    },
    {
      id: "4",
      content: "Count me in! What time?",
      senderId: "current-user",
      senderName: "You",
      timestamp: "10:36 AM",
      type: "text",
      isOwn: true,
    },
    {
      id: "5",
      content: "How about 6 PM at the sports complex?",
      senderId: "user2",
      senderName: "Priya Patel",
      timestamp: "10:37 AM",
      type: "text",
      isOwn: false,
    },
    {
      id: "6",
      content: "Perfect! See you there 👍",
      senderId: "current-user",
      senderName: "You",
      timestamp: "10:38 AM",
      type: "text",
      isOwn: true,
    },
  ]);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
              Chats
            </h1>
            <Button variant="ghost" size="sm">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChat === chat.id
                  ? "bg-blue-50 border-r-2 border-r-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
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
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={selectedChatData.avatar}
                    alt={selectedChatData.name}
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
                  <p className="text-sm text-gray-500">
                    {selectedChatData.type === "group"
                      ? `${selectedChatData.participants?.length} members`
                      : selectedChatData.isOnline
                      ? "Online"
                      : "Last seen recently"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
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
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {!message.isOwn && selectedChatData.type === "group" && (
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
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
