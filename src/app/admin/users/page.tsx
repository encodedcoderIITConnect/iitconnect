"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Users as UsersIcon,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  MessageCircle,
  Shield,
  ShieldOff,
  Download,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  //   Phone,
  Building,
  //   GraduationCap,
  //   ExternalLink,
  //   Eye,
  //   EyeOff,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface UserData {
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
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersManagementPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [actionLoadingUserId, setActionLoadingUserId] = useState<string | null>(
    null
  );

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    department: "",
    course: "",
    phone: "",
    socialLink: "",
    isPublicEmail: true,
  });
  const [editSaving, setEditSaving] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const USERS_PER_PAGE = 16;

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("adminUsersViewMode");
    if (savedView === "card" || savedView === "table") {
      setViewMode(savedView);
    }
  }, []);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const search = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.username?.toLowerCase().includes(search) ||
        user.entryNo?.toLowerCase().includes(search) ||
        user.department?.toLowerCase().includes(search) ||
        user.course?.toLowerCase().includes(search)
    );
  }, [users, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle view mode change
  const handleViewModeChange = (mode: "card" | "table") => {
    setViewMode(mode);
    localStorage.setItem("adminUsersViewMode", mode);
  };

  // Handle Edit
  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      department: user.department || "",
      course: user.course || "",
      phone: user.phone || "",
      socialLink: user.socialLink || "",
      isPublicEmail: user.isPublicEmail ?? true,
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingUser) return;

    setEditSaving(true);
    try {
      const response = await fetch("/api/admin/users/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editingUser.email,
          ...editFormData,
        }),
      });

      if (response.ok) {
        toast.success("User updated successfully");
        setEditModalOpen(false);
        fetchUsers(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    } finally {
      setEditSaving(false);
    }
  };

  // Handle Block/Unblock
  const handleBlockToggle = async (user: UserData) => {
    setActionLoadingUserId(user._id);
    try {
      if (user.isBlocked) {
        // Unblock user
        const response = await fetch("/api/admin/blocked-users/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        if (response.ok) {
          toast.success(`${user.name} unblocked successfully`);
          fetchUsers();
        } else {
          toast.error("Failed to unblock user");
        }
      } else {
        // Block user
        const response = await fetch("/api/admin/blocked-users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            reason: "Blocked by admin",
          }),
        });

        if (response.ok) {
          toast.success(`${user.name} blocked successfully`);
          fetchUsers();
        } else {
          toast.error("Failed to block user");
        }
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
      toast.error("Error updating block status");
    } finally {
      setActionLoadingUserId(null);
    }
  };

  // Handle Delete
  const handleDeleteClick = (user: UserData) => {
    setDeletingUser(user);
    setDeleteConfirmation("");
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    if (deleteConfirmation !== `DELETE ${deletingUser.email}`) {
      toast.error("Confirmation text does not match");
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: deletingUser.email,
          confirmation: deleteConfirmation,
        }),
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        setDeleteModalOpen(false);
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Send Message
  const handleSendMessage = async (user: UserData) => {
    setActionLoadingUserId(user._id);
    try {
      const response = await fetch("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/chat?chatId=${data.chatId}`);
      } else {
        toast.error("Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Error creating chat");
    } finally {
      setActionLoadingUserId(null);
    }
  };

  // Handle View Profile
  const handleViewProfile = (user: UserData) => {
    router.push(`/user/${user.username}`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "_id",
      "name",
      "username",
      "email",
      "entryNo",
      "department",
      "course",
      "phone",
      "socialLink",
      "isPublicEmail",
      "isBlocked",
      "createdAt",
      "updatedAt",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        headers
          .map((header) => {
            const value = user[header as keyof UserData];
            // Escape commas and quotes in values
            if (typeof value === "string" && value.includes(",")) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const today = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `iitconnect-users-${today}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully");
  };

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              onClick={() => setCurrentPage(1)}
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              1
            </Button>
            {startPage > 2 && <span className="text-white">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={
              currentPage === page
                ? "bg-white text-blue-600"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-white">...</span>
            )}
            <Button
              onClick={() => setCurrentPage(totalPages)}
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Skeleton loader
  const renderSkeletons = () => {
    if (viewMode === "card") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-xl p-4 animate-pulse border border-white/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full" />
                  <div>
                    <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-32 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-3/4 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-lg p-4 animate-pulse border border-white/10"
          >
            <div className="h-4 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  };

  // Card view
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedUsers.map((user) => (
        <div
          key={user._id}
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {user.isBlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/30 rounded-full">
                    <div className="w-full h-0.5 bg-red-500 rotate-45" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-white/70 truncate">
                  @{user.username}
                </p>
              </div>
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  disabled={actionLoadingUserId === user._id}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-1 min-w-[160px] z-50"
                  align="end"
                >
                  <DropdownMenu.Item
                    onClick={() => handleEditClick(user)}
                    className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 cursor-pointer outline-none"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => handleBlockToggle(user)}
                    className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 cursor-pointer outline-none"
                  >
                    {user.isBlocked ? (
                      <>
                        <ShieldOff className="h-4 w-4 mr-2" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Block
                      </>
                    )}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => handleDeleteClick(user)}
                    className="flex items-center px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 cursor-pointer outline-none"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => handleSendMessage(user)}
                    className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 cursor-pointer outline-none"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-white/80">
              <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.department && (
              <div className="flex items-center text-white/80">
                <Building className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{user.department}</span>
              </div>
            )}
            {user.entryNo && (
              <div className="flex items-center text-white/80">
                <User className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{user.entryNo}</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => handleViewProfile(user)}
            variant="outline"
            size="sm"
            className="w-full mt-3 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            View Profile
          </Button>
        </div>
      ))}
    </div>
  );

  // Table view
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left text-white font-semibold p-3">Avatar</th>
            <th className="text-left text-white font-semibold p-3">Name</th>
            <th className="text-left text-white font-semibold p-3">Email</th>
            <th className="text-left text-white font-semibold p-3">
              Department
            </th>
            <th className="text-left text-white font-semibold p-3">Entry No</th>
            <th className="text-left text-white font-semibold p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr
              key={user._id}
              className="border-b border-white/10 hover:bg-white/5 transition-colors"
            >
              <td className="p-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {user.isBlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/30 rounded-full">
                      <div className="w-full h-0.5 bg-red-500 rotate-45" />
                    </div>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div className="text-white font-medium">{user.name}</div>
                <div className="text-white/60 text-sm">@{user.username}</div>
              </td>
              <td className="p-3 text-white/80">{user.email}</td>
              <td className="p-3 text-white/80">{user.department || "-"}</td>
              <td className="p-3 text-white/80">{user.entryNo || "-"}</td>
              <td className="p-3">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      disabled={actionLoadingUserId === user._id}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-1 min-w-[160px] z-50"
                      align="end"
                    >
                      <DropdownMenu.Item
                        onClick={() => handleEditClick(user)}
                        className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 cursor-pointer outline-none"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => handleBlockToggle(user)}
                        className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 cursor-pointer outline-none"
                      >
                        {user.isBlocked ? (
                          <>
                            <ShieldOff className="h-4 w-4 mr-2" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Block
                          </>
                        )}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => handleDeleteClick(user)}
                        className="flex items-center px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 cursor-pointer outline-none"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => handleSendMessage(user)}
                        className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 cursor-pointer outline-none"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-white">Please sign in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Users Management
        </h2>
        <p className="text-blue-200 text-sm sm:text-base">
          Manage all users on the platform
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/50"
            />
          </div>

          {/* View Controls */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => handleViewModeChange("card")}
              variant={viewMode === "card" ? "default" : "outline"}
              size="sm"
              className={
                viewMode === "card"
                  ? "bg-white text-blue-600"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Card
            </Button>
            <Button
              onClick={() => handleViewModeChange("table")}
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              className={
                viewMode === "table"
                  ? "bg-white text-blue-600"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4 text-sm text-white/80">
          <span>Total: {filteredUsers.length}</span>
          <span>•</span>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 sm:p-6">
        {loading ? (
          renderSkeletons()
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 mx-auto text-white/40 mb-4" />
            <p className="text-white/80 text-lg">No users found</p>
            <p className="text-white/60 text-sm">
              Try adjusting your search criteria
            </p>
          </div>
        ) : viewMode === "card" ? (
          renderCardView()
        ) : (
          renderTableView()
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Edit Modal */}
      <Dialog.Root open={editModalOpen} onOpenChange={setEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 md:max-h-[600px]">
            <Dialog.Title className="text-xl font-bold text-white mb-4">
              Edit User
            </Dialog.Title>

            {editingUser && (
              <div className="space-y-4">
                {/* Read-only fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/70 block mb-1">
                      Email (read-only)
                    </label>
                    <Input
                      value={editingUser.email}
                      disabled
                      className="bg-white/5 border-white/20 text-white/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 block mb-1">
                      Username (read-only)
                    </label>
                    <Input
                      value={editingUser.username}
                      disabled
                      className="bg-white/5 border-white/20 text-white/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 block mb-1">
                      Entry No (read-only)
                    </label>
                    <Input
                      value={editingUser.entryNo || "N/A"}
                      disabled
                      className="bg-white/5 border-white/20 text-white/50"
                    />
                  </div>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white block mb-1">
                      Name
                    </label>
                    <Input
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white block mb-1">
                      Department
                    </label>
                    <Input
                      value={editFormData.department}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          department: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white block mb-1">
                      Course
                    </label>
                    <Input
                      value={editFormData.course}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          course: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white block mb-1">
                      Phone
                    </label>
                    <Input
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-white block mb-1">
                      Social Link
                    </label>
                    <Input
                      value={editFormData.socialLink}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          socialLink: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editFormData.isPublicEmail}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            isPublicEmail: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      Make email public
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleEditSave}
                    disabled={editSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => setEditModalOpen(false)}
                    variant="outline"
                    className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Modal */}
      <Dialog.Root open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-bold text-white mb-4">
              ⚠️ Delete User
            </Dialog.Title>

            {deletingUser && (
              <div className="space-y-4">
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-white text-sm">
                    <strong>WARNING:</strong> This will permanently delete the
                    user and ALL their data including posts, comments, messages,
                    and chats. This action cannot be undone.
                  </p>
                </div>

                <div>
                  <p className="text-white mb-2">
                    Type <strong>DELETE {deletingUser.email}</strong> to
                    confirm:
                  </p>
                  <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder={`DELETE ${deletingUser.email}`}
                    className="bg-white/10 border-white/20 text-white placeholder-white/40"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleDeleteConfirm}
                    disabled={
                      deleteLoading ||
                      deleteConfirmation !== `DELETE ${deletingUser.email}`
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleteLoading ? "Deleting..." : "Delete User"}
                  </Button>
                  <Button
                    onClick={() => setDeleteModalOpen(false)}
                    variant="outline"
                    className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
