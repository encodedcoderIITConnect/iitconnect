"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
  Plus,
  User,
  MapPin,
  IndianRupee,
  Bike,
  ShoppingBag,
  Calendar,
  Eye,
  AlertTriangle,
} from "lucide-react";

const categories = [
  {
    id: "all",
    name: "All Discussions",
    icon: MessageCircle,
    color: "text-gray-600",
    description: "All campus discussions",
  },
  {
    id: "cab",
    name: "Cab Sharing",
    icon: Car,
    color: "text-blue-600",
    description: "Share rides to airport, railway station, malls",
  },
  {
    id: "books",
    name: "Books & Notes",
    icon: BookOpen,
    color: "text-green-600",
    description: "Buy/sell textbooks, share notes",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Monitor,
    color: "text-purple-600",
    description: "Laptops, phones, gadgets buy/sell",
  },
  {
    id: "cycle",
    name: "Cycle Sharing",
    icon: Bike,
    color: "text-orange-600",
    description: "Bicycle sharing and rentals",
  },
  {
    id: "items",
    name: "Buy/Sell Items",
    icon: ShoppingBag,
    color: "text-pink-600",
    description: "General items marketplace",
  },
];

const sampleDiscussions = [
  {
    id: "1",
    title: "Cab to Chandigarh Airport - Friday 6 PM",
    description:
      "Looking for 2-3 people to share cab fare to airport. Departure around 6 PM from main gate. Flight at 9 PM. Cost will be split equally. Contact me asap!",
    category: "cab",
    author: "Rahul Singh",
    authorEntry: "23CSE045",
    replies: 8,
    views: 45,
    lastActivity: "2 hours ago",
    participants: 4,
    status: "Open",
    location: "Main Gate → CHD Airport",
    price: "₹300/person",
    urgency: "high",
    tags: ["urgent", "airport", "friday"],
  },
  {
    id: "2",
    title: "Data Structures & Algorithms Book - Cormen",
    description:
      "Cormen's Introduction to Algorithms, 3rd edition. Excellent condition, all pages intact. Some highlighting present. Perfect for CSE students. Quick sale needed.",
    category: "books",
    author: "Priya Kumari",
    authorEntry: "22CSE078",
    replies: 12,
    views: 89,
    lastActivity: "4 hours ago",
    participants: 6,
    status: "Available",
    price: "₹2,500",
    originalPrice: "₹4,200",
    condition: "Excellent",
    tags: ["textbook", "cse", "algorithms"],
  },
  {
    id: "3",
    title: "Gaming Laptop - ASUS ROG Strix G15",
    description:
      "ASUS ROG Strix G15, AMD Ryzen 7 5800H, RTX 3060 6GB, 16GB RAM, 512GB SSD. Used for 1 year, excellent condition. All accessories included. Price negotiable.",
    category: "electronics",
    author: "Amit Raj",
    authorEntry: "21EEE032",
    replies: 15,
    views: 156,
    lastActivity: "6 hours ago",
    participants: 8,
    status: "Available",
    price: "₹75,000",
    originalPrice: "₹1,20,000",
    condition: "Like New",
    tags: ["gaming", "laptop", "negotiable"],
  },
  {
    id: "4",
    title: "Morning Classes Cycle Sharing",
    description:
      "My morning classes start at 8 AM and I have a spare Hero cycle. Anyone interested in borrowing it regularly? Small monthly charge for maintenance.",
    category: "cycle",
    author: "Sneha Mishra",
    authorEntry: "23CHE091",
    replies: 5,
    views: 34,
    lastActivity: "1 day ago",
    participants: 3,
    status: "Available",
    price: "₹200/month",
    schedule: "7:30 AM - 5:00 PM",
    tags: ["morning", "regular", "affordable"],
  },
  {
    id: "5",
    title: "iPhone 13 - Mint Condition",
    description:
      "iPhone 13 128GB Blue, bought 8 months ago. Mint condition with original box, charger, and case. Battery health 98%. Reason for sale: upgrading to iPhone 15.",
    category: "electronics",
    author: "Karan Sharma",
    authorEntry: "22MEE056",
    replies: 23,
    views: 203,
    lastActivity: "3 hours ago",
    participants: 12,
    status: "Available",
    price: "₹48,000",
    originalPrice: "₹69,900",
    condition: "Mint",
    tags: ["iphone", "apple", "mint-condition"],
  },
  {
    id: "6",
    title: "Study Group for Algorithms Course",
    description:
      "Looking to form a study group for CS301 - Design and Analysis of Algorithms. We can meet twice a week and solve problems together. All levels welcome!",
    category: "books",
    author: "Divya Patel",
    authorEntry: "23CSE012",
    replies: 7,
    views: 67,
    lastActivity: "5 hours ago",
    participants: 5,
    status: "Forming",
    schedule: "Tue & Thu 7 PM",
    tags: ["study-group", "algorithms", "cse"],
  },
];

export default function Discussions() {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filteredDiscussions = sampleDiscussions.filter((discussion) => {
    const matchesCategory =
      selectedCategory === "all" || discussion.category === selectedCategory;
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views;
      case "replies":
        return b.replies - a.replies;
      case "recent":
      default:
        return (
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
        );
    }
  });

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0];
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-4">Campus Discussions</h1>
          <p className="mb-6">
            Sign in with your @iitrpr.ac.in email to join campus discussions
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4">
              <MessageCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Campus Discussions
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Connect with fellow students • Share rides • Buy/sell items •
            Exchange knowledge
          </p>
        </div>

        {/* Under Development Notice */}
        <div className="mb-8">
          <div className="bg-amber-500/20 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/30 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-200" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-100 mb-2">
                  🚧 Under Development
                </h3>
                <p className="text-amber-200/80">
                  Campus Discussions feature is currently being developed. Soon
                  you&apos;ll be able to create posts for cab sharing,
                  buying/selling items, and connecting with fellow students!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search discussions, tags, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border border-white/30 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/30 border border-white/30 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="replies">Most Replies</option>
              </select>
              <Button className="bg-white/30 hover:bg-white/40 text-gray-900 border border-white/30">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Discussion
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200/50">
                <h3 className="font-bold text-lg text-gray-900">Categories</h3>
                <p className="text-sm text-gray-600 mt-1">Browse by topic</p>
              </div>
              <div className="p-4 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-start space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <category.icon
                      className={`h-5 w-5 mt-0.5 transition-colors ${
                        selectedCategory === category.id
                          ? "text-blue-600"
                          : category.color
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {category.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Discussions List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {sortedDiscussions.map((discussion) => {
                const categoryInfo = getCategoryInfo(discussion.category);
                return (
                  <div
                    key={discussion.id}
                    className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg text-white">
                            <categoryInfo.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-100 ${categoryInfo.color}`}
                            >
                              {categoryInfo.name}
                            </span>
                            {discussion.urgency === "high" && (
                              <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {discussion.lastActivity}
                          </div>
                          <div className="text-xs text-gray-400">
                            <Eye className="inline h-3 w-3 mr-1" />
                            {discussion.views} views
                          </div>
                        </div>
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {discussion.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {discussion.description}
                      </p>

                      {/* Tags */}
                      {discussion.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price and Location */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        {discussion.price && (
                          <div className="flex items-center text-sm font-semibold text-green-600">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {discussion.price}
                            {discussion.originalPrice && (
                              <span className="ml-2 text-gray-400 line-through text-xs">
                                {discussion.originalPrice}
                              </span>
                            )}
                          </div>
                        )}
                        {discussion.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {discussion.location}
                          </div>
                        )}
                        {discussion.schedule && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {discussion.schedule}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span className="font-medium">
                              {discussion.author}
                            </span>
                            <span className="ml-1 text-xs text-gray-400">
                              ({discussion.authorEntry})
                            </span>
                          </div>
                          <span>•</span>
                          <span>{discussion.participants} participants</span>
                          {discussion.condition && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-medium">
                                {discussion.condition}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              discussion.status === "Available"
                                ? "bg-green-100 text-green-700"
                                : discussion.status === "Open"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {discussion.status}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{discussion.replies}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {sortedDiscussions.length === 0 && (
              <div className="text-center py-16 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No discussions found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search terms or browse different categories
                  to find what you&apos;re looking for.
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Discussion
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Active Discussions",
              value: sampleDiscussions.length,
              icon: MessageCircle,
            },
            {
              label: "Total Participants",
              value: sampleDiscussions.reduce(
                (acc, d) => acc + d.participants,
                0
              ),
              icon: Users,
            },
            {
              label: "Items for Sale",
              value: sampleDiscussions.filter(
                (d) => d.category === "electronics" || d.category === "books"
              ).length,
              icon: ShoppingBag,
            },
            {
              label: "Cab Shares",
              value: sampleDiscussions.filter((d) => d.category === "cab")
                .length,
              icon: Car,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-center"
            >
              <stat.icon className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
