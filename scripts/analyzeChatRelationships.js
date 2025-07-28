// Analyze chat relationships in the database
import { MongoClient } from "mongodb";

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/iitconnect";

async function analyzeChatRelationships() {
  console.log("🔍 Analyzing Chat-User Relationships...\n");

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    const db = client.db();

    const users = db.collection("users");
    const chats = db.collection("chats");
    const chatMembers = db.collection("chatmembers");

    // Get all collections data
    const allUsers = await users.find({}).toArray();
    const allChats = await chats.find({}).toArray();
    const allChatMembers = await chatMembers.find({}).toArray();

    console.log("📊 Database Overview:");
    console.log(`   Users: ${allUsers.length}`);
    console.log(`   Chats: ${allChats.length}`);
    console.log(`   Chat Members: ${allChatMembers.length}`);
    console.log();

    // Show all users
    console.log("👥 Users in Database:");
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      ID: ${user._id}`);
      console.log(`      Username: ${user.username || "N/A"}`);
      console.log();
    });

    // Show all chats with their members
    console.log("💬 Chats and Their Members:");
    for (const chat of allChats) {
      console.log(`Chat ID: ${chat._id}`);
      console.log(`   Type: ${chat.isGroup ? "Group Chat" : "Direct Chat"}`);
      console.log(`   Created: ${chat.createdAt}`);

      // Find members of this chat
      const members = await chatMembers
        .find({ chatId: chat._id.toString() })
        .toArray();
      console.log(`   Members (${members.length}):`);

      for (const member of members) {
        const user = allUsers.find((u) => u._id.toString() === member.userId);
        if (user) {
          console.log(`      - ${user.name} (${user.email})`);
          console.log(`        Role: ${member.role || "member"}`);
          console.log(`        Joined: ${member.joinedAt}`);
        } else {
          console.log(`      - Unknown User (ID: ${member.userId})`);
        }
      }
      console.log();
    }

    // Show chat relationships per user
    console.log("🔗 User Chat Relationships:");
    for (const user of allUsers) {
      const userChats = await chatMembers
        .find({ userId: user._id.toString() })
        .toArray();
      console.log(`${user.name} is in ${userChats.length} chat(s):`);

      for (const userChat of userChats) {
        const chat = allChats.find((c) => c._id.toString() === userChat.chatId);
        if (chat) {
          const otherMembers = await chatMembers
            .find({
              chatId: userChat.chatId,
              userId: { $ne: user._id.toString() },
            })
            .toArray();

          if (chat.isGroup) {
            console.log(
              `   - Group Chat (${otherMembers.length} other members)`
            );
          } else {
            if (otherMembers.length > 0) {
              const otherUser = allUsers.find(
                (u) => u._id.toString() === otherMembers[0].userId
              );
              console.log(
                `   - Direct chat with ${
                  otherUser ? otherUser.name : "Unknown User"
                }`
              );
            } else {
              console.log(`   - Direct chat (other user not found)`);
            }
          }
          console.log(`     Chat ID: ${chat._id}`);
        }
      }
      console.log();
    }

    // Check for any orphaned records
    console.log("🔧 Data Integrity Check:");

    // Check for chat members without valid chats
    const orphanedMembers = [];
    for (const member of allChatMembers) {
      const chat = allChats.find((c) => c._id.toString() === member.chatId);
      if (!chat) {
        orphanedMembers.push(member);
      }
    }

    // Check for chat members without valid users
    const invalidUsers = [];
    for (const member of allChatMembers) {
      const user = allUsers.find((u) => u._id.toString() === member.userId);
      if (!user) {
        invalidUsers.push(member);
      }
    }

    if (orphanedMembers.length > 0) {
      console.log(
        `   ⚠️  Found ${orphanedMembers.length} chat members without valid chats`
      );
    }

    if (invalidUsers.length > 0) {
      console.log(
        `   ⚠️  Found ${invalidUsers.length} chat members without valid users`
      );
    }

    if (orphanedMembers.length === 0 && invalidUsers.length === 0) {
      console.log("   ✅ All relationships are valid");
    }

    console.log("\n✅ Analysis complete!");
  } catch (error) {
    console.error("❌ Analysis failed:", error);
  } finally {
    await client.close();
  }
}

// Run the analysis
analyzeChatRelationships();
