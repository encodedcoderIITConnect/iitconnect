require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function fixExistingUsers() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error("❌ DATABASE_URL not found in environment");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    // Find users with empty entryNo or "null" string
    console.log('🔍 Finding users with empty or "null" entryNo...\n');
    const usersToFix = await usersCollection
      .find({
        $or: [{ entryNo: "" }, { entryNo: "null" }],
      })
      .toArray();

    console.log(`Found ${usersToFix.length} user(s) to fix:\n`);

    if (usersToFix.length === 0) {
      console.log("✅ No users need fixing!");
      return;
    }

    for (const user of usersToFix) {
      const emailPrefix = user.email.split("@")[0];
      console.log(`📝 Fixing user: ${user.email}`);
      console.log(`   Current entryNo: "${user.entryNo}"`);
      console.log(`   New entryNo: "${emailPrefix}"`);

      const result = await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            entryNo: emailPrefix,
            phone: user.phone === "" ? null : user.phone,
            department: user.department === "" ? null : user.department,
            course: user.course === "" ? null : user.course,
            socialLink: user.socialLink === "" ? null : user.socialLink,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`   ✅ Updated successfully\n`);
      } else {
        console.log(`   ⚠️ No changes made\n`);
      }
    }

    // Verify all users now have proper entryNo
    console.log("\n🔍 Verifying all users after fix...\n");
    const allUsers = await usersCollection.find({}).toArray();

    console.log("📊 All users in database:");
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   entryNo: "${user.entryNo}"`);
      console.log(
        `   phone: ${user.phone === null ? "null" : `"${user.phone}"`}`
      );
      console.log(
        `   department: ${
          user.department === null ? "null" : `"${user.department}"`
        }\n`
      );
    });

    console.log("✅ Fix completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n✅ Connection closed");
  }
}

fixExistingUsers();
