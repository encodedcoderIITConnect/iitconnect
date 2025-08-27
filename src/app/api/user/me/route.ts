import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";
// import { db } from "@/lib/db"; // Temporarily disabled

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user data from MongoDB
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert MongoDB _id to string and add required fields
    const userResponse = {
      id: user._id.toString(),
      name: user.name || "Unknown User",
      username: user.username || "", // Return actual username field
      email: user.email,
      image: user.image || "",
      department: user.department || "",
      entryNo: user.entryNo || "",
      phone: user.phone || "",
      course: user.course || "",
      socialLink: user.socialLink || "",
      isPublicEmail: user.isPublicEmail ?? true,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
      _count: {
        posts: 0, // TODO: Implement actual counts later
        comments: 0, // TODO: Implement actual counts later
        likes: 0, // TODO: Implement actual counts later
      },
    };

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const {
      username,
      entryNo,
      phone,
      department,
      course,
      socialLink,
      isPublicEmail,
    } = body;

    const usersCollection = await getUsersCollection();

    // Get current user to check if username is already set
    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if username is provided and validate
    if (username && username.trim()) {
      const trimmedUsername = username.trim().toLowerCase();

      // If user already has a username and is trying to change it, prevent the change
      if (currentUser.username && currentUser.username !== trimmedUsername) {
        return NextResponse.json(
          { error: "Username cannot be changed once set" },
          { status: 400 }
        );
      }

      // Only validate and check for duplicates if this is a new or different username
      if (!currentUser.username || currentUser.username !== trimmedUsername) {
        // Validate username format (alphanumeric and underscores only)
        if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
          return NextResponse.json(
            {
              error:
                "Username can only contain letters, numbers, and underscores",
            },
            { status: 400 }
          );
        }

        // Check if username is already taken by another user
        const existingUser = await usersCollection.findOne({
          username: trimmedUsername,
        });

        if (existingUser) {
          return NextResponse.json(
            { error: "Username is already taken" },
            { status: 400 }
          );
        }
      }
    }

    // Prepare update data - only include username if user doesn't have one yet
    const updateData: {
      username?: string;
      entryNo: string | null;
      phone: string;
      department: string;
      course: string;
      socialLink: string;
      isPublicEmail: boolean;
      updatedAt: Date;
    } = {
      entryNo: entryNo?.trim() || null, // Use null for empty entry numbers
      phone: phone?.trim() || "",
      department: department?.trim() || "",
      course: course?.trim() || "",
      socialLink: socialLink?.trim() || "",
      isPublicEmail: Boolean(isPublicEmail),
      updatedAt: new Date(),
    };

    // Only set username if user doesn't have one already or if it's the same as current
    if (username && username.trim()) {
      const trimmedUsername = username.trim().toLowerCase();
      if (!currentUser.username || currentUser.username === trimmedUsername) {
        updateData.username = trimmedUsername;
      }
    }

    const updateResult = await usersCollection.updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch and return updated user data
    const updatedUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found after update" },
        { status: 404 }
      );
    }

    const userResponse = {
      id: updatedUser._id.toString(),
      name: updatedUser.name || "Unknown User",
      username: updatedUser.username || "", // Return actual username field
      email: updatedUser.email,
      image: updatedUser.image || "",
      department: updatedUser.department || "",
      entryNo: updatedUser.entryNo || "",
      phone: updatedUser.phone || "",
      course: updatedUser.course || "",
      socialLink: updatedUser.socialLink || "",
      isPublicEmail: updatedUser.isPublicEmail ?? true,
      createdAt:
        updatedUser.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt:
        updatedUser.updatedAt?.toISOString() || new Date().toISOString(),
      _count: {
        posts: 0, // TODO: Implement actual counts later
        comments: 0, // TODO: Implement actual counts later
        likes: 0, // TODO: Implement actual counts later
      },
    };

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
