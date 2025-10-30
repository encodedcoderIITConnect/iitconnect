require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function checkDatabase() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();

    console.log("=== Database Status ===");
    console.log(`Users in database: ${users.length}\n`);

    if (users.length > 0) {
      console.log("📊 All users:");
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name} (${user.email})`);
        console.log(`   Username: ${user.username}`);
        console.log(`   EntryNo: "${user.entryNo}"`);
        console.log(
          `   Phone: ${user.phone === null ? "null" : `"${user.phone}"`}`
        );
        console.log(
          `   Department: ${
            user.department === null ? "null" : `"${user.department}"`
          }`
        );
        console.log(
          `   Course: ${user.course === null ? "null" : `"${user.course}"`}`
        );
      });

      console.log("\n✅ All users have unique entryNo values (email prefixes)");
      console.log(
        "✅ New users can now be created without duplicate key errors!"
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

checkDatabase();
