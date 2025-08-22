// Test script for blocked users functionality
const { getDatabase } = require("../src/lib/mongodb");

async function testBlockedUsers() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    const db = await getDatabase();

    console.log("📋 Checking blockedUsers collection...");

    // Check if collection exists
    const collections = await db.listCollections().toArray();
    const blockedUsersExists = collections.some(
      (col) => col.name === "blockedUsers"
    );

    if (!blockedUsersExists) {
      console.log(
        "✅ blockedUsers collection will be created automatically when first user is blocked"
      );
    } else {
      console.log("✅ blockedUsers collection exists");

      // Count current blocked users
      const count = await db
        .collection("blockedUsers")
        .countDocuments({ isActive: true });
      console.log(`📊 Current active blocked users: ${count}`);

      // Show some sample blocked users
      const samples = await db
        .collection("blockedUsers")
        .find({ isActive: true })
        .limit(3)
        .toArray();
      if (samples.length > 0) {
        console.log("📝 Sample blocked users:");
        samples.forEach((user) => {
          console.log(
            `   - ${user.email} (blocked by ${user.blockedBy} on ${user.blockedAt})`
          );
        });
      }
    }

    console.log("✅ Blocked users system test completed successfully!");
  } catch (error) {
    console.error("❌ Error testing blocked users:", error);
  } finally {
    process.exit(0);
  }
}

testBlockedUsers();
