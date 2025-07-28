// Quick script to show chat relationships
import { MongoClient } from "mongodb";

async function showChatConnections() {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();

  console.log("🔍 Current Chat Connections:\n");

  // Get all collections
  const chats = await db.collection("chats").find({}).toArray();
  const members = await db.collection("chatmembers").find({}).toArray();
  const users = await db.collection("users").find({}).toArray();

  console.log(
    `Found ${chats.length} chats, ${members.length} memberships, ${users.length} users\n`
  );

  // Show each chat and its members
  for (const chat of chats) {
    console.log(`📱 Chat: ${chat._id}`);
    console.log(`   Type: ${chat.isGroup ? "Group" : "Direct"}`);

    const chatMembers = members.filter((m) => m.chatId === chat._id.toString());
    console.log(`   Members (${chatMembers.length}):`);

    for (const member of chatMembers) {
      const user = users.find((u) => u._id.toString() === member.userId);
      console.log(
        `     - ${
          user
            ? user.name + " (" + user.email + ")"
            : "User ID: " + member.userId
        }`
      );
    }
    console.log();
  }

  await client.close();
}

showChatConnections().catch(console.error);
