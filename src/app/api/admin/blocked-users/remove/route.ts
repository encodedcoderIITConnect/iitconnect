import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { removeBlockedUser, isAdmin } from "@/lib/blockedUsers";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const success = await removeBlockedUser(email);

    if (success) {
      return NextResponse.json({ message: "User unblocked successfully" });
    } else {
      return NextResponse.json(
        { error: "User not found or already unblocked" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error unblocking user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
