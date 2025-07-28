// Quick script to check chat ID mismatches
import { MongoClient } from "mongodb";
import { config } from "dotenv";

config({ path: ".env.local" });

async function checkChatIds() {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();

  const chats = await db.collection("chats").find({}).toArray();
  const chatMembers = await db.collection("chatmembers").find({}).toArray();

  console.log("📋 Actual Chat IDs in chats collection:");
  chats.forEach((chat) => {
    console.log(`   ${chat._id.toString()}`);
  });

  console.log("\n📋 Chat IDs referenced in chatmembers:");
  const uniqueChatIds = [...new Set(chatMembers.map((m) => m.chatId))];
  uniqueChatIds.forEach((chatId) => {
    console.log(`   ${chatId}`);
  });

  console.log("\n🔍 Checking for matches:");
  uniqueChatIds.forEach((chatId) => {
    const exists = chats.some((chat) => chat._id.toString() === chatId);
    console.log(`   ${chatId}: ${exists ? "✅ MATCH" : "❌ NO MATCH"}`);
  });

  await client.close();
}

checkChatIds();
