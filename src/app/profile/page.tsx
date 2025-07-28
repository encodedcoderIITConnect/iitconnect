"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit3,
  Phone,
  ExternalLink,
  Save,
  Calendar,
  Users,
  X,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  image?: string;
  phone?: string;
  socialLink?: string;
  isPublicEmail: boolean;
  entryNo?: string;
  department?: string;
  course?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    socialLink: "",
    entryNo: "",
    department: "",
    course: "",
  });

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFormData({
          username: userData.username || "",
          phone: userData.phone || "",
          socialLink: userData.socialLink || "",
          entryNo: userData.entryNo || "",
          department: userData.department || "",
          course: userData.course || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
        {/* Hero Section Skeleton */}
        <div className="relative pt-20 pb-32">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <div className="mb-8">
              {/* Skeleton Avatar */}
              <div className="w-32 h-32 mx-auto border-4 border-white/50 shadow-2xl rounded-full shimmer-dark"></div>
            </div>

            {/* Skeleton Name */}
            <div className="h-12 w-64 mx-auto mb-2 shimmer-dark rounded"></div>

            {/* Skeleton Email */}
            <div className="h-6 w-48 mx-auto mb-6 shimmer-dark rounded"></div>

            {/* Skeleton Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="h-8 w-32 bg-white/10 backdrop-blur-sm rounded-full shimmer-dark"></div>
              <div className="h-8 w-40 bg-white/10 backdrop-blur-sm rounded-full shimmer-dark"></div>
              <div className="h-8 w-24 bg-white/10 backdrop-blur-sm rounded-full shimmer-dark"></div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="relative -mt-20 max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-8 w-48 shimmer rounded mb-2"></div>
                  <div className="h-4 w-64 shimmer rounded"></div>
                </div>
                <div className="h-10 w-24 shimmer rounded"></div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-6">
              {/* Personal Information Section */}
              <div>
                <div className="h-6 w-40 shimmer rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-4 w-24 shimmer rounded"></div>
                      <div className="h-10 w-full shimmer rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Information Section */}
              <div>
                <div className="h-6 w-48 shimmer rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-4 w-32 shimmer rounded"></div>
                      <div className="h-10 w-full shimmer rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Settings Section */}
              <div>
                <div className="h-6 w-36 shimmer rounded mb-4"></div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="h-5 w-40 shimmer rounded mb-1"></div>
                      <div className="h-4 w-64 shimmer rounded"></div>
                    </div>
                    <div className="h-6 w-12 shimmer rounded"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <div className="h-10 w-20 shimmer rounded"></div>
                <div className="h-10 w-28 shimmer rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p>Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Avatar className="w-32 h-32 mx-auto border-4 border-white/50 shadow-2xl">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl font-bold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {user.name}
          </h1>

          <p className="text-xl text-white/80 mb-6 font-medium">{user.email}</p>

          <div className="flex flex-wrap justify-center gap-4 text-white/90 mb-6">
            {user.entryNo && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-sm font-medium">
                  Entry No: {user.entryNo}
                </span>
              </div>
            )}
            {user.department && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-sm font-medium">{user.department}</span>
              </div>
            )}
            {user.course && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-sm font-medium">{user.course}</span>
              </div>
            )}
            {user.socialLink && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <ExternalLink className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Social Profile</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-20 max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Profile Information
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your personal details and preferences
                </p>
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setError(null);
                      setSuccess(null);
                    }}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mx-8 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-600 mr-3">⚠️</div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mx-8 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-green-600 mr-3">✅</div>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  Personal Information
                </h3>

                {/* Name */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="flex items-center text-gray-900">
                    <span className="font-medium">{user.name}</span>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      From Google
                    </span>
                  </div>
                </div>

                {/* Username */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username (Unique identifier)
                  </label>
                  {isEditing && !user.username ? (
                    <div>
                      <Input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="e.g., john_doe123 (letters, numbers, underscores only)"
                        className="border-gray-300"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Username must be unique and can only contain letters,
                        numbers, and underscores. Once set, it cannot be
                        changed.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <span className="font-medium">
                        {user.username || (
                          <span className="text-gray-500 italic">Not set</span>
                        )}
                      </span>
                      {user.username && (
                        <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          Permanent
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Entry Number */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Number
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.entryNo}
                      onChange={(e) =>
                        setFormData({ ...formData, entryNo: e.target.value })
                      }
                      placeholder="Enter your entry number"
                      className="border-gray-300"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <span className="font-medium">
                        {user.entryNo || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Department */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      placeholder="Enter your department"
                      className="border-gray-300"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <span className="font-medium">
                        {user.department || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Course */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      placeholder="Enter your course (e.g., B.Tech, M.Tech)"
                      className="border-gray-300"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <span className="font-medium">
                        {user.course || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                        className="border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {user.phone || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Link */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Profile
                  </label>
                  {isEditing ? (
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        type="url"
                        value={formData.socialLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socialLink: e.target.value,
                          })
                        }
                        placeholder="Instagram, LinkedIn, etc."
                        className="border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                      {user.socialLink ? (
                        <a
                          href={
                            user.socialLink.startsWith("http")
                              ? user.socialLink
                              : `https://${user.socialLink}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 underline"
                        >
                          {user.socialLink}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Join Date */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Membership Information
                </h3>

                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  {user.updatedAt && user.updatedAt !== user.createdAt && (
                    <div className="mt-2 text-xs text-gray-500">
                      Last updated: {formatDate(user.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
