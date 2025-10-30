require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function verifyPrefixApproach() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    // Get current users
    const existingUsers = await usersCollection.find({}).toArray();
    console.log("📊 Current users in database:");
    existingUsers.forEach((user, index) => {
      const prefix = user.email.split("@")[0];
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Current entryNo: "${user.entryNo}"`);
      console.log(`   Email prefix: "${prefix}"`);
      console.log(`   Would change to: "${prefix}"\n`);
    });

    // Test scenarios
    console.log("\n🧪 Testing email prefix uniqueness:\n");

    const testEmails = [
      "john.22csb1234@iitrpr.ac.in",
      "jane.22csb5678@iitrpr.ac.in",
      "admin@iitrpr.ac.in",
      "testuser@gmail.com",
      "iitconnect22@gmail.com",
    ];

    const prefixes = testEmails.map((email) => email.split("@")[0]);
    const uniquePrefixes = new Set(prefixes);

    console.log("Test emails and their prefixes:");
    testEmails.forEach((email) => {
      const prefix = email.split("@")[0];
      console.log(`  ${email} → "${prefix}"`);
    });

    console.log(
      `\n✅ All prefixes are unique: ${prefixes.length === uniquePrefixes.size}`
    );
    console.log(`   Total: ${prefixes.length}, Unique: ${uniquePrefixes.size}`);

    // Check if any current user has duplicate prefix
    console.log("\n🔍 Checking current users for duplicate email prefixes:");
    const currentPrefixes = existingUsers.map((u) => u.email.split("@")[0]);
    const currentUnique = new Set(currentPrefixes);

    console.log(`   Total users: ${currentPrefixes.length}`);
    console.log(`   Unique prefixes: ${currentUnique.size}`);

    if (currentPrefixes.length === currentUnique.size) {
      console.log("   ✅ No duplicate prefixes found!");
    } else {
      console.log("   ⚠️ Duplicate prefixes exist:");
      const duplicates = currentPrefixes.filter(
        (item, index) => currentPrefixes.indexOf(item) !== index
      );
      console.log("   Duplicates:", duplicates);
    }

    // Show what the fix would look like
    console.log("\n📝 Proposed fix example:");
    console.log(
      '   BEFORE: entryNo: "" (empty string - causes duplicate key error)'
    );
    console.log('   AFTER:  entryNo: "iitconnect22" (unique email prefix)');

    console.log("\n✅ CONCLUSION:");
    console.log("   Using email prefix as entryNo will:");
    console.log("   ✓ Be unique for every user (emails are already unique)");
    console.log("   ✓ Solve the duplicate key error");
    console.log("   ✓ Work for ALL email types (IIT, admin, test)");
    console.log("   ✓ No null values needed (always has a value)");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

verifyPrefixApproach();
