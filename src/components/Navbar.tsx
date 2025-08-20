"use client";

import Link from "next/link";
import Image from "next/image";
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
  Sidebar,
  Download,
  HelpCircle,
  Mail,
  Info,
  X,
  Building,
  AlertTriangle,
} from "lucide-react";

// Navigation item type
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isSpecial?: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Messages", href: "/chat", icon: MessageCircle },
  { name: "Clubs", href: "/clubs", icon: Trophy },
  { name: "Departments", href: "/departments", icon: GraduationCap },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Discussions", href: "/discussions", icon: Users },
  {
    name: "Join Dev Team",
    href: "/join-dev-team",
    icon: AlertTriangle,
    isSpecial: true,
  },
];

const moreMenuItems = [
  { name: "Download Forms", href: "/download-forms", icon: Download },
  { name: "Auto Drivers", href: "/drivers", icon: Car },
  { name: "Hostels & Guest House", href: "/hostels", icon: Building },
  { name: "HelpDesk", href: "/helpdesk", icon: HelpCircle },
  { name: "Contact Us", href: "/contact", icon: Mail },
  { name: "About Us", href: "/about", icon: Info },
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
  const [textVisible, setTextVisible] = useState(!isCollapsed);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCollapsed) {
      setTextVisible(false);
    } else {
      timer = setTimeout(() => {
        setTextVisible(true);
      }, 200); // delay to match transition
    }

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
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed]);

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
          isCollapsed ? "w-16 sidebar-collapsed" : "w-64"
        }`}
      >
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "px-2 py-6" : "p-6"
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center mb-8" : "justify-between mb-8"
            }`}
          >
            {textVisible && (
              <Link href="/" className="block">
                <Image
                  src="/logo.png"
                  alt="IIT Connect Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </Link>
            )}
            <button
              onClick={toggleSidebar}
              className="flex items-center text-white/90 hover:text-white hover:bg-white/20 px-3 py-3 rounded-lg transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Sidebar className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center ${
                  isCollapsed ? "justify-center px-3 py-3" : "px-3 py-3"
                } rounded-lg text-sm font-medium transition-colors ${
                  item.isSpecial
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : pathname === item.href
                    ? "bg-white/30 text-white backdrop-blur-sm"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={`h-6 w-6 ${!isCollapsed ? "mr-4" : ""} ${
                    item.isSpecial ? "animate-pulse" : ""
                  }`}
                />
                {textVisible && (
                  <>
                    <span
                      className={`flex-1 ${
                        item.isSpecial ? "font-semibold" : ""
                      }`}
                    >
                      {item.name}
                      {item.isSpecial && (
                        <span className="ml-2 text-xs bg-yellow-400 text-red-900 px-2 py-1 rounded-full font-bold animate-pulse">
                          NEW!
                        </span>
                      )}
                    </span>
                    {item.name === "Messages" && totalUnreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-lg ml-2">
                        {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                      </span>
                    )}
                  </>
                )}
                {/* Special badge for join dev team in collapsed state */}
                {isCollapsed && item.isSpecial && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold shadow-lg animate-pulse">
                    !
                  </span>
                )}
                {isCollapsed &&
                  item.name === "Messages" &&
                  totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-medium shadow-lg">
                      {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                    </span>
                  )}
              </Link>
            ))}

            {/* User Profile Menu */}
            {session && (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setShowSignOutConfirm(!showSignOutConfirm)}
                  className={`w-full flex items-center text-left ${
                    isCollapsed ? "justify-center px-3 py-3" : "px-3 py-3"
                  } rounded-lg text-sm font-medium text-white/90 hover:bg-white/20 hover:text-white transition-colors`}
                  title={
                    isCollapsed ? session.user?.name || "User" : "User Profile"
                  }
                >
                  <Avatar className={`h-6 w-6 ${!isCollapsed ? "mr-4" : ""}`}>
                    <AvatarImage
                      src={session.user?.image || "/default-avatar.png"}
                      alt={session.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {session.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {textVisible && (
                    <span className="flex-1 truncate">
                      {session.user?.name}
                    </span>
                  )}
                </button>
                {/* User Dropdown Menu - Positioned right next to the menu item */}
                {showSignOutConfirm && (
                  <div
                    className={`absolute z-50 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-1 dropdown-menu min-w-48 ${
                      isCollapsed
                        ? "left-full bottom-0 ml-2"
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
            <div ref={moreMenuRef} className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`w-full flex items-center relative ${
                  isCollapsed ? "justify-center px-3 py-3" : "px-3 py-3"
                } rounded-lg text-sm font-medium transition-colors text-left ${
                  moreMenuItems.some((item) => pathname === item.href)
                    ? "bg-white/30 text-white backdrop-blur-sm"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
                title={isCollapsed ? "More Options" : undefined}
              >
                <span className="relative inline-block">
                  <Menu className={`h-6 w-6 ${!isCollapsed ? "mr-4" : ""}`} />
                  {/* Blinking red dot for mobile only, overlays the icon */}
                  <span
                    className="absolute z-20 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white animate-blink block md:hidden"
                    style={{
                      top: "-8px",
                      right: "-8px",
                    }}
                  />
                </span>
                {textVisible && <span className="flex-1">More</span>}
              </button>
              {/* More Menu Dropdown - Positioned right next to the menu item */}
              {showMoreMenu && (
                <div
                  className={`absolute z-50 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-1 dropdown-menu min-w-48 ${
                    isCollapsed
                      ? "left-full bottom-0 ml-2"
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

// Desktop Sidebar Component (for AuthGuard compatibility)
export function DesktopSidebar() {
  return <Navbar />;
}

// Mobile Bottom Navigation Component
export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showMobileSignOutConfirm, setShowMobileSignOutConfirm] =
    useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { totalUnreadCount } = useUnreadCount();

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
    { name: "Messages", href: "/chat", icon: MessageCircle },
    {
      name: "Profile",
      href: `/user/${session?.user?.email?.split("@")[0]}`,
      icon: User,
    },
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
            <div className="p-6 h-full overflow-y-auto flex flex-col pb-20">
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

              <nav className="space-y-2 flex-1">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform ${
                      item.isSpecial
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg scale-105"
                        : pathname === item.href
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
                    <item.icon
                      className={`h-6 w-6 mr-4 flex-shrink-0 ${
                        item.isSpecial ? "animate-pulse" : ""
                      }`}
                    />
                    <span
                      className={`truncate flex-1 ${
                        item.isSpecial ? "font-semibold" : ""
                      }`}
                    >
                      {item.name}
                      {item.isSpecial && (
                        <span className="ml-2 text-xs bg-yellow-400 text-red-900 px-2 py-1 rounded-full font-bold animate-pulse">
                          NEW!
                        </span>
                      )}
                    </span>
                    {item.name === "Messages" && totalUnreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-lg ml-2">
                        {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                      </span>
                    )}
                  </Link>
                ))}

                {/* More Menu Items */}
                <div className="border-t border-white/20 pt-4 mt-4">
                  <h3 className="text-white/60 text-sm font-medium px-4 mb-2">
                    More
                  </h3>
                  {moreMenuItems.map((item, index) => (
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
                        animationDelay: `${(navigation.length + index) * 50}ms`,
                        animation: showMobileMenu
                          ? "slideInRight 0.3s ease-out forwards"
                          : "none",
                      }}
                    >
                      <item.icon className="h-6 w-6 mr-4 flex-shrink-0" />
                      <span className="truncate flex-1">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Sign Out Button - Separate from nav for prominence */}
              {session && (
                <div className="pt-4 border-t border-white/20 mb-8">
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowMobileSignOutConfirm(true);
                    }}
                    className="w-full flex items-center px-4 py-4 rounded-xl text-base font-medium text-white bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 hover:scale-105 border border-red-400/30"
                    style={{
                      animationDelay: `${
                        (navigation.length + moreMenuItems.length) * 50
                      }ms`,
                      animation: showMobileMenu
                        ? "slideInRight 0.3s ease-out forwards"
                        : "none",
                    }}
                  >
                    <LogOut className="h-6 w-6 mr-4 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
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
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-teal-500 border-t border-white/30 z-50 lg:hidden pb-safe">
        <div className="flex pb-6">
          {mobileNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-4 px-1 ${
                pathname === item.href ? "text-white" : "text-white/70"
              }`}
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.name === "Messages" && totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-medium shadow-lg">
                    {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                  </span>
                )}
              </div>
              <span className="sr-only">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`flex-1 flex flex-col items-center py-4 px-1 transition-colors ${
              showMobileMenu ? "text-white" : "text-white/70"
            }`}
          >
            <div className="relative">
              <Menu className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse z-10 border-2 border-white"></span>
            </div>
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}
