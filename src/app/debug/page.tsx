"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  extractUserInfoFromEmail,
  getCurrentSemester,
  formatDisplayName,
  getDepartmentAbbreviation,
} from "@/lib/userUtils";
import { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  department: string;
  entryNo: string;
  phone: string;
  course: string;
  socialLink: string;
  isPublicEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Extract user info from session
  const extractedInfo =
    session?.user?.email && session?.user?.name
      ? extractUserInfoFromEmail(session.user.email, session.user.name)
      : null;

  // Fetch user profile from API
  useEffect(() => {
    if (session?.user?.email) {
      setLoading(true);
      fetch("/api/user/me")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUserProfile(data);
          }
        })
        .catch((err) => console.error("Error fetching profile:", err))
        .finally(() => setLoading(false));
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Debug Info */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-white mb-4">
            Debug Information
          </h1>

          <div className="space-y-4 text-white">
            <div>
              <strong>Session Status:</strong> {status}
            </div>

            <div>
              <strong>Current URL:</strong>{" "}
              {typeof window !== "undefined" ? window.location.href : "SSR"}
            </div>

            <div>
              <strong>Environment Check:</strong>
              <ul className="ml-4 mt-2">
                <li>NODE_ENV: {process.env.NODE_ENV || "undefined"}</li>
                <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || "undefined"}</li>
                <li>
                  Google Client ID:{" "}
                  {process.env.GOOGLE_CLIENT_ID ? "Set" : "Not Set"}
                </li>
                <li>
                  Google Client Secret:{" "}
                  {process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not Set"}
                </li>
                <li>
                  NextAuth Secret:{" "}
                  {process.env.NEXTAUTH_SECRET ? "Set" : "Not Set"}
                </li>
              </ul>
            </div>

            {session && (
              <div>
                <strong>Session Data:</strong>
                <pre className="bg-black/20 p-4 rounded mt-2 overflow-auto text-sm">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}

            {status === "unauthenticated" && (
              <div>
                <p className="text-yellow-200">
                  Not authenticated. Try signing in.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Extracted User Information */}
        {extractedInfo && (
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Extracted User Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-white">
              <div className="space-y-2">
                <div>
                  <strong>Name:</strong> {extractedInfo.name}
                </div>
                <div>
                  <strong>Email:</strong> {extractedInfo.email}
                </div>
                <div>
                  <strong>Entry No:</strong>{" "}
                  {extractedInfo.entryNo || "Not found"}
                </div>
                <div>
                  <strong>Display Name:</strong>{" "}
                  {formatDisplayName(extractedInfo.name, extractedInfo.entryNo)}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <strong>Department:</strong> {extractedInfo.department}
                </div>
                <div>
                  <strong>Dept. Code:</strong>{" "}
                  {getDepartmentAbbreviation(extractedInfo.department)}
                </div>
                <div>
                  <strong>Course:</strong> {extractedInfo.course}
                </div>
                <div>
                  <strong>Academic Year:</strong> {extractedInfo.academicYear}
                </div>
                {extractedInfo.entryNo && (
                  <div>
                    <strong>Current Semester:</strong>{" "}
                    {getCurrentSemester(extractedInfo.entryNo)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Database User Profile */}
        {session && (
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Database User Profile
            </h2>

            {loading && <div className="text-white">Loading profile...</div>}

            {userProfile && (
              <div className="space-y-4 text-white">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <strong>ID:</strong> {userProfile.id}
                    </div>
                    <div>
                      <strong>Name:</strong> {userProfile.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {userProfile.email}
                    </div>
                    <div>
                      <strong>Entry No:</strong>{" "}
                      {userProfile.entryNo || "Not set"}
                    </div>
                    <div>
                      <strong>Phone:</strong> {userProfile.phone || "Not set"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <strong>Department:</strong>{" "}
                      {userProfile.department || "Not set"}
                    </div>
                    <div>
                      <strong>Course:</strong> {userProfile.course || "Not set"}
                    </div>
                    <div>
                      <strong>Social Link:</strong>{" "}
                      {userProfile.socialLink || "Not set"}
                    </div>
                    <div>
                      <strong>Email Public:</strong>{" "}
                      {userProfile.isPublicEmail ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>Created:</strong>{" "}
                      {new Date(userProfile.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <strong>Profile Image:</strong>
                  {userProfile.image && (
                    <Image
                      src={userProfile.image}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="rounded-full mt-2"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
