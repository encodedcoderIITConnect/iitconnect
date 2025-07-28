import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await context.params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const usersCollection = await getUsersCollection();

    // Find user by username
    const user = await usersCollection.findOne(
      { username: username },
      {
        projection: {
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
        },
      }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Filter sensitive information based on privacy settings
    const publicProfile = {
      ...user,
      email: user.isPublicEmail ? user.email : null,
      phone: user.phone || null, // Only show if user has added it
    };

    return NextResponse.json({
      success: true,
      user: publicProfile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
