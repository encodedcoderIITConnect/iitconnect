"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useSidebar } from "@/hooks/useSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Fixed Header within content area */}
        <div 
          className={`fixed top-0 z-10 bg-blue-900/80 backdrop-blur-xl border-b border-white/20 shadow-lg transition-all duration-300 ${
            isCollapsed ? 'left-0 md:left-16 right-0' : 'left-0 md:left-64 right-0'
          }`}
        >
          <div className="px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-4 sm:py-0 gap-3 sm:gap-0">
              <div className="flex items-center">
                <h1 className="text-lg sm:text-xl font-semibold text-white poppins-semibold">
                  IIT Connect Admin Panel
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-sm text-white/80 hover:text-white transition-colors poppins-regular px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
                >
                  <span className="hidden sm:inline">←</span>
                  <span>Back to App</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-20 sm:pt-24">
          {children}
        </div>
      </main>
    </div>
  );
}
