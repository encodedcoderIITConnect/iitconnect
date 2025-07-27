"use client";

import { useSession } from "next-auth/react";

export default function DebugPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 p-8">
      <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Debug Information</h1>
        
        <div className="space-y-4 text-white">
          <div>
            <strong>Session Status:</strong> {status}
          </div>
          
          <div>
            <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}
          </div>
          
          <div>
            <strong>Environment Check:</strong>
            <ul className="ml-4 mt-2">
              <li>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</li>
              <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'undefined'}</li>
              <li>Google Client ID: {process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not Set'}</li>
              <li>Google Client Secret: {process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not Set'}</li>
              <li>NextAuth Secret: {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set'}</li>
            </ul>
          </div>
          
          {session && (
            <div>
              <strong>Session Data:</strong>
              <pre className="bg-black/20 p-4 rounded mt-2 overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          )}
          
          {status === 'unauthenticated' && (
            <div>
              <p className="text-yellow-200">Not authenticated. Try signing in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
