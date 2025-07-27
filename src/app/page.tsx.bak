"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Plus,
  MoreHorizontal,
  Bookmark,
  Send,
  Search,
  Camera,
} from "lucide-react";

// Sample posts data
const samplePosts = [
  {
    id: "1",
    author: {
      name: "Rahul Sharma",
      entryNo: "2021CSB1234",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isVerified: true,
    },
    content:
      "Looking for someone to share a cab to Chandigarh this Friday evening! Split costs. DM me if interested 🚗",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=800&fit=crop",
    likes: 24,
    comments: 8,
    createdAt: "2024-01-26T14:30:00Z",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    author: {
      name: "Priya Patel",
      entryNo: "2022EEB5678",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face",
      isVerified: false,
    },
    content:
      "Selling my MacBook Pro 2020 in excellent condition. Perfect for coding and design work. Price negotiable! 💻",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
    likes: 156,
    comments: 23,
    createdAt: "2024-01-26T11:30:00Z",
    isLiked: true,
    isSaved: false,
  },
  {
    id: "3",
    author: {
      name: "Arjun Singh",
      entryNo: "2023MEB9101",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      isVerified: true,
    },
    content:
      "Game night this Friday at 8 PM! Bringing FIFA, Call of Duty, and board games. Room 204, Hostel B. Everyone welcome! 🎮",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=800&fit=crop",
    likes: 89,
    comments: 42,
    createdAt: "2024-01-25T20:00:00Z",
    isLiked: false,
    isSaved: true,
  },
  {
    id: "4",
    author: {
      name: "Sneha Patel",
      entryNo: "2021EEB2345",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isVerified: true,
    },
    content:
      "Beautiful sunset from the campus library! Perfect study ambiance 🌅📖 Sometimes you need to take a break and appreciate the little things.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    likes: 89,
    comments: 24,
    createdAt: "2024-01-25T18:30:00Z",
    isLiked: true,
    isSaved: false,
  },
];

export default function Timeline() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState(samplePosts);

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}w`;
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm w-full px-4">
          {/* Instagram-style login design */}
          <div className="mb-8 relative">
            <div className="flex justify-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg transform rotate-12 shadow-lg"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg transform -rotate-6 shadow-lg"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg transform rotate-12 shadow-lg"></div>
            </div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
                <Camera className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 princess-sofia-regular">
            IIT Connect
          </h1>
          <p className="text-gray-600 mb-8">
            Share moments with your campus community
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => (window.location.href = "/auth/signin")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Sign in with Google
            </Button>
            <p className="text-xs text-gray-500">
              Only @iitrpr.ac.in emails allowed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Instagram-like Layout */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent princess-sofia-regular">
              IIT Connect
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2">
                <Plus className="h-6 w-6" />
              </button>
              <button className="p-2">
                <MessageCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {/* Your Story */}
            <div className="flex flex-col items-center space-y-1 flex-shrink-0">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-blue-500 ring-offset-2">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                    {session.user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Plus className="h-3 w-3 text-white" />
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                Your story
              </span>
            </div>

            {/* Other Stories */}
            {samplePosts.slice(0, 6).map((post, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-1 flex-shrink-0"
              >
                <Avatar className="h-16 w-16 ring-2 ring-purple-500 ring-offset-2">
                  <AvatarImage src={post.author.image || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-600 text-center max-w-[60px] truncate font-medium">
                  {post.author.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="pb-20">
          {posts.map((post) => (
            <div key={post.id} className="mb-6">
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.image || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm">
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-sm">
                        {post.author.name}
                      </span>
                      {post.author.isVerified && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2 h-2 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{post.author.entryNo}</span>
                      <span>•</span>
                      <span>{formatTime(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1">
                  <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="aspect-square bg-gray-100">
                  <Image
                    src={post.image}
                    alt="Post content"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="transition-all duration-200 active:scale-125"
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          post.isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-700 hover:text-gray-400"
                        } transition-colors`}
                      />
                    </button>
                    <button className="hover:text-gray-400 transition-colors">
                      <MessageCircle className="h-6 w-6 text-gray-700" />
                    </button>
                    <button className="hover:text-gray-400 transition-colors">
                      <Send className="h-6 w-6 text-gray-700" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleSave(post.id)}
                    className="hover:text-gray-400 transition-colors"
                  >
                    <Bookmark
                      className={`h-6 w-6 ${
                        post.isSaved
                          ? "fill-gray-700 text-gray-700"
                          : "text-gray-700"
                      }`}
                    />
                  </button>
                </div>

                {/* Likes Count */}
                <div className="mb-2">
                  <span className="font-semibold text-sm">
                    {post.likes.toLocaleString()} likes
                  </span>
                </div>

                {/* Post Content */}
                <div className="text-sm leading-relaxed">
                  <span className="font-semibold mr-1">{post.author.name}</span>
                  <span className="text-gray-900">{post.content}</span>
                </div>

                {/* Comments */}
                {post.comments > 0 && (
                  <button className="text-gray-500 text-sm mt-2 font-medium">
                    View all {post.comments} comments
                  </button>
                )}

                {/* Add Comment */}
                <div className="flex items-center space-x-3 mt-3 pt-2 border-t border-gray-100">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                      {session.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                  />
                  <button className="text-blue-500 font-semibold text-sm">
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Load More */}
          <div className="px-4 py-6 text-center">
            <Button variant="outline" className="w-full">
              Load More Posts
            </Button>
          </div>
        </div>

        {/* Bottom Navigation - Instagram Style */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 safe-area-pb">
          <div className="flex items-center justify-around py-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="h-6 w-6 border-2 border-gray-900 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="h-6 w-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Avatar className="h-6 w-6">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                  {session.user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
