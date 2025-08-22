"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function TestEmailsAdmin() {
  const { data: session } = useSession();
  const [testEmails, setTestEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTestEmails();
  }, []);

  const fetchTestEmails = async () => {
    try {
      const response = await fetch("/api/admin/test-emails");
      if (response.ok) {
        const data = await response.json();
        setTestEmails(data.testEmails);
      } else {
        setError("Failed to fetch test emails");
      }
    } catch {
      setError("Error fetching test emails");
    }
  };

  const addTestEmail = async () => {
    if (!newEmail.trim()) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/test-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + " - " + data.note);
        setNewEmail("");
        fetchTestEmails();
      } else {
        setError(data.error || "Failed to add test email");
      }
    } catch {
      setError("Error adding test email");
    } finally {
      setLoading(false);
    }
  };

  const removeTestEmail = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/test-emails", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + " - " + data.note);
        fetchTestEmails();
      } else {
        setError(data.error || "Failed to remove test email");
      }
    } catch {
      setError("Error removing test email");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please sign in to access the admin panel.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Test Emails Administration
        </h1>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Current Admin:</strong> {session.user?.email}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Note: Changes require application restart to take effect in
            production.
          </p>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Add New Test Email
          </h2>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={addTestEmail}
              disabled={loading || !newEmail.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Current Test Emails ({testEmails.length})
          </h2>

          {testEmails.length === 0 ? (
            <p className="text-gray-500 italic">No test emails configured</p>
          ) : (
            <div className="space-y-2">
              {testEmails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="font-mono text-sm">{email}</span>
                  <button
                    onClick={() => removeTestEmail(email)}
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Test emails allow non-@iitrpr.ac.in addresses to login</li>
            <li>• Changes are logged for audit purposes</li>
            <li>• Environment variable updates require app restart</li>
            <li>• Only designated admins can manage test emails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
