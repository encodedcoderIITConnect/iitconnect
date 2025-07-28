// Check which users have active chats
import { MongoClient } from "mongodb";
import { config } from "dotenv";

config({ path: ".env.local" });

async function checkActiveUsers() {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();

  const users = await db.collection("users").find({}).toArray();
  const chatMembers = await db.collection("chatmembers").find({}).toArray();

  console.log("👥 Users and their chat memberships:\n");

  for (const user of users) {
    const userChats = chatMembers.filter(
      (m) => m.userId === user._id.toString()
    );
    console.log(`${user.name} (${user.email})`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Chats: ${userChats.length}`);
    userChats.forEach((chat) => {
      console.log(`     - Chat: ${chat.chatId}`);
    });
    console.log();
  }

  await client.close();
}

checkActiveUsers();
