import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";
// import { db } from "@/lib/db"; // Temporarily disabled

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

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
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { entryNo, phone, department, course, socialLink, isPublicEmail } =
      body;

    // Update user in MongoDB (excluding name as it comes from Google account)
    const usersCollection = await getUsersCollection();

    const updateData = {
      entryNo: entryNo?.trim() || null, // Use null for empty entry numbers
      phone: phone?.trim() || "",
      department: department?.trim() || "",
      course: course?.trim() || "",
      socialLink: socialLink?.trim() || "",
      isPublicEmail: Boolean(isPublicEmail),
      updatedAt: new Date(),
    };

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
