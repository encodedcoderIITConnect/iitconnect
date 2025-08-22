"use client";

import { signOut } from "next-auth/react";
import { Shield, LogOut, Mail } from "lucide-react";

export default function BlockedPage() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 font-poppins">
            Access Blocked
          </h1>
          <p className="text-red-200 text-lg font-medium">
            You are blocked to access the Platform, Contact Admin
          </p>
        </div>

        {/* Description */}
        <div className="text-gray-300 text-sm space-y-2">
          <p>
            Your account has been temporarily restricted from accessing IIT
            Connect.
          </p>
          <p>
            If you believe this is an error, please contact the administrator
            for assistance.
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-3 text-blue-200">
            <Mail className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium">Contact Admin:</p>
              <p className="text-xs text-gray-300">iitconnect22@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400">
          © 2025 IIT Connect. All rights reserved.
        </p>
      </div>
    </div>
  );
}
