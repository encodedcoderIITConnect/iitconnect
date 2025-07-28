import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new MongoClient(process.env.DATABASE_URL);

async function testMessagesAPI() {
  try {
    await client.connect();
    const db = client.db();

    console.log("🧪 Testing Fixed Messages API...\n");

    const testChatId = "688784f474707b40855084f5";
    console.log(`🔍 Testing messages for chat: ${testChatId}`);

    // Test the fixed aggregation pipeline
    const chatMessages = await db
      .collection("messages")
      .aggregate([
        {
          $match: { chatId: testChatId },
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

    console.log(`📊 Found ${chatMessages.length} messages`);

    chatMessages.forEach((msg, index) => {
      console.log(`💬 Message ${index + 1}:`);
      console.log(`   Content: ${msg.content}`);
      console.log(`   Sender: ${msg.sender.name}`);
      console.log(`   Sender ID: ${msg.senderId} (original string)`);
      console.log(`   Sender ObjectId: ${msg.senderObjectId} (converted)`);
      console.log(`   Created: ${new Date(msg.createdAt).toLocaleString()}`);
      console.log("");
    });

    if (chatMessages.length > 0) {
      console.log("✅ Messages API is working correctly!");
    } else {
      console.log("⚠️ No messages found or lookup still failing");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

testMessagesAPI();
