import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/testLogins";
import { getUsersCollection } from "@/lib/mongodb";

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      email,
      name,
      department,
      course,
      phone,
      socialLink,
      isPublicEmail,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const usersCollection = await getUsersCollection();

    // Find the user
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user with provided fields (only editable fields)
    const updateData: Record<string, string | boolean | Date> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (department !== undefined) updateData.department = department;
    if (course !== undefined) updateData.course = course;
    if (phone !== undefined) updateData.phone = phone;
    if (socialLink !== undefined) updateData.socialLink = socialLink;
    if (isPublicEmail !== undefined) updateData.isPublicEmail = isPublicEmail;

    await usersCollection.updateOne({ email }, { $set: updateData });

    console.log(`✅ Admin ${session.user.email} updated user: ${email}`);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
