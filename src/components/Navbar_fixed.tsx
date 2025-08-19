"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { useSidebar } from "@/hooks/useSidebar";
import {
  MessageCircle,
  Car,
  User,
  LogOut,
  Menu,
  Home,
  BookOpen,
  Trophy,
  GraduationCap,
  Search,
  Users,
  Code,
  Gamepad2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Extended User type for TypeScript
interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  entryNo?: string;
  department?: string;
}

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Clubs", href: "/clubs", icon: Trophy },
  { name: "Departments", href: "/departments", icon: GraduationCap },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Discussions", href: "/discussions", icon: Users },
];

const moreMenuItems = [
  { name: "Coding", href: "/coding", icon: Code },
  { name: "Games", href: "/games", icon: Gamepad2 },
  { name: "Projects", href: "/projects", icon: Calendar },
  { name: "Auto Drivers", href: "/drivers", icon: Car },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const { totalUnreadCount } = useUnreadCount();
  const { isCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSignOutConfirm(false);
      }
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
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

      <div
        className={`fixed left-0 top-0 h-full transition-all duration-300 bg-gradient-to-b from-blue-600 to-teal-500 border-r border-white/30 z-40 hidden lg:block ${
          isCollapsed ? "w-14 sidebar-collapsed" : "w-56"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Fixed header area */}
          <div className="h-20 flex items-center justify-between px-4 py-4">
            {/* Logo area - slides in from right */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isCollapsed ? "w-0 opacity-0" : "w-48 opacity-100"
              }`}
            >
              <Link href="/" className="block whitespace-nowrap">
                <span className="text-2xl font-bold text-white princess-sofia-regular poppins-bold">
                  IIT Connect
                </span>
              </Link>
            </div>

            {/* Toggle button - always visible */}
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-white hover:bg-white/20 p-2 h-8 w-8 rounded-lg transition-colors flex-shrink-0"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation area */}
          <div className="flex-1">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center rounded-lg text-sm font-medium transition-colors min-h-[48px] pl-4 mx-2 ${
                    pathname === item.href
                      ? "bg-white/30 text-white backdrop-blur-sm"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  {/* Fixed icon position - aligned with logo (16px from left) */}
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5" />
                  </div>

                  {/* Text content - slides in from right */}
                  <div
                    className={`transition-all duration-300 overflow-hidden flex items-center justify-between flex-1 ${
                      isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
                    }`}
                  >
                    <span className="whitespace-nowrap pl-2">{item.name}</span>
                    {item.name === "Chat" && totalUnreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-lg mr-3">
                        {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                      </span>
                    )}
                  </div>

                  {/* Collapsed state notification badge */}
                  {isCollapsed &&
                    item.name === "Chat" &&
                    totalUnreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-medium shadow-lg">
                        {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                      </span>
                    )}
                </Link>
              ))}

              {/* User Profile Menu */}
              {session && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowSignOutConfirm(!showSignOutConfirm)}
                    className="w-full flex items-center rounded-lg text-sm font-medium text-white/90 hover:bg-white/20 hover:text-white transition-colors min-h-[48px] pl-4 mx-2"
                    title={
                      isCollapsed
                        ? session.user?.name || "User Profile"
                        : undefined
                    }
                  >
                    {/* Fixed avatar position - aligned with logo (16px from left) */}
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback className="text-xs bg-white/30 text-white">
                          {session.user?.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* User info - slides in from right */}
                    <div
                      className={`transition-all duration-300 overflow-hidden flex-1 text-left ${
                        isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
                      }`}
                    >
                      <div className="pl-2">
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
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showSignOutConfirm && (
                    <div
                      className={`absolute z-50 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-1 dropdown-menu ${
                        isCollapsed
                          ? "left-14 bottom-0 min-w-48"
                          : "bottom-full left-0 right-0 mb-2"
                      }`}
                    >
                      <Link
                        href={`/user/${session?.user?.email?.split("@")[0]}`}
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
              )}

              {/* More Menu */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors min-h-[48px] pl-4 mx-2 ${
                    moreMenuItems.some((item) => pathname === item.href)
                      ? "bg-white/30 text-white backdrop-blur-sm"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                  }`}
                  title={isCollapsed ? "More Options" : undefined}
                >
                  {/* Fixed icon position - aligned with logo (16px from left) */}
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <Menu className="h-5 w-5" />
                  </div>

                  {/* Text content - slides in from right */}
                  <div
                    className={`transition-all duration-300 overflow-hidden flex-1 text-left ${
                      isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
                    }`}
                  >
                    <span className="whitespace-nowrap pl-2">More</span>
                  </div>
                </button>

                {/* More Menu Dropdown */}
                {showMoreMenu && (
                  <div
                    className={`absolute z-50 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-1 dropdown-menu ${
                      isCollapsed
                        ? "left-14 bottom-0 min-w-48"
                        : "bottom-full left-0 right-0 mb-2"
                    }`}
                  >
                    {moreMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setShowMoreMenu(false)}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          pathname === item.href
                            ? "bg-white/30 text-white"
                            : "text-white/90 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
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
      avatar: "/avatars/rahul.jpg",
    },
    {
      name: "Priya Singh",
      entry: "2023EEB5678",
      mutual: "3 mutual connections",
      avatar: "/avatars/priya.jpg",
    },
    {
      name: "Arjun Patel",
      entry: "2022MEB9012",
      mutual: "8 mutual connections",
      avatar: "/avatars/arjun.jpg",
    },
  ];

  return (
    <div className="hidden xl:block fixed right-0 top-0 h-full w-80 bg-white/10 backdrop-blur-xl border-l border-white/20 p-6 z-30">
      <div className="space-y-6">
        {/* Suggested Connections */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Suggested for you
          </h3>
          <div className="space-y-3">
            {suggestedStudents.map((student, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.entry}</p>
                    <p className="text-xs text-gray-500">{student.mutual}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/30 hover:bg-white/40 border-white/40"
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending</h3>
          <div className="space-y-2">
            {[
              "#Convocation2024",
              "#TechFest",
              "#PlacementPrep",
              "#RoparLife",
              "#StudentCouncil",
            ].map((topic, index) => (
              <div
                key={index}
                className="p-2 text-blue-600 hover:bg-white/20 rounded cursor-pointer transition-colors"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
