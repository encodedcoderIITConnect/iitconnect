"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Plus,
  Trash2,
  User,
  Calendar,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface BlockedUser {
  email: string;
  blockedBy: string;
  blockedAt: Date;
  reason?: string;
  isActive: boolean;
}

export default function BlockedUsersManager() {
  const { data: session } = useSession();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newReason, setNewReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch("/api/admin/blocked-users");
      if (response.ok) {
        const data = await response.json();
        setBlockedUsers(data);
      }
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      setFeedback({ type: "error", message: "Please enter an email address" });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsBlocking(true);

    try {
      const response = await fetch("/api/admin/blocked-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail.trim(),
          reason: newReason.trim() || "No reason provided",
        }),
      });

      if (response.ok) {
        setFeedback({ type: "success", message: "User blocked successfully" });
        setNewEmail("");
        setNewReason("");
        setIsDropdownOpen(false);
        fetchBlockedUsers();
      } else {
        const error = await response.json();
        setFeedback({
          type: "error",
          message: error.error || "Failed to block user",
        });
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      setFeedback({ type: "error", message: "Network error occurred" });
    } finally {
      setIsBlocking(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleUnblockUser = async (email: string) => {
    try {
      const response = await fetch("/api/admin/blocked-users/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setFeedback({
          type: "success",
          message: "User unblocked successfully",
        });
        fetchBlockedUsers();
      } else {
        const error = await response.json();
        setFeedback({
          type: "error",
          message: error.error || "Failed to unblock user",
        });
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      setFeedback({ type: "error", message: "Network error occurred" });
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  if (!session?.user?.email) {
    return (
      <div className="text-center py-8">
        <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 font-poppins">
          Please sign in to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Blocked Users Management
        </h2>
        <p className="text-blue-200 text-sm sm:text-base">
          Manage users who are blocked from accessing the platform
        </p>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`p-4 rounded-lg border ${
            feedback.type === "success"
              ? "bg-green-500/20 border-green-400/30 text-green-100"
              : "bg-red-500/20 border-red-400/30 text-red-100"
          }`}
        >
          <p className="text-sm sm:text-base">{feedback.message}</p>
        </div>
      )}

      {/* Add Blocked User Dropdown */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 sm:p-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] font-medium"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Block New User</span>
          </div>
          {isDropdownOpen ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {isDropdownOpen && (
          <form onSubmit={handleBlockUser} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address to block"
                className="w-full p-3 sm:p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent text-sm sm:text-base"
                disabled={isBlocking}
              />
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-white mb-2"
              >
                Reason (Optional)
              </label>
              <input
                type="text"
                id="reason"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Reason for blocking (optional)"
                className="w-full p-3 sm:p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent text-sm sm:text-base"
                disabled={isBlocking}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={isBlocking || !newEmail.trim()}
                className="flex-1 flex items-center justify-center gap-2 p-3 sm:p-4 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 disabled:from-gray-500/50 disabled:to-gray-600/50 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 font-medium text-sm sm:text-base"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                {isBlocking ? "Blocking..." : "Block User"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setNewEmail("");
                  setNewReason("");
                }}
                className="flex-1 sm:flex-none p-3 sm:p-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Blocked Users List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2 sm:gap-3">
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          Currently Blocked Users ({blockedUsers.length})
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2 text-sm sm:text-base">
              Loading blocked users...
            </p>
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-300 text-sm sm:text-base">
              No users are currently blocked.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {blockedUsers.map((user) => (
              <div
                key={user.email}
                className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <User className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="font-medium text-white text-sm sm:text-base break-all">
                        {user.email}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs sm:text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>
                          Blocked:{" "}
                          {new Date(user.blockedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                        <span className="break-words">
                          Blocked by: {user.blockedBy}
                        </span>
                      </div>
                      {user.reason && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 flex-shrink-0">
                            Reason:
                          </span>
                          <span className="break-words">{user.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnblockUser(user.email)}
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-green-500/80 to-green-600/80 hover:from-green-500 hover:to-green-600 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] font-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Unblock</span>
                    <span className="sm:hidden">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
