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
      day: "numeric",
    });
  };

  const getDepartmentIcon = (department: string) => {
    if (department.toLowerCase().includes("computer")) return "💻";
    if (department.toLowerCase().includes("chemical")) return "⚗️";
    if (department.toLowerCase().includes("civil")) return "🏗️";
    if (department.toLowerCase().includes("electrical")) return "⚡";
    if (department.toLowerCase().includes("mechanical")) return "⚙️";
    return "🎓";
  };

  const getAcademicYear = (entryNo: string) => {
    if (!entryNo) return "";
    const year = entryNo.substring(0, 2);
    return `20${year}`;
  };

  const getSemester = (entryNo: string) => {
    if (!entryNo) return "";
    const year = parseInt(entryNo.substring(0, 2));
    const currentYear = new Date().getFullYear() % 100;
    const yearsPassed = currentYear - year;
    const currentMonth = new Date().getMonth() + 1;

    let semester = yearsPassed * 2;
    if (currentMonth >= 7) {
      semester += 1;
    } else {
      semester += 2;
    }

    return Math.min(semester, 8);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
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

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {user.name}
          </h1>

          {user.entryNo && (
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
              <Hash className="h-5 w-5 text-white/80 mr-2" />
              <span className="text-white font-semibold">{user.entryNo}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 text-white/90">
            {user.department && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="mr-2">
                  {getDepartmentIcon(user.department)}
                </span>
                <span className="text-sm font-medium">{user.department}</span>
              </div>
            )}

            {user.course && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{user.course}</span>
              </div>
            )}

            {user.entryNo && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  Semester {getSemester(user.entryNo)}
                </span>
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
                      onClick={() => setIsEditing(false)}
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
                    onClick={() => setIsEditing(true)}
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

                {/* Email */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-900">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center">
                      {user.isPublicEmail ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="ml-1 text-xs text-gray-500">
                        {user.isPublicEmail ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isPublicEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isPublicEmail: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          Make email visible to other students
                        </span>
                      </label>
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

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />
                  Academic Information
                </h3>

                {/* Entry Number */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Number
                  </label>
                  {isEditing ? (
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        type="text"
                        value={formData.entryNo}
                        onChange={(e) =>
                          setFormData({ ...formData, entryNo: e.target.value })
                        }
                        placeholder="e.g., 24CSZ0009"
                        className="border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Hash className="h-4 w-4 mr-2 text-gray-500" />
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
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        type="text"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        placeholder="Your department"
                        className="border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <span className="font-medium">
                          {user.department || (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </span>
                        {user.department && (
                          <span className="ml-2 text-2xl">
                            {getDepartmentIcon(user.department)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Course */}
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  {isEditing ? (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        type="text"
                        value={formData.course}
                        onChange={(e) =>
                          setFormData({ ...formData, course: e.target.value })
                        }
                        placeholder="B.Tech, M.Tech, Ph.D, etc."
                        className="border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Award className="h-4 w-4 mr-2 text-gray-500" />
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

                {/* Academic Stats */}
                {user.entryNo && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Academic Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 block">
                          Academic Year
                        </span>
                        <span className="font-semibold text-gray-900">
                          {getAcademicYear(user.entryNo)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">
                          Current Semester
                        </span>
                        <span className="font-semibold text-gray-900">
                          {getSemester(user.entryNo)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Join Date */}
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
