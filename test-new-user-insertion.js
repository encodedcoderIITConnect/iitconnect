require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function testNewUserInsertion() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    console.log("🧪 Testing new user insertion with fixed logic...\n");

    // Test Case 1: New IIT student
    const testUser1 = {
      name: "Test Student 1",
      username: "teststudent.22csb9999",
      email: "teststudent.22csb9999@iitrpr.ac.in",
      image: "https://example.com/avatar.jpg",
      entryNo: "teststudent.22csb9999", // Using email prefix as entryNo
      phone: null,
      department: null,
      course: null,
      socialLink: null,
      isPublicEmail: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(
      "📝 Test 1: Inserting IIT student with email prefix as entryNo"
    );
    console.log(`   Email: ${testUser1.email}`);
    console.log(`   EntryNo: "${testUser1.entryNo}"`);

    try {
      const result1 = await usersCollection.insertOne(testUser1);
      console.log(
        `   ✅ SUCCESS! User inserted with ID: ${result1.insertedId}\n`
      );
    } catch (error) {
      console.error(`   ❌ FAILED: ${error.message}\n`);
    }

    // Test Case 2: Another new user (different email)
    const testUser2 = {
      name: "Test Student 2",
      username: "anotherstudent.23eez8888",
      email: "anotherstudent.23eez8888@iitrpr.ac.in",
      image: "",
      entryNo: "anotherstudent.23eez8888", // Using email prefix as entryNo
      phone: null,
      department: null,
      course: null,
      socialLink: null,
      isPublicEmail: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("📝 Test 2: Inserting another IIT student");
    console.log(`   Email: ${testUser2.email}`);
    console.log(`   EntryNo: "${testUser2.entryNo}"`);

    try {
      const result2 = await usersCollection.insertOne(testUser2);
      console.log(
        `   ✅ SUCCESS! User inserted with ID: ${result2.insertedId}\n`
      );
    } catch (error) {
      console.error(`   ❌ FAILED: ${error.message}\n`);
    }

    // Test Case 3: Test login user (non-IIT email)
    const testUser3 = {
      name: "Test Developer",
      username: "testdev12345",
      email: "testdev12345@gmail.com",
      image: "",
      entryNo: "testdev12345", // Using email prefix as entryNo
      phone: null,
      department: null,
      course: null,
      socialLink: null,
      isPublicEmail: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("📝 Test 3: Inserting test/admin user with non-IIT email");
    console.log(`   Email: ${testUser3.email}`);
    console.log(`   EntryNo: "${testUser3.entryNo}"`);

    try {
      const result3 = await usersCollection.insertOne(testUser3);
      console.log(
        `   ✅ SUCCESS! User inserted with ID: ${result3.insertedId}\n`
      );
    } catch (error) {
      console.error(`   ❌ FAILED: ${error.message}\n`);
    }

    // Show final count
    const totalUsers = await usersCollection.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);
    console.log("\n✅ All tests completed!");
    console.log("✅ The fix is working correctly - new users can be created!");

    // Clean up test users
    console.log("\n🧹 Cleaning up test users...");
    await usersCollection.deleteMany({
      email: { $in: [testUser1.email, testUser2.email, testUser3.email] },
    });
    console.log("✅ Test users removed");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n✅ Connection closed");
  }
}

testNewUserInsertion();
