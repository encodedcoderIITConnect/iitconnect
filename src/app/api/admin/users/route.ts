import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/testLogins";
import { getUsersCollection, getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users from database
    const usersCollection = await getUsersCollection();
    const users = await usersCollection
      .find({})
      .project({
        _id: 1,
        name: 1,
        username: 1,
        email: 1,
        image: 1,
        entryNo: 1,
        phone: 1,
        department: 1,
        course: 1,
        socialLink: 1,
        isPublicEmail: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .toArray();

    // Get all blocked users to check status
    const db = await getDatabase();
    const blockedUsers = await db
      .collection("blockedUsers")
      .find({ isActive: true })
      .toArray();

    const blockedEmailsSet = new Set(
      blockedUsers.map((bu) => bu.email.toLowerCase())
    );

    // Add blocked status to each user
    const usersWithBlockedStatus = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      isBlocked: blockedEmailsSet.has(user.email.toLowerCase()),
    }));

    return NextResponse.json({
      success: true,
      users: usersWithBlockedStatus,
      total: usersWithBlockedStatus.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
