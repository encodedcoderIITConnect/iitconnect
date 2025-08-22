import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllBlockedUsers, blockUser, isAdmin } from "@/lib/blockedUsers";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blockedUsers = await getAllBlockedUsers();
    return NextResponse.json(blockedUsers);
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, reason } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const success = await blockUser(email, session.user.email, reason);

    if (success) {
      return NextResponse.json({ message: "User blocked successfully" });
    } else {
      return NextResponse.json(
        { error: "User is already blocked or error occurred" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error blocking user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
