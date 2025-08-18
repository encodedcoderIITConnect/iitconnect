"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Plus,
  Trash2,
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

export default function PostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("general");
  const [creating, setCreating] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

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
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setDeletingPostId(postId);
    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the post from the local state
        setPosts(posts.filter((post) => post.id !== postId));
        console.log("Post deleted successfully");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setDeletingPostId(null);
    }
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

  const getCategoryColor = (category: string) => {
    const colors = {
      general: "bg-blue-500/20 text-blue-700 border-blue-200/30",
      cab: "bg-yellow-500/20 text-yellow-700 border-yellow-200/30",
      books: "bg-green-500/20 text-green-700 border-green-200/30",
      electronics: "bg-purple-500/20 text-purple-700 border-purple-200/30",
      games: "bg-red-500/20 text-red-700 border-red-200/30",
      cycling: "bg-orange-500/20 text-orange-700 border-orange-200/30",
      projects: "bg-indigo-500/20 text-indigo-700 border-indigo-200/30",
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p>You need to be signed in to view posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 pb-20 lg:pb-0">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/20 backdrop-blur-xl border-b border-white/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Posts</h1>
            <Button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Create Post Section */}
        {showCreatePost && (
          <div className="p-6 border-b border-white/20">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {session.user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <Textarea
                    value={newPostContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewPostContent(e.target.value)
                    }
                    placeholder="What's on your mind?"
                    className="min-h-[100px] bg-white/50 border-white/30 text-gray-900 placeholder-gray-600"
                  />

                  <div className="flex items-center justify-between">
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="bg-white/50 border border-white/30 rounded-lg px-3 py-2 text-gray-900"
                    >
                      <option value="general">General</option>
                      <option value="cab">Cab Sharing</option>
                      <option value="books">Books</option>
                      <option value="electronics">Electronics</option>
                      <option value="games">Games</option>
                      <option value="cycling">Cycling</option>
                      <option value="projects">Projects</option>
                    </select>

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
                        disabled={creating || !newPostContent.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {creating ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
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
                  No Posts Yet
                </h3>
                <p className="text-white/80 mb-4">
                  Be the first to share something with the community!
                </p>
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create First Post
                </Button>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden"
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
                      {/* Show delete button only if user owns the post */}
                      {session?.user?.email === post.author.email && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletingPostId === post.id}
                          className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                          title="Delete post"
                        >
                          {deletingPostId === post.id ? (
                            <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <button className="p-1 hover:bg-white/10 rounded">
                        <MoreHorizontal className="h-5 w-5 text-white/70" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-white leading-relaxed mb-4">
                    {post.content}
                  </p>

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

                {/* Post Actions */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-white/70 hover:text-white">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm">{post.likes}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-white/70 hover:text-white">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>

                      <button className="text-white/70 hover:text-white">
                        <Send className="h-5 w-5" />
                      </button>
                    </div>

                    <button className="text-white/70 hover:text-white">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
