"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Car,
  BookOpen,
  Monitor,
  Users,
  Search,
  Filter,
} from "lucide-react";

const categories = [
  {
    id: "all",
    name: "All Discussions",
    icon: MessageCircle,
    color: "text-gray-600",
  },
  { id: "cab", name: "Cab Sharing", icon: Car, color: "text-blue-600" },
  { id: "books", name: "Books", icon: BookOpen, color: "text-green-600" },
  {
    id: "electronics",
    name: "Electronics",
    icon: Monitor,
    color: "text-purple-600",
  },
  { id: "cycle", name: "Cycle Sharing", icon: Users, color: "text-orange-600" },
];

const sampleDiscussions = [
  {
    id: "1",
    title: "Cab to Chandigarh Airport - Friday 6 PM",
    description:
      "Looking for 2-3 people to share cab fare to airport. Departure around 6 PM from main gate. Flight at 9 PM.",
    category: "cab",
    author: "Rahul S.",
    replies: 8,
    lastActivity: "2 hours ago",
    participants: 4,
  },
  {
    id: "2",
    title: "Selling Data Structures and Algorithms Book",
    description:
      "Cormen's Introduction to Algorithms, 3rd edition. Excellent condition, all pages intact. Some highlighting present.",
    category: "books",
    author: "Priya K.",
    replies: 12,
    lastActivity: "4 hours ago",
    participants: 6,
  },
  {
    id: "3",
    title: "Gaming Laptop for Sale - ROG Strix",
    description:
      "ASUS ROG Strix G15, AMD Ryzen 7, RTX 3060, 16GB RAM. Used for 1 year, excellent condition. Price negotiable.",
    category: "electronics",
    author: "Amit R.",
    replies: 15,
    lastActivity: "6 hours ago",
    participants: 8,
  },
  {
    id: "4",
    title: "Cycle sharing for morning classes",
    description:
      "My morning classes start at 8 AM and I have a spare cycle. Anyone interested in borrowing it regularly?",
    category: "cycle",
    author: "Sneha M.",
    replies: 5,
    lastActivity: "1 day ago",
    participants: 3,
  },
];

export default function Discussions() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDiscussions = sampleDiscussions.filter((discussion) => {
    const matchesCategory =
      selectedCategory === "all" || discussion.category === selectedCategory;
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0];
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 poppins-bold">
            Campus Discussions
          </h1>
          <p className="text-gray-800 poppins-regular">
            Share rides, sell items, and discuss everything campus-related
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/30 border-white/40 text-gray-900 placeholder-gray-600"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-white/30 hover:bg-white/40 text-gray-900 border-white/40">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                + New Discussion
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold text-gray-900 mb-4 poppins-semibold">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Discussions List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => {
                const categoryInfo = getCategoryInfo(discussion.category);
                return (
                  <div
                    key={discussion.id}
                    className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl p-6 hover:bg-white/25 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <categoryInfo.icon
                          className={`h-5 w-5 ${categoryInfo.color}`}
                        />
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-100 ${categoryInfo.color}`}
                        >
                          {categoryInfo.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {discussion.lastActivity}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                      {discussion.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {discussion.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>By {discussion.author}</span>
                        <span>•</span>
                        <span>{discussion.participants} participants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{discussion.replies} replies</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredDiscussions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No discussions found
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to start a discussion in this category
                </p>
                <Button>Start New Discussion</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
