// Test MongoDB connection and user creation
import { getUsersCollection } from "@/lib/mongodb";

async function testConnection() {
  try {
    console.log("🔍 Testing MongoDB connection...");
    const usersCollection = await getUsersCollection();

    // Test query to see if we can connect
    const userCount = await usersCollection.countDocuments();
    console.log(`✅ Connected! Found ${userCount} users in collection`);

    // List all users
    const users = await usersCollection.find({}).toArray();
    console.log(
      "👥 Current users in database:",
      users.map((u) => ({
        name: u.name,
        email: u.email,
        entryNo: u.entryNo,
        department: u.department,
      }))
    );

    return { success: true, userCount, users };
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    return { success: false, error };
  }
}

export { testConnection };
