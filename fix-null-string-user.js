require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

async function fixUserWithNullString() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    // Find the specific user with "null" string entryNo
    const user = await usersCollection.findOne({
      email: "2023csm1014@iitrpr.ac.in",
    });

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log(`📝 Fixing user: ${user.email}`);
    console.log(`   Current entryNo: "${user.entryNo}"`);

    const emailPrefix = user.email.split("@")[0];
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

    // Verify
    const updatedUser = await usersCollection.findOne({
      email: "2023csm1014@iitrpr.ac.in",
    });
    console.log("✅ Verification:");
    console.log(`   entryNo: "${updatedUser.entryNo}"`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

fixUserWithNullString();
