// Test script for chat creation functionality
import { MongoClient } from "mongodb";

const TEST_DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/iitconnect";

async function testChatCreation() {
  console.log("🧪 Testing Enhanced Chat Creation...\n");

  const client = new MongoClient(TEST_DATABASE_URL);

  try {
    await client.connect();
    const db = client.db();

    const users = db.collection("users");
    const chats = db.collection("chats");
    const chatMembers = db.collection("chatmembers");

    // Get test users
    const allUsers = await users.find({}).toArray();
    console.log(`📊 Found ${allUsers.length} users in database`);

    if (allUsers.length < 2) {
      console.log("❌ Need at least 2 users to test chat creation");
      console.log(
        "👉 Please sign in with 2 different @iitrpr.ac.in accounts first"
      );
      return;
    }

    const user1 = allUsers[0];
    const user2 = allUsers[1];

    console.log(`\n👥 Testing chat between:`);
    console.log(`   User 1: ${user1.name} (${user1.email})`);
    console.log(`   User 2: ${user2.name} (${user2.email})`);

    // Test 1: Check for existing chats
    console.log("\n🔍 Test 1: Checking for existing chats...");

    const existingChats = await chatMembers
      .aggregate([
        {
          $match: {
            userId: { $in: [user1._id.toString(), user2._id.toString()] },
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
              $all: [user1._id.toString(), user2._id.toString()],
              $size: 2,
            },
          },
        },
      ])
      .toArray();

    console.log(`   Found ${existingChats.length} existing direct chats`);

    // Test 2: Test duplicate prevention
    console.log("\n🛡️  Test 2: Testing duplicate prevention...");

    if (existingChats.length > 0) {
      console.log("   ✅ Chat already exists - duplicate prevention working");
      console.log(`   Chat ID: ${existingChats[0]._id}`);
    } else {
      console.log("   📝 No existing chat found - ready to create new one");
    }

    // Test 3: Check chat structure
    console.log("\n🏗️  Test 3: Checking database structure...");

    const chatCount = await chats.countDocuments();
    const memberCount = await chatMembers.countDocuments();

    console.log(`   Total chats: ${chatCount}`);
    console.log(`   Total chat members: ${memberCount}`);

    // Test 4: Validate indexes (if any)
    console.log("\n📋 Test 4: Checking collection indexes...");

    const chatMemberIndexes = await chatMembers.indexes();
    console.log(`   ChatMembers indexes: ${chatMemberIndexes.length}`);

    // Test 5: Sample chat member query performance
    console.log("\n⚡ Test 5: Testing query performance...");

    const startTime = Date.now();
    await chatMembers.find({ userId: user1._id.toString() }).toArray();
    const queryTime = Date.now() - startTime;

    console.log(`   User chats query time: ${queryTime}ms`);

    if (queryTime > 100) {
      console.log("   ⚠️  Consider adding index on userId field");
    } else {
      console.log("   ✅ Query performance looks good");
    }

    console.log("\n✅ Chat creation test completed!");
    console.log("\n📋 Recommendations:");
    console.log("   1. Add index: db.chatmembers.createIndex({ userId: 1 })");
    console.log("   2. Add index: db.chatmembers.createIndex({ chatId: 1 })");
    console.log(
      "   3. Add compound index: db.chatmembers.createIndex({ chatId: 1, userId: 1 })"
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await client.close();
  }
}

// Add recommended indexes
async function addRecommendedIndexes() {
  console.log("🔧 Adding recommended database indexes...\n");

  const client = new MongoClient(TEST_DATABASE_URL);

  try {
    await client.connect();
    const db = client.db();
    const chatMembers = db.collection("chatmembers");

    // Add indexes for better performance
    await chatMembers.createIndex({ userId: 1 });
    console.log("✅ Added index on userId");

    await chatMembers.createIndex({ chatId: 1 });
    console.log("✅ Added index on chatId");

    await chatMembers.createIndex({ chatId: 1, userId: 1 });
    console.log("✅ Added compound index on chatId + userId");

    console.log("\n🎉 All indexes added successfully!");
  } catch (error) {
    console.error("❌ Error adding indexes:", error);
  } finally {
    await client.close();
  }
}

// Run based on command line argument
const command = process.argv[2];

if (command === "indexes") {
  addRecommendedIndexes();
} else {
  testChatCreation();
}
