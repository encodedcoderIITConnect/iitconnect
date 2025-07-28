"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Car,
  User,
  Code,
  Home,
  LogOut,
  TrendingUp,
  Activity,
  ExternalLink,
  BookOpen,
  Menu,
  X,
  Search,
  Users,
  Trophy,
} from "lucide-react";

// Extended user type for session
interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  entryNo?: string;
  department?: string;
  academicYear?: string;
}

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Sports", href: "/games", icon: Trophy },
  { name: "Auto Drivers", href: "/drivers", icon: Car },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Discussions", href: "/discussions", icon: Users },
  { name: "Coding", href: "/coding", icon: Code },
];

// Desktop Sidebar Component
export function DesktopSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSignOutConfirm(false);
      }
    };

    if (showSignOutConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSignOutConfirm]);

  const handleSignOut = async () => {
    try {
      // Sign out using NextAuth
      await signOut({
        callbackUrl: "/auth/signin",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleSignOutClick = () => {
    setShowSignOutConfirm(false); // Close the profile menu
    setShowSignOutDialog(true); // Show confirmation dialog
  };

  const confirmSignOut = () => {
    setShowSignOutDialog(false);
    handleSignOut();
  };

  const cancelSignOut = () => {
    setShowSignOutDialog(false);
  };

  return (
    <>
      {/* Sign Out Confirmation Dialog */}
      {showSignOutDialog && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 poppins-semibold">
              Sign Out
            </h3>
            <p className="text-gray-800 mb-6 poppins-regular">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={cancelSignOut}
                className="flex-1 bg-white/30 hover:bg-white/40 text-gray-900 border-white/40"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSignOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-600 to-teal-500 border-r border-white/30 z-40 hidden lg:block">
        <div className="p-6">
          <Link href="/" className="block mb-8">
            <span className="text-2xl font-bold text-white princess-sofia-regular poppins-bold">
              IIT Connect
            </span>
          </Link>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-white/30 text-white backdrop-blur-sm"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              >
                <item.icon className="h-6 w-6 mr-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile Menu */}
          {session && (
            <div className="mt-8">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowSignOutConfirm(!showSignOutConfirm)}
                  className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <Avatar className="h-6 w-6 mr-3">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="text-xs bg-white/30 text-white">
                      {session.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="truncate text-white font-medium">
                      {session.user?.name || "User"}
                    </div>
                    {(session.user as ExtendedUser)?.entryNo && (
                      <div className="truncate text-white/60 text-xs">
                        {(session.user as ExtendedUser).entryNo} •{" "}
                        {(session.user as ExtendedUser).department?.split(
                          " "
                        )[0] || "Unknown"}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu - Positioned Above */}
                {showSignOutConfirm && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setShowSignOutConfirm(false)}
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 whitespace-nowrap"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOutClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 whitespace-nowrap"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Right Sidebar Component
export function RightSidebar() {
  const suggestedStudents = [
    {
      name: "Rahul Sharma",
      entry: "2022CSB1234",
      mutual: "5 mutual connections",
    },
    {
      name: "Priya Patel",
      entry: "2021EEB5678",
      mutual: "3 mutual connections",
    },
    {
      name: "Arjun Singh",
      entry: "2023MEB9101",
      mutual: "8 mutual connections",
    },
  ];

  const trendingDiscussions = [
    { title: "Cab to Delhi Airport", replies: 23 },
    { title: "Selling MacBook Pro", replies: 15 },
    { title: "Game Night this Friday", replies: 42 },
  ];

  const popularDrivers = [
    { name: "Rajesh Kumar", rating: 4.8, trips: 150 },
    { name: "Suresh Yadav", rating: 4.6, trips: 98 },
    { name: "Manoj Singh", rating: 4.9, trips: 203 },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-30 hidden xl:block overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Suggested Students */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Suggested Students
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-700">
              See All
            </button>
          </div>
          <div className="space-y-3">
            {suggestedStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500">{student.entry}</p>
                    <p className="text-xs text-gray-400">{student.mutual}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Discussions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Discussions
            </h3>
          </div>
          <div className="space-y-3">
            {trendingDiscussions.map((discussion, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">
                  {discussion.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {discussion.replies} replies
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Drivers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Car className="h-4 w-4 mr-2" />
              Popular Drivers
            </h3>
          </div>
          <div className="space-y-3">
            {popularDrivers.map((driver, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {driver.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ⭐ {driver.rating} • {driver.trips} trips
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Contact
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              • New post in Games discussion
            </p>
            <p className="text-xs text-gray-600">• Driver rating updated</p>
            <p className="text-xs text-gray-600">• 3 new connections made</p>
            <p className="text-xs text-gray-600">
              • Project collaboration started
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Quick Links
            </h3>
          </div>
          <div className="space-y-2">
            <a
              href="#"
              className="block text-xs text-blue-600 hover:text-blue-700"
            >
              IIT Ropar Website
            </a>
            <a
              href="#"
              className="block text-xs text-blue-600 hover:text-blue-700"
            >
              Academic Calendar
            </a>
            <a
              href="#"
              className="block text-xs text-blue-600 hover:text-blue-700"
            >
              Library Portal
            </a>
            <a
              href="#"
              className="block text-xs text-blue-600 hover:text-blue-700"
            >
              Placement Cell
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2025 IIT Connect
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Made with ❤️ for IIT Ropar
          </p>
        </div>
      </div>
    </div>
  );
}

// Mobile Bottom Navigation
export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showMobileSignOutConfirm, setShowMobileSignOutConfirm] =
    useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMobileMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  const handleMobileSignOut = async () => {
    if (showMobileSignOutConfirm) {
      try {
        // Sign out using NextAuth
        await signOut({
          callbackUrl: "/auth/signin",
          redirect: true,
        });
      } catch (error) {
        console.error("Sign out error:", error);
      }
      setShowMobileSignOutConfirm(false);
    } else {
      setShowMobileSignOutConfirm(true);
    }
  };

  const cancelMobileSignOut = () => {
    setShowMobileSignOutConfirm(false);
  };

  const mobileNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex lg:hidden animate-fadeIn"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          {/* Clickable overlay to close menu */}
          <div
            className="flex-1"
            onClick={() => setShowMobileMenu(false)}
          ></div>

          {/* Menu panel sliding from right */}
          <div
            ref={mobileMenuRef}
            className="bg-gradient-to-b from-blue-600 to-teal-500 w-80 max-w-[85vw] h-full shadow-2xl transform transition-transform duration-300 ease-out"
            style={{
              animation: showMobileMenu
                ? "slideInFromRight 0.3s ease-out"
                : "slideOutToRight 0.3s ease-out",
            }}
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl font-bold text-white">
                  IIT Connect
                </span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform ${
                      pathname === item.href
                        ? "bg-white/30 text-white backdrop-blur-sm scale-105 shadow-lg"
                        : "text-white/90 hover:bg-white/20 hover:text-white hover:scale-105"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: showMobileMenu
                        ? "slideInRight 0.3s ease-out forwards"
                        : "none",
                    }}
                  >
                    <item.icon className="h-6 w-6 mr-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}

                {/* Sign Out Button in Menu */}
                {session && (
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowMobileSignOutConfirm(true);
                    }}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-base font-medium text-white/90 hover:bg-red-500/20 hover:text-white transition-all duration-200 hover:scale-105 mt-4 border-t border-white/20 pt-6"
                    style={{
                      animationDelay: `${navigation.length * 50}ms`,
                      animation: showMobileMenu
                        ? "slideInRight 0.3s ease-out forwards"
                        : "none",
                    }}
                  >
                    <LogOut className="h-6 w-6 mr-4 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Sign out confirmation overlay */}
      {showMobileSignOutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center lg:hidden">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2 poppins-semibold">
              Sign Out
            </h3>
            <p className="text-white/90 mb-4 poppins-regular">
              Are you sure you want to sign out?
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={cancelMobileSignOut}
                className="flex-1 bg-white/30 hover:bg-white/40 text-white border-white/40"
              >
                Cancel
              </Button>
              <Button
                onClick={handleMobileSignOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-teal-500 border-t border-white/30 z-50 lg:hidden">
        <div className="flex">
          {mobileNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 px-1 ${
                pathname === item.href ? "text-white" : "text-white/70"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
              showMobileMenu ? "text-white" : "text-white/70"
            }`}
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}

// Main Navbar component (now just returns null for desktop Instagram layout)
export function Navbar() {
  return null;
}
