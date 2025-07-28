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

export async function GET(
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

    const { client, users, chatMembers, messages } = await getCollections();

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

      // Get messages for this chat
      const chatMessages = await messages
        .aggregate([
          {
            $match: { chatId: chatId },
          },
          {
            $addFields: {
              senderObjectId: { $toObjectId: "$senderId" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "senderObjectId",
              foreignField: "_id",
              as: "sender",
              pipeline: [
                {
                  $addFields: {
                    _id: { $toString: "$_id" },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    image: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$sender",
          },
          {
            $sort: { createdAt: 1 },
          },
        ])
        .toArray();

      // Format messages
      const formattedMessages = chatMessages.map((msg) => ({
        id: msg._id.toString(),
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.sender.name,
        senderImage: msg.sender.image,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        isOwn: msg.senderId === currentUser._id.toString(),
        createdAt: msg.createdAt,
      }));

      return NextResponse.json({
        success: true,
        messages: formattedMessages,
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const body = await request.json();
    const { content } = body;

    if (!chatId || !content?.trim()) {
      return NextResponse.json(
        { error: "Chat ID and message content are required" },
        { status: 400 }
      );
    }

    const { client, users, chatMembers, messages } = await getCollections();

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

      // Create new message
      const newMessage = {
        content: content.trim(),
        senderId: currentUser._id.toString(),
        chatId: chatId,
        createdAt: new Date(),
      };

      const result = await messages.insertOne(newMessage);

      return NextResponse.json({
        success: true,
        messageId: result.insertedId.toString(),
        message: "Message sent successfully",
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
