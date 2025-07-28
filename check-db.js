// Quick database check script
// Run with: node check-db.js

const { MongoClient } = require("mongodb");

async function checkDatabase() {
  try {
    const client = new MongoClient(
      process.env.DATABASE_URL || "mongodb://localhost:27017"
    );
    await client.connect();
    const db = client.db();

    console.log("=== Database Status ===");

    const users = await db.collection("users").find({}).toArray();
    console.log(`Users in database: ${users.length}`);

    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name} (${user.email}) - Username: ${
          user.username
        }`
      );
    });

    if (users.length === 0) {
      console.log(
        "\n❌ No users found! You need to sign in first to create user accounts."
      );
      console.log("👉 Go to: http://localhost:3001/auth/signin");
    } else if (users.length === 1) {
      console.log(
        "\n⚠️  Only 1 user found! You need at least 2 users to test messaging."
      );
      console.log("👉 Create another account or have a friend sign up.");
    } else {
      console.log("\n✅ Multiple users found! Messaging should work.");
    }

    await client.close();
  } catch (error) {
    console.error("Database check error:", error.message);
  }
}

if (require.main === module) {
  checkDatabase();
}

module.exports = checkDatabase;
