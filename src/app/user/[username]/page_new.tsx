"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  ExternalLink,
  ArrowLeft,
  Edit3,
  Save,
  Calendar,
  X,
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  entryNo: string;
  phone: string;
  department: string;
  course: string;
  socialLink: string;
  isPublicEmail: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const username = params.username as string;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phone: "",
    socialLink: "",
    entryNo: "",
    department: "",
    course: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/user/profile/${username}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("User not found");
          } else {
            setError("Failed to load user profile");
          }
          return;
        }

        const data = await response.json();
        setUserProfile(data.user);

        // Initialize form data if it's the user's own profile
        if (session?.user?.email === data.user.email) {
          setFormData({
            phone: data.user.phone || "",
            socialLink: data.user.socialLink || "",
            entryNo: data.user.entryNo || "",
            department: data.user.department || "",
            course: data.user.course || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username, session]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
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
        setUserProfile({ ...userProfile!, ...updatedUser });
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading user profile...</div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center relative">
          <Link href="/">
            <button className="absolute -top-8 -left-8 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div className="text-white text-lg mb-4">
            {error || "User not found"}
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.email === userProfile.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Profile Card */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto relative">
          {/* Back Arrow - Top Left Corner */}
          <Link href="/">
            <button className="absolute -top-2 -left-2 z-10 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>

          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-teal-600/20">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white/20">
                  <AvatarImage
                    src={userProfile.image}
                    alt={userProfile.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-purple-600 text-white text-3xl">
                    {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-3xl font-bold text-white mb-2">
                  {userProfile.name}
                </h1>

                <p className="text-white/70 text-lg mb-1">
                  @{userProfile.username}
                </p>

                {userProfile.entryNo && (
                  <p className="text-white/60">
                    Entry No: {userProfile.entryNo}
                  </p>
                )}

                {/* Quick Info Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {userProfile.department && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white/90 text-sm">
                        {userProfile.department}
                      </span>
                    </div>
                  )}
                  {userProfile.course && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white/90 text-sm">
                        {userProfile.course}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isOwnProfile ? "Your Profile" : "Profile Information"}
                  </h2>
                  <p className="text-white/70">
                    {isOwnProfile
                      ? "Manage your personal details"
                      : `Learn more about ${userProfile.name}`}
                  </p>
                </div>

                {/* Edit Button - Only show for own profile */}
                {isOwnProfile && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() => {
                            setIsEditing(false);
                            setError("");
                            setSuccess(null);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-white border-white/30 hover:bg-white/10"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Saving..." : "Save"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsEditing(true);
                          setError("");
                          setSuccess(null);
                        }}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center text-green-400">
                    <div className="mr-3">✅</div>
                    <p className="font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center text-red-400">
                    <div className="mr-3">⚠️</div>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Profile Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Information */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Academic Information
                  </h3>

                  <div className="space-y-4">
                    {/* Department */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/70 mb-1">
                        <Building className="h-4 w-4 mr-2" />
                        Department
                      </div>
                      {isOwnProfile && isEditing ? (
                        <Input
                          value={formData.department}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              department: e.target.value,
                            })
                          }
                          placeholder="Enter your department"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      ) : (
                        <div className="text-white font-medium">
                          {userProfile.department || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* Course */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/70 mb-1">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Course
                      </div>
                      {isOwnProfile && isEditing ? (
                        <Input
                          value={formData.course}
                          onChange={(e) =>
                            setFormData({ ...formData, course: e.target.value })
                          }
                          placeholder="e.g., B.Tech, M.Tech"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      ) : (
                        <div className="text-white font-medium">
                          {userProfile.course || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* Entry Number */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/70 mb-1">
                        <User className="h-4 w-4 mr-2" />
                        Entry Number
                      </div>
                      {isOwnProfile && isEditing ? (
                        <Input
                          value={formData.entryNo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              entryNo: e.target.value,
                            })
                          }
                          placeholder="Enter your entry number"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      ) : (
                        <div className="text-white font-medium">
                          {userProfile.entryNo || "Not specified"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    {/* Email */}
                    {userProfile.isPublicEmail && userProfile.email && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center text-white/70 mb-1">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </div>
                        <div className="text-white font-medium">
                          {userProfile.email}
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {(userProfile.phone || (isOwnProfile && isEditing)) && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center text-white/70 mb-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Phone
                        </div>
                        {isOwnProfile && isEditing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Enter your phone number"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        ) : (
                          <div className="text-white font-medium">
                            {userProfile.phone || "Not provided"}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Social Link */}
                    {(userProfile.socialLink ||
                      (isOwnProfile && isEditing)) && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center text-white/70 mb-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Social Link
                        </div>
                        {isOwnProfile && isEditing ? (
                          <Input
                            value={formData.socialLink}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialLink: e.target.value,
                              })
                            }
                            placeholder="Instagram, LinkedIn, etc."
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        ) : userProfile.socialLink ? (
                          <a
                            href={
                              userProfile.socialLink.startsWith("http")
                                ? userProfile.socialLink
                                : `https://${userProfile.socialLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium underline"
                          >
                            {userProfile.socialLink}
                          </a>
                        ) : (
                          <div className="text-white font-medium">
                            Not provided
                          </div>
                        )}
                      </div>
                    )}

                    {/* Member Since */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/70 mb-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Member Since
                      </div>
                      <div className="text-white font-medium">
                        {formatDate(userProfile.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
