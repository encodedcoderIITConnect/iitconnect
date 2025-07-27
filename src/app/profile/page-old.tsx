"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit3,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Hash,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  Calendar,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Users,
  Check,
  X,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  entryNo?: string;
  phone?: string;
  department?: string;
  course?: string;
  socialLink?: string;
  isPublicEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    entryNo: "",
    phone: "",
    department: "",
    course: "",
    socialLink: "",
    isPublicEmail: true,
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
          entryNo: userData.entryNo || "",
          phone: userData.phone || "",
          department: userData.department || "",
          course: userData.course || "",
          socialLink: userData.socialLink || "",
          isPublicEmail: userData.isPublicEmail ?? true,
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
        // Note: Name updates are not needed since name comes from Google account
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getDepartmentIcon = (department: string) => {
    const icons: { [key: string]: string } = {
      "Computer Science": "💻",
      Electrical: "⚡",
      Mechanical: "⚙️",
      Civil: "🏗️",
      Chemical: "🧪",
      Metallurgy: "🔬",
      Mathematics: "📊",
      Physics: "🔬",
      Chemistry: "⚗️",
    };
    return icons[department] || "🎓";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Unable to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500">
      {/* Header Section */}
      <div className="bg-white/20 backdrop-blur-xl border-b border-white/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32 border-4 border-white/50 shadow-lg">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1">
              <div className="mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  {user.entryNo && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Hash className="h-4 w-4 mr-1" />
                      {user.entryNo}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {user._count?.posts || userPosts.length}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {userPosts.reduce((sum, post) => sum + post.likes, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {userPosts.reduce((sum, post) => sum + post.comments, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {user.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="break-all">{user.email}</span>
                    {!user.isPublicEmail && (
                      <EyeOff className="h-4 w-4 ml-2 text-gray-400" />
                    )}
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {user.phone}
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span className="mr-2">
                      {getDepartmentIcon(user.department)}
                    </span>
                    {user.department}
                  </div>
                )}
                {user.course && (
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {user.course}
                  </div>
                )}
                {user.socialLink && (
                  <div className="flex items-center text-gray-600">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <a
                      href={
                        user.socialLink.startsWith("http")
                          ? user.socialLink
                          : `https://${user.socialLink}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 break-all"
                    >
                      Social Profile
                    </a>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-1">
            {/* Profile Completion Notice */}
            {(!user.entryNo ||
              !user.phone ||
              !user.department ||
              !user.course) &&
              !isEditing && (
                <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-xl border border-yellow-200/50 rounded-2xl p-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-yellow-100 rounded-full p-2 mr-3">
                      <Edit3 className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800 mb-1">
                        Complete Your Profile
                      </h3>
                      <p className="text-xs text-yellow-700 mb-3">
                        Add more details to help others connect with you better.
                      </p>
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 poppins-semibold">
                Profile Details
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  {/* Name - Read Only */}
                  <div className="p-3 bg-gray-50/50 rounded-lg border">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name (from Google Account)
                    </label>
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm">{user.name}</span>
                      <span className="ml-2 text-xs text-gray-400 italic">
                        (Cannot be changed)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entry Number
                    </label>
                    <Input
                      value={formData.entryNo}
                      onChange={(e) =>
                        setFormData({ ...formData, entryNo: e.target.value })
                      }
                      placeholder="e.g., 2022CSB1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <Input
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course
                    </label>
                    <Input
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      placeholder="e.g., B.Tech, M.Tech, PhD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Social Link
                    </label>
                    <Input
                      value={formData.socialLink}
                      onChange={(e) =>
                        setFormData({ ...formData, socialLink: e.target.value })
                      }
                      placeholder="LinkedIn, GitHub, Instagram, etc."
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Public Email
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Allow others to see your email
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isPublicEmail: !formData.isPublicEmail,
                        })
                      }
                      className={`${
                        formData.isPublicEmail
                          ? "text-green-600 hover:text-green-700"
                          : "text-gray-500 hover:text-gray-600"
                      }`}
                    >
                      {formData.isPublicEmail ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Email */}
                  <div className="p-3 bg-white/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Email
                      </span>
                      {!user.isPublicEmail && (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    {user.isPublicEmail ||
                    session?.user?.email === user.email ? (
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="break-all text-sm">{user.email}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Email is private
                      </p>
                    )}
                  </div>

                  {/* Entry Number */}
                  {user.entryNo ? (
                    <div className="p-3 bg-white/30 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Entry Number
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Hash className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm font-mono">
                          {user.entryNo}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Entry Number
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        Not provided
                      </p>
                    </div>
                  )}

                  {/* Phone */}
                  {user.phone ? (
                    <div className="p-3 bg-white/30 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Phone
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Phone
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        Not provided
                      </p>
                    </div>
                  )}

                  {/* Department */}
                  {user.department ? (
                    <div className="p-3 bg-white/30 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Department
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="mr-2 text-lg">
                          {getDepartmentIcon(user.department)}
                        </span>
                        <span className="text-sm">{user.department}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Department
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        Not provided
                      </p>
                    </div>
                  )}

                  {/* Course */}
                  {user.course ? (
                    <div className="p-3 bg-white/30 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Course
                      </div>
                      <div className="flex items-center text-gray-700">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">{user.course}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Course
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        Not provided
                      </p>
                    </div>
                  )}

                  {/* Social Link */}
                  {user.socialLink ? (
                    <div className="p-3 bg-white/30 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Social Profile
                      </div>
                      <div className="flex items-center text-gray-700">
                        <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                          href={
                            user.socialLink.startsWith("http")
                              ? user.socialLink
                              : `https://${user.socialLink}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 break-all text-sm hover:underline"
                        >
                          {user.socialLink.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Social Profile
                      </div>
                      <p className="text-sm text-gray-400 italic">
                        Not provided
                      </p>
                    </div>
                  )}

                  {/* Join Date */}
                  <div className="p-3 bg-white/30 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Member Since
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  {user.updatedAt && user.updatedAt !== user.createdAt && (
                    <div className="p-3 bg-white/30 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Last Updated
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(user.updatedAt)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl">
              <div className="p-6 border-b border-white/30">
                <h2 className="text-lg font-semibold text-gray-900 poppins-semibold">
                  Recent Posts
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {user._count?.posts || userPosts.length} posts published
                </p>
              </div>

              <div className="divide-y divide-white/20">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 backdrop-blur-sm border border-blue-200/30 capitalize">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-900 mb-4 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-red-400" />
                        <span className="font-medium">{post.likes}</span> likes
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-blue-400" />
                        <span className="font-medium">
                          {post.comments}
                        </span>{" "}
                        comments
                      </div>
                    </div>
                  </div>
                ))}

                {userPosts.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <div className="bg-white/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      Start sharing with the IIT Ropar community!
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Posts will appear here once you create them
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
