"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Navbar, { MobileBottomNav } from "@/components/Navbar";
import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";
import dynamic from "next/dynamic";

const LoginCard = dynamic(() => import("@/components/LoginCard"), {
  ssr: false,
});

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  // List of public routes that don't require authentication
  const publicRoutes = ["/auth/signin"];

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
          <div className="poppins-regular text-gray-900 text-lg">
            <Image
              src="/logo.png"
              alt="IIT Connect Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
          </div>
          <p className="poppins-regular text-gray-900 text-lg text-center mt-5">
            Welcome to IIT Connect!
          </p>
        </div>
      </div>
    );
  }

  // If it's a public route, always show the content without sidebar
  if (isPublicRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  // For protected routes, check if user is authenticated
  if (!session) {
    // Show login page for unauthenticated users on protected routes
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center p-4">
        <LoginCard />
      </div>
    );
  }

  // User is authenticated, show the protected content with sidebar
  const isChat = pathname === "/chat";

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <main className="min-h-screen">{children}</main>
      </div>

      {/* Mobile Bottom Navigation - Hidden on chat page */}
      {!isChat && <MobileBottomNav />}
    </div>
  );
}
