require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function testInsert() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error("❌ DATABASE_URL not found in environment");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    // Test 1: Try to insert a user with empty entryNo
    console.log("\n📝 Test 1: Inserting user with empty entryNo...");
    const testUser1 = {
      name: "Test User 1",
      username: "testuser1.22csb1234",
      email: "testuser1.22csb1234@iitrpr.ac.in",
      image: "",
      entryNo: "", // Empty string - this might cause issues with unique constraint
      phone: "",
      department: "",
      course: "",
      socialLink: "",
      isPublicEmail: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result1 = await usersCollection.insertOne(testUser1);
      console.log("✅ User 1 inserted with ID:", result1.insertedId);
    } catch (error) {
      console.error("❌ Error inserting user 1:", error.message);
    }

    // Test 2: Try to insert another user with empty entryNo
    console.log("\n📝 Test 2: Inserting another user with empty entryNo...");
    const testUser2 = {
      name: "Test User 2",
      username: "testuser2.22eez5678",
      email: "testuser2.22eez5678@iitrpr.ac.in",
      image: "",
      entryNo: "", // Empty string - this will conflict if unique
      phone: "",
      department: "",
      course: "",
      socialLink: "",
      isPublicEmail: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result2 = await usersCollection.insertOne(testUser2);
      console.log("✅ User 2 inserted with ID:", result2.insertedId);
    } catch (error) {
      console.error("❌ Error inserting user 2:", error.message);
      console.error("❌ Error code:", error.code);
      if (error.code === 11000) {
        console.error("🔍 Duplicate key error detected!");
        console.error("🔍 Conflicting field:", JSON.stringify(error.keyValue));
      }
    }

    // Check current users
    console.log("\n📊 Current users in database:");
    const users = await usersCollection.find({}).toArray();
    console.log(`Total users: ${users.length}`);
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name} (${user.email}) - entryNo: "${
          user.entryNo
        }"`
      );
    });

    // Check for unique indexes
    console.log("\n🔍 Checking indexes on users collection:");
    const indexes = await usersCollection.indexes();
    indexes.forEach((index) => {
      console.log(
        `- ${index.name}:`,
        JSON.stringify(index.key),
        index.unique ? "(UNIQUE)" : ""
      );
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n✅ Connection closed");
  }
}

testInsert();
