import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new MongoClient(process.env.DATABASE_URL);

async function debugMessages() {
  try {
    await client.connect();
    const db = client.db();

    console.log("🔍 Debugging Chat Messages...\n");

    // Check chatmembers data types
    console.log("📋 Chat Members:");
    const chatMembers = await db.collection("chatmembers").find({}).toArray();
    chatMembers.forEach((member) => {
      console.log(`  - User: ${member.userId} (type: ${typeof member.userId})`);
      console.log(`    Chat: ${member.chatId} (type: ${typeof member.chatId})`);
      console.log("");
    });

    // Check messages data types
    console.log("💬 Messages:");
    const messages = await db.collection("messages").find({}).toArray();
    console.log(`Found ${messages.length} messages`);
    messages.forEach((msg) => {
      console.log(`  - Message ID: ${msg._id}`);
      console.log(`    Chat: ${msg.chatId} (type: ${typeof msg.chatId})`);
      console.log(`    Sender: ${msg.senderId} (type: ${typeof msg.senderId})`);
      console.log(`    Content: ${msg.content.substring(0, 50)}...`);
      console.log("");
    });

    // Check users data types
    console.log("👥 Users:");
    const users = await db.collection("users").find({}).toArray();
    users.forEach((user) => {
      console.log(`  - User: ${user.name} (${user.email})`);
      console.log(`    ID: ${user._id} (type: ${typeof user._id})`);
      console.log("");
    });

    // Test a specific chat lookup
    console.log(
      "🧪 Testing message lookup for chat 688784f474707b40855084f5..."
    );

    const testChatId = "688784f474707b40855084f5";
    const testMessages = await db
      .collection("messages")
      .aggregate([
        {
          $match: { chatId: testChatId },
        },
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "sender",
          },
        },
      ])
      .toArray();

    console.log(`Found ${testMessages.length} messages for chat ${testChatId}`);
    testMessages.forEach((msg) => {
      console.log(`  - Message: ${msg.content}`);
      console.log(`    Sender lookup result: ${msg.sender.length} users found`);
      if (msg.sender.length > 0) {
        console.log(`    Sender: ${msg.sender[0].name}`);
      }
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

debugMessages();
