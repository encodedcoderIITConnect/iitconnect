// Debug script to check MongoDB connection and users collection
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.DATABASE_URL;

async function debugAuth() {
  console.log("🔍 Starting authentication debug...");
  console.log("📁 DATABASE_URL configured:", !!uri);

  if (!uri) {
    console.error("❌ DATABASE_URL not found in environment variables");
    return;
  }

  let client;
  try {
    console.log("🔗 Connecting to MongoDB...");
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB successfully");

    const db = client.db("iitconnect");
    console.log("✅ Connected to database: iitconnect");

    const usersCollection = db.collection("users");

    // Count total users
    const totalUsers = await usersCollection.countDocuments();
    console.log(`👥 Total users in collection: ${totalUsers}`);

    // Count IIT Ropar users
    const iitUsers = await usersCollection.countDocuments({
      email: { $regex: /@iitrpr\.ac\.in$/i },
    });
    console.log(`🎓 IIT Ropar users: ${iitUsers}`);

    // Count test users
    const testUsers = await usersCollection.countDocuments({
      department: "Test Account",
    });
    console.log(`🧪 Test users: ${testUsers}`);

    // Count admin users
    const adminUsers = await usersCollection.countDocuments({
      department: "Administration",
    });
    console.log(`👑 Admin users: ${adminUsers}`);

    // Get recent users (last 10)
    console.log("\n📋 Recent users:");
    const recentUsers = await usersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    recentUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name || "No name"} (${user.email}) - ${
          user.department || "No department"
        } - Created: ${
          user.createdAt ? user.createdAt.toISOString() : "No date"
        }`
      );
    });

    // Check for specific IIT email pattern users
    console.log("\n🎓 IIT Ropar users in collection:");
    const iitUsersList = await usersCollection
      .find({ email: { $regex: /@iitrpr\.ac\.in$/i } })
      .limit(5)
      .toArray();

    if (iitUsersList.length === 0) {
      console.log("❌ No IIT Ropar users found in the collection!");
    } else {
      iitUsersList.forEach((user, index) => {
        console.log(
          `${index + 1}. ${user.name || "No name"} (${user.email}) - Entry: ${
            user.entryNo || "No entry"
          } - Dept: ${user.department || "No department"}`
        );
      });
    }

    // Check collection indexes
    console.log("\n📊 Collection indexes:");
    const indexes = await usersCollection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - ${index.name}`);
    });
  } catch (error) {
    console.error("❌ Error during debug:", error);
    console.error("❌ Error details:", {
      message: error.message,
      name: error.name,
      code: error.code,
    });
  } finally {
    if (client) {
      await client.close();
      console.log("🔐 MongoDB connection closed");
    }
  }
}

debugAuth().catch(console.error);
