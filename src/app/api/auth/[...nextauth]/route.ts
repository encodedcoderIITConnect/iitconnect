import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Debug environment variables in production
console.log("🔍 NextAuth Debug Info:");
console.log("- NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log(
  "- Google Client ID:",
  process.env.GOOGLE_CLIENT_ID ? "Set" : "Not Set"
);
console.log(
  "- Google Client Secret:",
  process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not Set"
);
console.log(
  "- NextAuth Secret:",
  process.env.NEXTAUTH_SECRET ? "Set" : "Not Set"
);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
