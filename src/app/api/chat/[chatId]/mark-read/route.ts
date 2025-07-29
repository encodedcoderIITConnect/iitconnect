import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MongoClient } from "mongodb";

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
    messageReads: db.collection("messagereads"),
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { client, users, messages, messageReads } = await getCollections();

    try {
      // Find current user
      const currentUser = await users.findOne({ email: session.user.email });
      if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const resolvedParams = await params;
      const chatId = resolvedParams.chatId;

      // Get the latest message in this chat
      const latestMessage = await messages.findOne(
        { chatId },
        { sort: { createdAt: -1 } }
      );

      if (latestMessage) {
        // Update or create read status for this user and chat
        await messageReads.updateOne(
          {
            userId: currentUser._id.toString(),
            chatId: chatId,
          },
          {
            $set: {
              userId: currentUser._id.toString(),
              chatId: chatId,
              lastReadMessageId: latestMessage._id.toString(),
              lastReadAt: new Date(),
            },
          },
          { upsert: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Chat marked as read",
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error marking chat as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
