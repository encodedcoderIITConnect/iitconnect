"use client";

import dynamic from "next/dynamic";

const LoginCard = dynamic(() => import("@/components/LoginCard"), {
  ssr: false,
});

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center p-4">
      <LoginCard />
    </div>
  );
}
