// Debug script to test chat loading issues
import { MongoClient, ObjectId } from "mongodb";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;

async function debugChatLoading() {
  console.log("🐛 Debugging Chat Loading Issues...\n");
  console.log(
    "🔗 Database URL:",
    DATABASE_URL ? "Found in .env.local" : "NOT FOUND"
  );

  if (!DATABASE_URL) {
    console.log("❌ DATABASE_URL not found in environment variables!");
    return;
  }

  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    const db = client.db();

    const users = db.collection("users");
    const chats = db.collection("chats");
    const chatMembers = db.collection("chatmembers");

    // Get sample data
    const allUsers = await users.find({}).toArray();
    const allChats = await chats.find({}).toArray();
    const allChatMembers = await chatMembers.find({}).toArray();

    console.log("📊 Database Overview:");
    console.log(`   Users: ${allUsers.length}`);
    console.log(`   Chats: ${allChats.length}`);
    console.log(`   Chat Members: ${allChatMembers.length}\n`);

    if (allUsers.length === 0) {
      console.log("❌ No users found! Cannot test chat loading.");
      return;
    }

    // Test with first user
    const testUser = allUsers[0];
    console.log(
      `🧪 Testing chat loading for user: ${testUser.name} (${testUser.email})\n`
    );

    // Show raw data types
    console.log("🔍 Data Type Analysis:");
    console.log("Users _id type:", typeof testUser._id, testUser._id);
    if (allChats.length > 0) {
      console.log("Chats _id type:", typeof allChats[0]._id, allChats[0]._id);
    }
    if (allChatMembers.length > 0) {
      console.log(
        "ChatMembers chatId type:",
        typeof allChatMembers[0].chatId,
        allChatMembers[0].chatId
      );
      console.log(
        "ChatMembers userId type:",
        typeof allChatMembers[0].userId,
        allChatMembers[0].userId
      );
    }
    console.log();

    // Test 1: Find user's chat memberships
    console.log("🔍 Test 1: Find user chat memberships...");
    const userMemberships = await chatMembers
      .find({
        userId: testUser._id.toString(),
      })
      .toArray();
    console.log(`   Found ${userMemberships.length} memberships for user`);
    userMemberships.forEach((membership) => {
      console.log(
        `     ChatId: ${membership.chatId} (type: ${typeof membership.chatId})`
      );
    });
    console.log();

    // Test 2: Test the problematic lookup
    console.log("🔍 Test 2: Testing chat lookup with ObjectId conversion...");

    if (userMemberships.length > 0) {
      const testChatId = userMemberships[0].chatId;
      console.log(`   Looking for chat with ID: ${testChatId}`);

      // Try to find chat by string ID
      const chatByString = await chats.findOne({ _id: testChatId });
      console.log(`   Found by string: ${chatByString ? "YES" : "NO"}`);

      // Try to find chat by ObjectId
      try {
        const chatByObjectId = await chats.findOne({
          _id: new ObjectId(testChatId),
        });
        console.log(`   Found by ObjectId: ${chatByObjectId ? "YES" : "NO"}`);
      } catch (error) {
        console.log(`   ObjectId conversion failed: ${error.message}`);
      }
    }
    console.log();

    // Test 3: Test the fixed aggregation
    console.log("🔍 Test 3: Testing FIXED aggregation pipeline...");

    const fixedUserChats = await chatMembers
      .aggregate([
        {
          $match: { userId: testUser._id.toString() },
        },
        {
          $addFields: {
            chatObjectId: { $toObjectId: "$chatId" },
          },
        },
        {
          $lookup: {
            from: "chats",
            localField: "chatObjectId", // Use converted ObjectId
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
            pipeline: [{ $match: { $expr: { $in: ["$_id", "$$memberIds"] } } }],
            as: "memberUsers",
          },
        },
      ])
      .toArray();

    console.log(`   Fixed aggregation returned ${fixedUserChats.length} chats`);

    fixedUserChats.forEach((chatData, index) => {
      console.log(`   Chat ${index + 1}:`);
      console.log(`     ID: ${chatData.chat._id}`);
      console.log(`     Type: ${chatData.chat.isGroup ? "Group" : "Direct"}`);
      console.log(`     Members: ${chatData.memberUsers.length}`);
      chatData.memberUsers.forEach((user) => {
        console.log(`       - ${user.name}`);
      });
    });

    console.log("\n✅ Debug analysis complete!");
    console.log("\n🔧 ISSUE IDENTIFIED:");
    console.log(
      "   The problem is ObjectId vs String mismatch in $lookup operations."
    );
    console.log(
      "   ChatMembers store chatId as strings, but chats._id are ObjectIds."
    );
    console.log("\n💡 SOLUTION:");
    console.log(
      "   Use $toObjectId in aggregation pipeline to convert strings to ObjectIds."
    );
  } catch (error) {
    console.error("❌ Debug failed:", error);
  } finally {
    await client.close();
  }
}

// Run the debug
debugChatLoading();
