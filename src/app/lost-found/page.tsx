"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Calendar,
  Plus,
  Filter,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: "lost" | "found";
  itemType: string;
  location: string;
  dateReported: string;
  contactInfo: string;
  image?: string;
  isResolved: boolean;
  author: {
    id: string;
    name: string;
    email: string;
    image: string;
    entryNo: string;
    department: string;
  };
}

const itemTypes = [
  { value: "electronics", label: "Electronics", icon: "📱" },
  { value: "books", label: "Books & Stationery", icon: "📚" },
  { value: "clothing", label: "Clothing", icon: "👕" },
  { value: "accessories", label: "Accessories", icon: "⌚" },
  { value: "bags", label: "Bags & Backpacks", icon: "🎒" },
  { value: "keys", label: "Keys & Cards", icon: "🔑" },
  { value: "documents", label: "Documents", icon: "📄" },
  { value: "sports", label: "Sports Equipment", icon: "⚽" },
  { value: "other", label: "Other", icon: "❓" },
];

const locations = [
  "Library",
  "Cafeteria",
  "Main Building",
  "Hostels",
  "Sports Complex",
  "Lecture Halls",
  "Computer Lab",
  "Parking Area",
  "Garden/Campus",
  "Other",
];

export default function LostAndFound() {
  const { data: session } = useSession();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "lost" | "found"
  >("all");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "lost" as "lost" | "found",
    itemType: "other",
    location: "",
    contactInfo: "",
  });
  const [creating, setCreating] = useState(false);

  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "error" | "info";
      timestamp: number;
    }>
  >([]);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-remove toasts after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => Date.now() - toast.timestamp < 4000)
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [toasts]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      message,
      type,
      timestamp: Date.now(),
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchItems = async () => {
    try {
      // For now, we'll use mock data since the API doesn't exist yet
      const mockItems: LostFoundItem[] = [
        {
          id: "1",
          title: "Black iPhone 13 Pro",
          description:
            "Lost my black iPhone 13 Pro near the library. Has a clear case with a small crack on the back.",
          category: "lost",
          itemType: "electronics",
          location: "Library",
          dateReported: new Date().toISOString(),
          contactInfo: "Contact via email or call 9876543210",
          isResolved: false,
          author: {
            id: "1",
            name: "John Doe",
            email: "john@iitrpr.ac.in",
            image: "/api/placeholder/32/32",
            entryNo: "2021CSB1234",
            department: "CSE",
          },
        },
        {
          id: "2",
          title: "Found: Blue Water Bottle",
          description:
            "Found a blue water bottle with 'Alex' written on it near the sports complex.",
          category: "found",
          itemType: "other",
          location: "Sports Complex",
          dateReported: new Date(Date.now() - 86400000).toISOString(),
          contactInfo: "Contact hostel room B-205",
          isResolved: false,
          author: {
            id: "2",
            name: "Jane Smith",
            email: "jane@iitrpr.ac.in",
            image: "/api/placeholder/32/32",
            entryNo: "2022ECB5678",
            department: "ECE",
          },
        },
      ];
      setItems(mockItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      showToast("Failed to load items", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setCreating(true);
    try {
      // For now, we'll just add to local state since API doesn't exist yet
      const newItem: LostFoundItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        dateReported: new Date().toISOString(),
        isResolved: false,
        author: {
          id: session?.user?.email || "",
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          image: session?.user?.image || "",
          entryNo: "2021CSB1234", // This would come from user profile
          department: "CSE", // This would come from user profile
        },
      };

      setItems([newItem, ...items]);
      setFormData({
        title: "",
        description: "",
        category: "lost",
        itemType: "other",
        location: "",
        contactInfo: "",
      });
      setShowCreateForm(false);
      showToast(
        `${
          formData.category === "lost" ? "Lost" : "Found"
        } item posted successfully`,
        "success"
      );
    } catch (error) {
      console.error("Error creating item:", error);
      showToast("Failed to create item", "error");
    } finally {
      setCreating(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesType = filterType === "all" || item.itemType === filterType;

    return matchesSearch && matchesCategory && matchesType && !item.isResolved;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl text-center">
            <Search className="h-16 w-16 text-white/80 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-2">Lost & Found</h1>
            <p className="text-white/80 mb-8">
              Help your fellow students find their lost items
            </p>
            <Button
              onClick={() => (window.location.href = "/auth/signin")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign in to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Lost & Found
                </h1>
                <p className="text-white/80">
                  Help your campus community find their lost items
                </p>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Item
              </Button>
            </div>

            {/* Under Development Notice */}
            <div className="bg-amber-500/20 backdrop-blur-xl border border-amber-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-200 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-100 mb-1">
                    🚧 Under Development
                  </h4>
                  <p className="text-sm text-amber-200/80">
                    Lost & Found feature is currently being developed. Soon
                    you&apos;ll be able to post and search for lost items across
                    campus!
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lost and found items..."
                  className="pl-10 bg-white/50 border-white/30 text-gray-900 placeholder-gray-600"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="bg-white/10 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) =>
                        setFilterCategory(
                          e.target.value as "all" | "lost" | "found"
                        )
                      }
                      className="w-full bg-white/50 border border-white/30 rounded-lg px-3 py-2 text-gray-900"
                    >
                      <option value="all">All Items</option>
                      <option value="lost">Lost Items</option>
                      <option value="found">Found Items</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Item Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full bg-white/50 border border-white/30 rounded-lg px-3 py-2 text-gray-900"
                    >
                      <option value="all">All Types</option>
                      {itemTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        setFilterCategory("all");
                        setFilterType("all");
                        setSearchQuery("");
                      }}
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Item Form */}
        {showCreateForm && (
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Report a Lost or Found Item
              </h2>

              <div className="space-y-4">
                {/* Category Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      setFormData({ ...formData, category: "lost" })
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === "lost"
                        ? "border-red-400 bg-red-500/20 text-white"
                        : "border-white/30 bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    <div className="text-2xl mb-2">😢</div>
                    <div className="font-medium">Lost Item</div>
                    <div className="text-sm opacity-75">I lost something</div>
                  </button>
                  <button
                    onClick={() =>
                      setFormData({ ...formData, category: "found" })
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === "found"
                        ? "border-green-400 bg-green-500/20 text-white"
                        : "border-white/30 bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    <div className="text-2xl mb-2">🎉</div>
                    <div className="font-medium">Found Item</div>
                    <div className="text-sm opacity-75">I found something</div>
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Black iPhone 13 Pro, Blue Water Bottle"
                    className="bg-white/50 border-white/30 text-gray-900 placeholder-gray-600"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Provide detailed description including color, brand, size, distinguishing features, etc."
                    className="bg-white/50 border-white/30 text-gray-900 placeholder-gray-600"
                    rows={3}
                  />
                </div>

                {/* Item Type and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Item Type
                    </label>
                    <select
                      value={formData.itemType}
                      onChange={(e) =>
                        setFormData({ ...formData, itemType: e.target.value })
                      }
                      className="w-full bg-white/50 border border-white/30 rounded-lg px-3 py-2 text-gray-900"
                    >
                      {itemTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Location
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-white/50 border border-white/30 rounded-lg px-3 py-2 text-gray-900"
                    >
                      <option value="">Select location</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Contact Information
                  </label>
                  <Input
                    value={formData.contactInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactInfo: e.target.value })
                    }
                    placeholder="How should people contact you? (phone, email, room number, etc.)"
                    className="bg-white/50 border-white/30 text-gray-900 placeholder-gray-600"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    onClick={() => setShowCreateForm(false)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateItem}
                    disabled={
                      creating ||
                      !formData.title.trim() ||
                      !formData.description.trim()
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {creating ? "Posting..." : "Post Item"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8">
                <Search className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {searchQuery ||
                  filterCategory !== "all" ||
                  filterType !== "all"
                    ? "No items found"
                    : "No items reported yet"}
                </h3>
                <p className="text-white/80 mb-4">
                  {searchQuery ||
                  filterCategory !== "all" ||
                  filterType !== "all"
                    ? "Try adjusting your search or filters"
                    : "Be the first to report a lost or found item"}
                </p>
                {!searchQuery &&
                  filterCategory === "all" &&
                  filterType === "all" && (
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Report First Item
                    </Button>
                  )}
              </div>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden"
              >
                {/* Item Header */}
                <div className="p-6 border-b border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={item.author.image} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {item.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.category === "lost"
                                ? "bg-red-500/20 text-red-200 border border-red-400/30"
                                : "bg-green-500/20 text-green-200 border border-green-400/30"
                            }`}
                          >
                            {item.category === "lost" ? "😢 Lost" : "🎉 Found"}
                          </span>
                          <span className="text-white/70 text-sm">
                            {
                              itemTypes.find((t) => t.value === item.itemType)
                                ?.icon
                            }{" "}
                            {
                              itemTypes.find((t) => t.value === item.itemType)
                                ?.label
                            }
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2">
                          {item.title}
                        </h3>

                        <div className="flex items-center space-x-4 text-sm text-white/70 mb-3">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">
                              {item.author.name}
                            </span>
                            <span>•</span>
                            <span>{item.author.entryNo}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatTime(item.dateReported)}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-white/90 mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        {item.contactInfo && (
                          <div className="bg-white/10 rounded-lg p-3">
                            <p className="text-sm text-white/90">
                              <span className="font-medium">Contact: </span>
                              {item.contactInfo}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions for item owner */}
                    {session?.user?.email === item.author.email && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          Mark as Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl border max-w-sm transform transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-500/90 border-green-400/50 text-white"
                : toast.type === "error"
                ? "bg-red-500/90 border-red-400/50 text-white"
                : "bg-blue-500/90 border-blue-400/50 text-white"
            }`}
          >
            <div className="flex-shrink-0">
              {toast.type === "success" && <CheckCircle className="h-5 w-5" />}
              {toast.type === "error" && <AlertTriangle className="h-5 w-5" />}
              {toast.type === "info" && <AlertTriangle className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
