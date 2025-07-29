import { NextResponse } from "next/server";
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
    messageReads: db.collection("messagereads"),
  };
}

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { client, users, chatMembers, messages, messageReads } =
      await getCollections();

    try {
      // Find current user
      const currentUser = await users.findOne({ email: session.user.email });
      if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Get all chats where the user is a member
      const userChats = await chatMembers
        .aggregate([
          {
            $match: { userId: currentUser._id.toString() },
          },
          {
            $addFields: {
              chatObjectId: { $toObjectId: "$chatId" },
            },
          },
          {
            $lookup: {
              from: "chats",
              localField: "chatObjectId",
              foreignField: "_id",
              as: "chat",
            },
          },
          {
            $unwind: "$chat",
          },
          {
            $lookup: {
              from: "chatmembers",
              localField: "chatId",
              foreignField: "chatId",
              as: "allMembers",
            },
          },
          {
            $lookup: {
              from: "users",
              let: {
                memberIds: {
                  $map: {
                    input: "$allMembers",
                    as: "member",
                    in: { $toObjectId: "$$member.userId" },
                  },
                },
              },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$memberIds"] } } },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    image: 1,
                    email: 1,
                  },
                },
              ],
              as: "memberUsers",
            },
          },
          {
            $lookup: {
              from: "messages",
              localField: "chatId",
              foreignField: "chatId",
              as: "lastMessage",
              pipeline: [
                { $sort: { createdAt: -1 } },
                { $limit: 1 },
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
                        $project: {
                          _id: 1,
                          name: 1,
                          username: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: {
                    path: "$sender",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
            },
          },
        ])
        .toArray();

      // Format the chat data
      const formattedChats = await Promise.all(
        userChats.map(async (chatData) => {
          const chat = chatData.chat;
          const otherMembers = chatData.memberUsers.filter(
            (member: { _id: object }) =>
              member._id.toString() !== currentUser._id.toString()
          );

          const lastMessage = chatData.lastMessage[0] || null;

          // Calculate unread count for this chat
          let unreadCount = 0;
          try {
            // Get user's last read message for this chat
            const userReadStatus = await messageReads.findOne({
              userId: currentUser._id.toString(),
              chatId: chat._id.toString(),
            });

            if (userReadStatus && userReadStatus.lastReadMessageId) {
              // Count messages after the last read message
              const lastReadMessage = await messages.findOne({
                _id: new ObjectId(userReadStatus.lastReadMessageId),
              });

              if (lastReadMessage) {
                unreadCount = await messages.countDocuments({
                  chatId: chat._id.toString(),
                  createdAt: { $gt: lastReadMessage.createdAt },
                  senderId: { $ne: currentUser._id.toString() }, // Don't count own messages as unread
                });
              } else {
                // Last read message not found, count all messages from others
                unreadCount = await messages.countDocuments({
                  chatId: chat._id.toString(),
                  senderId: { $ne: currentUser._id.toString() },
                });
              }
            } else {
              // No read status found, count all messages from others as unread
              unreadCount = await messages.countDocuments({
                chatId: chat._id.toString(),
                senderId: { $ne: currentUser._id.toString() },
              });
            }
          } catch (error) {
            console.error("Error calculating unread count:", error);
            unreadCount = 0;
          }

          // For direct chats, use the other user's info
          let chatName, chatAvatar;
          if (chat.isGroup) {
            chatName = chat.name || "Group Chat";
            chatAvatar =
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100";
          } else {
            const otherUser = otherMembers[0];
            chatName = otherUser ? otherUser.name : "Unknown User";
            chatAvatar =
              otherUser?.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                otherUser?.name || "Unknown"
              )}&background=3b82f6&color=ffffff&size=100`;
          }

          return {
            id: chat._id.toString(),
            name: chatName,
            type: chat.isGroup ? "group" : "direct",
            avatar: chatAvatar,
            lastMessage: lastMessage ? lastMessage.content : "No messages yet",
            lastMessageTime: lastMessage
              ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            lastMessageSender: lastMessage?.sender?.name || "",
            unreadCount: unreadCount,
            isOnline: false, // TODO: Implement online status
            participants: chatData.memberUsers.map(
              (user: { name: string }) => user.name
            ),
            otherMembers,
            createdAt: chat.createdAt,
          };
        })
      );

      // Sort by last message time (most recent first)
      formattedChats.sort((a, b) => {
        if (!a.lastMessageTime && !b.lastMessageTime) return 0;
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      return NextResponse.json({
        success: true,
        chats: formattedChats,
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
