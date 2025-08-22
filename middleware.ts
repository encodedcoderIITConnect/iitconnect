import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware() {
    // For now, we'll disable the blocked user check in middleware
    // to avoid edge runtime issues. The blocking check happens in auth.ts
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Allow all requests to pass through
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth/blocked (blocked page)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|auth/blocked).*)",
  ],
};
