import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/testLogins";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, confirmation } = body;

    if (!email || !confirmation) {
      return NextResponse.json(
        { error: "Email and confirmation are required" },
        { status: 400 }
      );
    }

    // Verify confirmation text
    if (confirmation !== `DELETE ${email}`) {
      return NextResponse.json(
        { error: "Confirmation text does not match" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Find the user first
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user._id.toString();

    // Delete user and all related data
    await Promise.all([
      // Delete from users collection
      db.collection("users").deleteOne({ _id: user._id }),

      // Delete accounts (OAuth)
      db.collection("accounts").deleteMany({ userId: new ObjectId(userId) }),

      // Delete sessions
      db.collection("sessions").deleteMany({ userId: new ObjectId(userId) }),

      // Delete posts
      db.collection("posts").deleteMany({ authorId: new ObjectId(userId) }),

      // Delete comments
      db.collection("comments").deleteMany({ authorId: new ObjectId(userId) }),

      // Delete likes
      db.collection("likes").deleteMany({ userId: new ObjectId(userId) }),

      // Delete chat members
      db.collection("chatmembers").deleteMany({ userId }),

      // Delete sent messages
      db.collection("messages").deleteMany({ senderId: new ObjectId(userId) }),

      // Delete received messages
      db
        .collection("messages")
        .deleteMany({ receiverId: new ObjectId(userId) }),
    ]);

    // Find and delete chats with no remaining members
    const orphanedChats = await db
      .collection("chatmembers")
      .aggregate([
        {
          $group: {
            _id: "$chatId",
            count: { $sum: 1 },
          },
        },
        {
          $match: {
            count: 0,
          },
        },
      ])
      .toArray();

    if (orphanedChats.length > 0) {
      const orphanedChatIds = orphanedChats.map((chat) => chat._id);
      await Promise.all([
        db.collection("chats").deleteMany({
          _id: { $in: orphanedChatIds.map((id) => new ObjectId(id)) },
        }),
        db.collection("messages").deleteMany({
          chatId: { $in: orphanedChatIds },
        }),
      ]);
    }

    console.log(`✅ Admin ${session.user.email} deleted user: ${email}`);

    return NextResponse.json({
      success: true,
      message: "User and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
