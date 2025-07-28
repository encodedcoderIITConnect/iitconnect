"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  MoreHorizontal,
  Camera,
  Trash2,
  Plus,
  Edit3,
  X,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

interface Post {
  id: string;
  content: string;
  image?: string;
  category: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image: string;
    entryNo: string;
    department: string;
    isVerified: boolean;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

export default function Timeline() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("general");
  const [creating, setCreating] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "error" | "info";
      timestamp: number;
    }>
  >([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId && !(event.target as Element).closest(".relative")) {
        setOpenDropdownId(null);
      }
      if (
        showCategoryDropdown &&
        !(event.target as Element).closest(".relative")
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId, showCategoryDropdown]);

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

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
    setOpenDropdownId(null);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    setDeletingPostId(postToDelete);
    try {
      const response = await fetch(`/api/posts?id=${postToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the post from the local state
        setPosts(posts.filter((post) => post.id !== postToDelete));
        showToast("Post deleted successfully", "success");
        console.log("Post deleted successfully");
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to delete post", "error");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("Failed to delete post", "error");
    } finally {
      setDeletingPostId(null);
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => {
    setShowDeleteDialog(false);
    setPostToDelete(null);
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
    setOpenDropdownId(null);
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? { ...post, content: updatedPost.content }
              : post
          )
        );
        setEditingPostId(null);
        setEditContent("");
        showToast("Post updated successfully", "success");
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to update post", "error");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      showToast("Failed to update post", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent("");
  };

  const toggleDropdown = (postId: string) => {
    setOpenDropdownId(openDropdownId === postId ? null : postId);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newPostContent,
          category: newPostCategory,
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setNewPostContent("");
        setNewPostCategory("general");
        setShowCreatePost(false);
        showToast("Post created successfully", "success");
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to create post", "error");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("Failed to create post", "error");
    } finally {
      setCreating(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: "bg-blue-500/20 text-blue-700 border-blue-200/30",
      cab: "bg-yellow-500/20 text-yellow-700 border-yellow-200/30",
      books: "bg-green-500/20 text-green-700 border-green-200/30",
      electronics: "bg-purple-500/20 text-purple-700 border-purple-200/30",
      games: "bg-red-500/20 text-red-700 border-red-200/30",
      cycling: "bg-orange-500/20 text-orange-700 border-orange-200/30",
      lost: "bg-red-500/20 text-red-700 border-red-200/30",
      found: "bg-green-500/20 text-green-700 border-green-200/30",
      projects: "bg-indigo-500/20 text-indigo-700 border-indigo-200/30",
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const categories = [
    { value: "general", label: "General", icon: "💬" },
    { value: "cab", label: "Cab Sharing", icon: "🚗" },
    { value: "books", label: "Books", icon: "📚" },
    { value: "electronics", label: "Electronics", icon: "📱" },
    { value: "games", label: "Games", icon: "🎮" },
    { value: "cycling", label: "Cycling", icon: "🚴" },
    { value: "lost", label: "Lost Items", icon: "😢" },
    { value: "found", label: "Found Items", icon: "🎉" },
    { value: "projects", label: "Projects", icon: "💻" },
  ];

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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mb-8 relative">
              <div className="flex justify-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg transform rotate-12 shadow-lg"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg transform -rotate-6 shadow-lg"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg transform rotate-12 shadow-lg"></div>
              </div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center">
                  <Camera className="h-6 w-6 text-gray-900" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              IIT Connect
            </h1>
            <p className="text-gray-800 mb-8">Your campus community platform</p>

            <div className="space-y-4">
              <Button
                onClick={() => (window.location.href = "/auth/signin")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign in with Google
              </Button>
              <p className="text-xs text-gray-800">
                Only @iitrpr.ac.in emails allowed
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      <div className="max-w-2xl mx-auto">
        {/* Create Post Section */}
        <div className="p-6 border-b border-white/20 relative z-50">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {session.user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                {!showCreatePost ? (
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="w-full text-left bg-white/50 rounded-lg px-4 py-3 text-gray-600 hover:bg-white/60 transition-colors focus:outline-none focus:ring-0 border-0"
                  >
                    What&apos;s on your mind?
                  </button>
                ) : (
                  <>
                    <Textarea
                      value={newPostContent}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNewPostContent(e.target.value)
                      }
                      placeholder="What's on your mind?"
                      className="min-h-[100px] bg-white/50 text-gray-900 placeholder-gray-600 border-0 focus:ring-0 focus:outline-none resize-none rounded-lg !border-none"
                      style={{
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                      }}
                      maxLength={1000}
                    />

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {/* Custom Category Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowCategoryDropdown(!showCategoryDropdown)
                            }
                            className="bg-white/60 hover:bg-white/70 border border-white/40 rounded-xl px-4 py-2.5 text-gray-800 flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm shadow-lg min-w-[140px]"
                          >
                            <span className="text-lg">
                              {
                                categories.find(
                                  (cat) => cat.value === newPostCategory
                                )?.icon
                              }
                            </span>
                            <span className="font-medium">
                              {
                                categories.find(
                                  (cat) => cat.value === newPostCategory
                                )?.label
                              }
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                                showCategoryDropdown ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {showCategoryDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] border border-white/30 rounded-xl shadow-2xl z-[9999] overflow-hidden backdrop-blur-3xl bg-white/10">
                              {/* Background blur layer */}
                              <div
                                className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-xl"
                                style={{
                                  filter: "blur(0.5px)",
                                  backdropFilter: "saturate(180%) blur(20px)",
                                  WebkitBackdropFilter:
                                    "saturate(180%) blur(20px)",
                                }}
                              />
                              {/* Frosted glass effect */}
                              <div
                                className="absolute inset-0 bg-white/5 rounded-xl"
                                style={{
                                  backdropFilter: "blur(40px) saturate(150%)",
                                  WebkitBackdropFilter:
                                    "blur(40px) saturate(150%)",
                                  background:
                                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)",
                                }}
                              />
                              <div className="relative z-10 bg-black/10 backdrop-blur-xl rounded-xl">
                                {categories.map((category) => (
                                  <button
                                    key={category.value}
                                    onClick={() => {
                                      setNewPostCategory(category.value);
                                      setShowCategoryDropdown(false);
                                    }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/20 transition-all duration-200 border-b border-white/10 last:border-b-0 backdrop-blur-sm ${
                                      newPostCategory === category.value
                                        ? "bg-white/25 shadow-inner"
                                        : ""
                                    }`}
                                  >
                                    <span className="text-lg drop-shadow-lg filter contrast-125">
                                      {category.icon}
                                    </span>
                                    <span className="font-medium text-black drop-shadow-lg filter contrast-125">
                                      {category.label}
                                    </span>
                                    {newPostCategory === category.value && (
                                      <CheckCircle className="h-4 w-4 text-blue-600 ml-auto drop-shadow-lg" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <span
                          className={`text-sm ${
                            newPostContent.length > 900
                              ? "text-red-600 font-semibold"
                              : newPostContent.length > 800
                              ? "text-orange-600"
                              : "text-gray-600"
                          }`}
                        >
                          {newPostContent.length}/1000
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setShowCreatePost(false)}
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreatePost}
                          disabled={
                            creating ||
                            !newPostContent.trim() ||
                            newPostContent.length > 1000
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {creating ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="px-6 py-4 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8">
                <MessageCircle className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Welcome to IIT Connect!
                </h3>
                <p className="text-white/80 mb-4">
                  Start connecting with your campus community by creating your
                  first post above.
                </p>
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.image} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">
                            {post.author.name}
                          </span>
                          {post.author.isVerified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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

                        <div className="flex items-center space-x-2 text-sm text-white/70">
                          {post.author.entryNo && (
                            <>
                              <span>{post.author.entryNo}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatTime(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                          post.category
                        )}`}
                      >
                        {post.category}
                      </span>
                      {/* Show dropdown only if user owns the post */}
                      {session?.user?.email === post.author.email && (
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(post.id)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <MoreHorizontal className="h-5 w-5 text-white/70" />
                          </button>

                          {openDropdownId === post.id && (
                            <div className="absolute right-0 top-8 bg-white/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-10 min-w-[120px]">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  disabled={deletingPostId === post.id}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                  {deletingPostId === post.id ? (
                                    <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                  )}
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  {editingPostId === post.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-white/50 resize-none"
                        rows={4}
                        placeholder="What's on your mind?"
                        maxLength={1000}
                      />
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm ${
                            editContent.length > 900
                              ? "text-red-300 font-semibold"
                              : editContent.length > 800
                              ? "text-orange-300"
                              : "text-white/70"
                          }`}
                        >
                          {editContent.length}/1000
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white/70 hover:bg-white/10"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSaveEdit(post.id)}
                            size="sm"
                            disabled={editContent.length > 1000}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  )}

                  {post.image && (
                    <div className="rounded-lg overflow-hidden mb-4">
                      <Image
                        src={post.image}
                        alt="Post content"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Post
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={cancelDeletePost}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDeletePost}
                    disabled={deletingPostId === postToDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deletingPostId === postToDelete ? (
                      <>
                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      "Delete Post"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
