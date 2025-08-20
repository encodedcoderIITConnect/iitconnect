"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { signIn } from "next-auth/react";
import Navbar, { MobileBottomNav } from "@/components/Navbar";
import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Glossy container with everything inside */}
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl">
            {/* IIT Connect branding */}
            <div className="text-center mb-8">
              <h1 className="poppins-bold text-gray-900 text-3xl mb-2">
                IIT Connect
              </h1>
              <p className="poppins-regular text-gray-900 text-lg">
                The campus network by IIT Ropar student
              </p>
            </div>

            {/* Login form */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="poppins-semibold text-xl text-gray-900 mb-2">
                  Sign in to continue
                </h2>
                <p className="poppins-regular text-gray-800 text-sm">
                  Use your IIT Ropar email to access the platform
                </p>
              </div>

              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="poppins-semibold w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC04"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="text-center text-sm">
                <p className="poppins-regular text-gray-800">
                  Only @iitrpr.ac.in email addresses are allowed
                </p>
              </div>
            </div>
          </div>
        </div>
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
