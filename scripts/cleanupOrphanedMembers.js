// Clean up orphaned chat member records
import { MongoClient } from "mongodb";
import { config } from "dotenv";

config({ path: ".env.local" });

async function cleanupOrphanedChatMembers() {
  console.log("🧹 Cleaning up orphaned chat member records...\n");

  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();

  const chats = db.collection("chats");
  const chatMembers = db.collection("chatmembers");

  // Get all valid chat IDs
  const validChats = await chats.find({}).toArray();
  const validChatIds = validChats.map((chat) => chat._id.toString());

  console.log(`📋 Found ${validChatIds.length} valid chats:`);
  validChatIds.forEach((id) => console.log(`   - ${id}`));

  // Find orphaned chat members
  const allChatMembers = await chatMembers.find({}).toArray();
  const orphanedMembers = allChatMembers.filter(
    (member) => !validChatIds.includes(member.chatId)
  );

  console.log(
    `\n🔍 Found ${orphanedMembers.length} orphaned chat member records:`
  );
  orphanedMembers.forEach((member) => {
    console.log(`   - ChatId: ${member.chatId}, UserId: ${member.userId}`);
  });

  if (orphanedMembers.length > 0) {
    // Remove orphaned records
    const orphanedChatIds = orphanedMembers.map((member) => member.chatId);
    const result = await chatMembers.deleteMany({
      chatId: { $in: orphanedChatIds },
    });

    console.log(
      `\n✅ Removed ${result.deletedCount} orphaned chat member records`
    );
  } else {
    console.log("\n✅ No orphaned records found");
  }

  // Verify cleanup
  const remainingMembers = await chatMembers.find({}).toArray();
  console.log(
    `\n📊 After cleanup: ${remainingMembers.length} chat member records remaining`
  );

  await client.close();
}

cleanupOrphanedChatMembers();
