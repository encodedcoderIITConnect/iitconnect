"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  ExternalLink,
  ArrowLeft,
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
}

export default function UserProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const username = params.username as string;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [username]);

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
          {/* Back Arrow - Top Left */}
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
      <div className="container mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="max-w-2xl mx-auto relative">
          {/* Back Arrow - Top Left Corner */}
          <Link href="/">
            <button className="absolute -top-2 -left-2 z-10 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>

          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
            {/* Profile Header */}
            <div className="text-center mb-8">
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
                <p className="text-white/60">Entry No: {userProfile.entryNo}</p>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Academic Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Academic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.department && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/70 mb-1">
                        <Building className="h-4 w-4 mr-2" />
                        Department
                      </div>
                      <div className="text-white font-medium">
                        {userProfile.department}
                      </div>
                    </div>
                  )}

                  {userProfile.course && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/70 mb-1">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Course
                      </div>
                      <div className="text-white font-medium">
                        {userProfile.course}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Information
                </h2>

                <div className="space-y-3">
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

                  {userProfile.phone && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/70 mb-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </div>
                      <div className="text-white font-medium">
                        {userProfile.phone}
                      </div>
                    </div>
                  )}

                  {userProfile.socialLink && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center text-white/70 mb-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Social Link
                      </div>
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
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-6">
                {isOwnProfile ? (
                  <Link href="/profile">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <div className="text-center">
                    <p className="text-white/60 text-sm">
                      Member since{" "}
                      {new Date(userProfile.createdAt).toLocaleDateString()}
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
