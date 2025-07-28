import { NextRequest, NextResponse } from "next/server";
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
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    console.log("Chat create - session:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("Chat create - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Chat create - request body:", body);
    const { recipientEmail, targetUsername } = body;

    // Support both recipientEmail (from profile page) and targetUsername (from new chat modal)
    let targetEmail = recipientEmail;

    if (!targetEmail && targetUsername) {
      // If targetUsername is provided, we need to find the user's email
      const { client: tempClient, users: tempUsers } = await getCollections();
      try {
        const targetUser = await tempUsers.findOne({
          username: targetUsername,
        });
        if (targetUser) {
          targetEmail = targetUser.email;
        }
        await tempClient.close();
      } catch (error) {
        await tempClient.close();
        throw error;
      }
    }

    if (!targetEmail) {
      console.log("Chat create - missing recipient email or username");
      return NextResponse.json(
        { error: "Recipient email or username is required" },
        { status: 400 }
      );
    }

    // Don't allow messaging yourself
    if (targetEmail === session.user.email) {
      console.log("Chat create - trying to message self");
      return NextResponse.json(
        { error: "Cannot message yourself" },
        { status: 400 }
      );
    }

    const { client, users, chats, chatMembers } = await getCollections();

    try {
      console.log(
        "Chat create - looking for users:",
        session.user.email,
        targetEmail
      );
      // Find both users
      const [currentUser, recipientUser] = await Promise.all([
        users.findOne({ email: session.user.email }),
        users.findOne({ email: targetEmail }),
      ]);

      console.log("Chat create - found users:", {
        currentUser: currentUser
          ? { id: currentUser._id, email: currentUser.email }
          : null,
        recipientUser: recipientUser
          ? { id: recipientUser._id, email: recipientUser.email }
          : null,
      });

      if (!currentUser || !recipientUser) {
        console.log("Chat create - user not found");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if a direct chat already exists between these users
      const existingChatMembers = await chatMembers
        .aggregate([
          {
            $match: {
              userId: {
                $in: [currentUser._id.toString(), recipientUser._id.toString()],
              },
            },
          },
          {
            $group: {
              _id: "$chatId",
              userIds: { $push: "$userId" },
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              count: 2,
              userIds: {
                $all: [
                  currentUser._id.toString(),
                  recipientUser._id.toString(),
                ],
              },
            },
          },
        ])
        .toArray();

      let chatId;

      if (existingChatMembers.length > 0) {
        // Use existing chat
        chatId = existingChatMembers[0]._id;
        console.log("Chat create - using existing chat:", chatId);
      } else {
        // Create new chat
        const newChat = {
          name: null, // Direct chats don't have names
          isGroup: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const chatResult = await chats.insertOne(newChat);
        chatId = chatResult.insertedId.toString();
        console.log("Chat create - created new chat:", chatId);

        // Add both users as chat members
        await chatMembers.insertMany([
          {
            chatId: chatId,
            userId: currentUser._id.toString(),
            joinedAt: new Date(),
          },
          {
            chatId: chatId,
            userId: recipientUser._id.toString(),
            joinedAt: new Date(),
          },
        ]);
        console.log("Chat create - added chat members");
      }

      return NextResponse.json({
        success: true,
        chatId: chatId,
        message: "Chat created/found successfully",
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Chat create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
