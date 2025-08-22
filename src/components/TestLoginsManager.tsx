"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Users, AlertCircle, CheckCircle2 } from "lucide-react";

interface TestLogin {
  _id: string;
  email: string;
  addedBy: string;
  addedAt: string;
  isActive: boolean;
}

export default function TestLoginsManager() {
  const { data: session } = useSession();
  const [testLogins, setTestLogins] = useState<TestLogin[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isAdmin = session?.user?.email === "iitconnect22@gmail.com";

  useEffect(() => {
    if (isAdmin) {
      fetchTestLogins();
    }
  }, [isAdmin]);

  const fetchTestLogins = async () => {
    try {
      const response = await fetch("/api/admin/test-logins");
      if (response.ok) {
        const data = await response.json();
        setTestLogins(data.testLogins);
      } else {
        console.error("Failed to fetch test logins");
      }
    } catch (err) {
      console.error("Error fetching test logins:", err);
    }
  };

  const addTestLogin = async () => {
    if (!newEmail.trim()) {
      setMessage({ type: "error", text: "Please enter an email address" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/test-logins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setNewEmail("");
        fetchTestLogins();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add test login" });
      console.error("Error adding test login:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeTestLogin = async (email: string) => {
    if (
      !confirm(`Are you sure you want to remove ${email} from test logins?`)
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/test-logins/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchTestLogins();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to remove test login" });
      console.error("Error removing test login:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 sm:p-8 shadow-xl w-full max-w-md">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 text-white text-center sm:text-left">
            <AlertCircle className="h-6 w-6 text-yellow-300 flex-shrink-0" />
            <span className="poppins-medium">
              Please sign in to access admin panel
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 sm:p-8 shadow-xl w-full max-w-md">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 text-white text-center sm:text-left">
            <AlertCircle className="h-6 w-6 text-red-300 flex-shrink-0" />
            <span className="poppins-medium">
              Access denied - Admin privileges required
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex flex-col sm:flex-row items-start sm:items-center gap-3 text-white poppins-bold">
            <div className="bg-white/20 p-2 sm:p-3 rounded-xl flex-shrink-0">
              <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <span className="leading-tight">Test Logins Manager</span>
          </h1>
          <p className="text-white/80 mt-3 poppins-regular text-base sm:text-lg">
            Manage email addresses that can login without @iitrpr.ac.in domain
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-4 sm:mb-6">
          <div
            className={`bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-xl ${
              message.type === "error"
                ? "border-red-300/50 bg-red-500/10"
                : "border-green-300/50 bg-green-500/10"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center text-white gap-3 sm:gap-0">
              {message.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0 sm:mr-3" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-300 flex-shrink-0 sm:mr-3" />
              )}
              <span className="poppins-medium text-sm sm:text-base">
                {message.text}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add New Test Login */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 sm:p-8 shadow-xl mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-white poppins-semibold">
          <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
            <Plus className="h-5 w-5" />
          </div>
          <span>Add New Test Login</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Input
            type="email"
            placeholder="Enter email address (e.g., user@gmail.com)"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTestLogin()}
            className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60 rounded-xl h-12 poppins-regular focus:ring-2 focus:ring-white/50 focus:border-white/50"
          />
          <Button
            onClick={addTestLogin}
            disabled={loading}
            className="w-full sm:w-auto px-6 sm:px-8 h-12 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl poppins-semibold transition-all duration-200 backdrop-blur-xl touch-button"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : (
              "Add Email"
            )}
          </Button>
        </div>
      </div>

      {/* Test Logins List */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 sm:p-8 shadow-xl mb-20 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white poppins-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <span>Current Test Logins</span>
          </div>
          <span className="bg-white/20 px-3 sm:px-4 py-2 rounded-full text-sm poppins-medium">
            {testLogins.length} {testLogins.length === 1 ? "email" : "emails"}
          </span>
        </h2>

        {testLogins.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-white/10 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white/60" />
            </div>
            <p className="text-white/80 poppins-medium text-base sm:text-lg">
              No test logins configured
            </p>
            <p className="text-white/60 poppins-regular mt-2 text-sm sm:text-base">
              Add your first test email above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {testLogins.map((testLogin, index) => (
              <div
                key={testLogin._id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                      <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                        <span className="text-white/80 poppins-semibold text-xs sm:text-sm">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="font-semibold text-white poppins-semibold text-base sm:text-lg break-all">
                        {testLogin.email}
                      </div>
                    </div>
                    <div className="text-white/70 poppins-regular text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span>Added by {testLogin.addedBy}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {new Date(testLogin.addedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTestLogin(testLogin.email)}
                    disabled={loading}
                    className="w-full sm:w-auto bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 rounded-lg h-12 sm:h-10 px-4 poppins-medium transition-all duration-200 flex items-center justify-center gap-2 touch-button"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sm:hidden">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
