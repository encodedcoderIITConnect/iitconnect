import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

// Helper function to get database collections
async function getCollections() {
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();
  const db = client.db();

  return {
    client,
    users: db.collection("users"),
    chats: db.collection("chats"),
    chatMembers: db.collection("chatmembers"),
    messages: db.collection("messages"),
  };
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await context.params;

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const { client, users, chats, chatMembers, messages } =
      await getCollections();

    try {
      // Find current user
      const currentUser = await users.findOne({ email: session.user.email });
      if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if user is a member of this chat
      const membership = await chatMembers.findOne({
        chatId: chatId,
        userId: currentUser._id.toString(),
      });

      if (!membership) {
        return NextResponse.json(
          { error: "Access denied to this chat" },
          { status: 403 }
        );
      }

      // Check if chat exists
      const chat = await chats.findOne({ _id: new ObjectId(chatId) });
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      // For direct messages, we'll leave the chat for the current user only
      // For group chats, we could implement different logic (remove user from group vs delete entire group)

      // Delete user's membership from the chat
      await chatMembers.deleteOne({
        chatId: chatId,
        userId: currentUser._id.toString(),
      });

      // Check if there are any remaining members
      const remainingMembers = await chatMembers.countDocuments({
        chatId: chatId,
      });

      // If no members left, delete the entire chat and its messages
      if (remainingMembers === 0) {
        await messages.deleteMany({ chatId: chatId });
        await chats.deleteOne({ _id: new ObjectId(chatId) });
      }

      return NextResponse.json({
        success: true,
        message: "Chat deleted successfully",
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
