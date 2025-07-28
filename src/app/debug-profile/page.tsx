"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DebugData {
  sessionData: {
    userEmail?: string | null;
    userName?: string | null;
    userImage?: string | null;
  };
  fetchedUserData: {
    user?: {
      email?: string;
      name?: string;
      username?: string;
    };
  };
  comparison: {
    sessionEmail?: string | null;
    fetchedEmail?: string;
    emailsMatch: boolean;
    emailsMatchCaseInsensitive: boolean;
  };
  isOwnProfileLogic: {
    expression: string;
    sessionEmail?: string | null;
    userProfileEmail?: string;
    result: boolean;
  };
  error?: string;
}

export default function DebugProfilePage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailCheckResults, setEmailCheckResults] = useState<{
    totalUsers?: number;
    caseIssues?: Array<{
      lowerCaseEmail: string;
      variants: string[];
      users: Array<{ email: string; username: string; name: string }>;
    }>;
    hasIssues?: boolean;
  } | null>(null);
  const [fixingEmails, setFixingEmails] = useState(false);

  const checkAllEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug?action=check_all");
      const data = await response.json();
      setEmailCheckResults(data);
    } catch (error) {
      console.error("Error checking emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const fixAllEmails = async () => {
    setFixingEmails(true);
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "normalize_all_emails" }),
      });
      const data = await response.json();
      alert(`Fixed ${data.fixedCount} email addresses`);
      // Refresh the email check
      checkAllEmails();
    } catch (error) {
      console.error("Error fixing emails:", error);
      alert("Error fixing emails");
    } finally {
      setFixingEmails(false);
    }
  };

  const debugUser = async () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    setLoading(true);
    try {
      // Fetch user profile data
      const response = await fetch(`/api/user/profile/${username}`);
      const userData = await response.json();

      // Create debug information
      const debug: DebugData = {
        sessionData: {
          userEmail: session?.user?.email,
          userName: session?.user?.name,
          userImage: session?.user?.image,
        },
        fetchedUserData: userData,
        comparison: {
          sessionEmail: session?.user?.email,
          fetchedEmail: userData.user?.email,
          emailsMatch: session?.user?.email === userData.user?.email,
          emailsMatchCaseInsensitive:
            session?.user?.email?.toLowerCase() ===
            userData.user?.email?.toLowerCase(),
        },
        isOwnProfileLogic: {
          expression: "session?.user?.email === userProfile.email",
          sessionEmail: session?.user?.email,
          userProfileEmail: userData.user?.email,
          result: session?.user?.email === userData.user?.email,
        },
      };

      setDebugData(debug);
    } catch (error) {
      console.error("Debug error:", error);
      setDebugData({
        error: error instanceof Error ? error.message : "Unknown error",
        sessionData: {},
        fetchedUserData: {},
        comparison: {
          emailsMatch: false,
          emailsMatchCaseInsensitive: false,
        },
        isOwnProfileLogic: {
          expression: "",
          result: false,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Profile Debug Tool
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Current Session
          </h2>
          <div className="bg-white/5 rounded-lg p-4">
            <pre className="text-white/80 text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Database Email Check
          </h2>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={checkAllEmails}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Checking..." : "Check All Emails"}
            </Button>
            {emailCheckResults?.hasIssues && (
              <Button
                onClick={fixAllEmails}
                disabled={fixingEmails}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {fixingEmails ? "Fixing..." : "Fix Email Case Issues"}
              </Button>
            )}
          </div>

          {emailCheckResults && (
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white mb-2">
                Total Users: {emailCheckResults.totalUsers}
              </p>
              {emailCheckResults.hasIssues ? (
                <div>
                  <p className="text-red-400 font-semibold">
                    ❌ Found {emailCheckResults.caseIssues?.length} email case
                    issues!
                  </p>
                  {emailCheckResults.caseIssues?.map((issue, index) => (
                    <div
                      key={index}
                      className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded"
                    >
                      <p className="text-red-300">
                        Email variants for {issue.lowerCaseEmail}:
                      </p>
                      <ul className="text-red-200 text-sm ml-4">
                        {issue.variants.map((variant, vIndex) => (
                          <li key={vIndex}>• {variant}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-400">✅ No email case issues found!</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Debug User Profile
          </h2>
          <div className="flex gap-2 mb-4">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username to debug"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              onClick={debugUser}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? "Loading..." : "Debug"}
            </Button>
          </div>
        </div>

        {debugData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Debug Results
            </h2>
            <div className="bg-white/5 rounded-lg p-4">
              <pre className="text-white/80 text-sm whitespace-pre-wrap">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </div>

            {debugData.comparison && (
              <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  Key Analysis:
                </h3>
                <ul className="text-yellow-300 space-y-1">
                  <li>
                    • Emails match exactly:{" "}
                    {debugData.comparison.emailsMatch ? "✅ YES" : "❌ NO"}
                  </li>
                  <li>
                    • Emails match (case insensitive):{" "}
                    {debugData.comparison.emailsMatchCaseInsensitive
                      ? "✅ YES"
                      : "❌ NO"}
                  </li>
                  <li>
                    • Should show edit button:{" "}
                    {debugData.isOwnProfileLogic?.result ? "✅ YES" : "❌ NO"}
                  </li>
                </ul>

                {!debugData.comparison.emailsMatch &&
                  debugData.comparison.emailsMatchCaseInsensitive && (
                    <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded">
                      <p className="text-red-400 font-medium">
                        ⚠️ CASE SENSITIVITY ISSUE DETECTED
                      </p>
                      <p className="text-red-300 text-sm">
                        The emails match when ignoring case but not exactly.
                        This will prevent the edit button from showing.
                      </p>
                    </div>
                  )}

                {!debugData.comparison.emailsMatch &&
                  !debugData.comparison.emailsMatchCaseInsensitive && (
                    <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded">
                      <p className="text-red-400 font-medium">
                        ❌ EMAIL MISMATCH DETECTED
                      </p>
                      <p className="text-red-300 text-sm">
                        The session email and database email are completely
                        different.
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        <div className="text-white/70 text-sm">
          <h3 className="font-semibold mb-2">How to use this tool:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Make sure you&apos;re logged in as the user having the issue
            </li>
            <li>Enter the username that&apos;s not showing the edit button</li>
            <li>Click &quot;Debug&quot; to analyze the data</li>
            <li>
              Check the &quot;Key Analysis&quot; section for potential issues
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
