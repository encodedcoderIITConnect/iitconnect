// Analyze the specific user with missing department
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.DATABASE_URL;

async function analyzeProblematicUser() {
  console.log("🔍 Analyzing user with missing department...");

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    // Get the user with missing department
    const problematicUser = await usersCollection.findOne({
      email: "amul.24csz0016@iitrpr.ac.in",
    });

    if (problematicUser) {
      console.log("👤 Found problematic user:");
      console.log(JSON.stringify(problematicUser, null, 2));

      // Test the extraction logic on this email
      console.log("\n🧪 Testing extraction logic:");
      const email = problematicUser.email;
      console.log(`Email: ${email}`);

      const emailParts = email.split("@")[0];
      console.log(`Email parts: ${emailParts}`);

      const entryNoMatch = emailParts.match(/\.(\d{2}[a-z]{3}\d{4})$/i);
      console.log(`Entry match: ${entryNoMatch}`);

      const extractedEntryNo = entryNoMatch
        ? entryNoMatch[1].toUpperCase()
        : null;
      console.log(`Extracted entry: ${extractedEntryNo}`);

      if (extractedEntryNo) {
        const deptCode = extractedEntryNo.substring(2, 5);
        console.log(`Department code: ${deptCode}`);

        let department = "";
        switch (deptCode.toUpperCase()) {
          case "CSZ":
            department = "Computer Science and Engineering";
            break;
          case "CHZ":
            department = "Chemical Engineering";
            break;
          case "CEZ":
            department = "Civil Engineering";
            break;
          case "EEZ":
            department = "Electrical Engineering";
            break;
          case "MEZ":
            department = "Mechanical Engineering";
            break;
          case "HSZ":
            department = "Humanities and Social Sciences";
            break;
          case "PHZ":
            department = "Physics";
            break;
          case "CHY":
            department = "Chemistry";
            break;
          case "MTZ":
            department = "Mathematics";
            break;
          default:
            department = "Unknown";
        }
        console.log(`Should be department: ${department}`);

        // Fix this user's data
        const updateResult = await usersCollection.updateOne(
          { email: problematicUser.email },
          {
            $set: {
              department: department,
              entryNo: extractedEntryNo,
              course: extractedEntryNo.startsWith("24") ? "B.Tech" : "Unknown",
              updatedAt: new Date(),
            },
          }
        );
        console.log(
          `✅ Fixed user data. Modified count: ${updateResult.modifiedCount}`
        );
      }
    }

    // Check for any other users that might have similar issues
    console.log("\n🔍 Checking for other potential issues...");

    // Users with missing entry numbers
    const usersWithoutEntry = await usersCollection
      .find({
        email: { $regex: /@iitrpr\.ac\.in$/i },
        $or: [
          { entryNo: { $exists: false } },
          { entryNo: "" },
          { entryNo: null },
        ],
      })
      .toArray();

    if (usersWithoutEntry.length > 0) {
      console.log(
        `❌ Found ${usersWithoutEntry.length} users without entry numbers:`
      );
      usersWithoutEntry.forEach((user) => {
        console.log(`- ${user.email} (${user.name || "No name"})`);
      });
    } else {
      console.log("✅ All IIT users have entry numbers");
    }

    // Users with "Unknown" department
    const usersUnknownDept = await usersCollection
      .find({
        email: { $regex: /@iitrpr\.ac\.in$/i },
        department: "Unknown",
      })
      .toArray();

    if (usersUnknownDept.length > 0) {
      console.log(
        `⚠️ Found ${usersUnknownDept.length} users with 'Unknown' department:`
      );
      usersUnknownDept.forEach((user) => {
        console.log(`- ${user.email} (Entry: ${user.entryNo || "No entry"})`);
      });
    } else {
      console.log("✅ No users with 'Unknown' department");
    }
  } catch (error) {
    console.error("❌ Error during analysis:", error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

analyzeProblematicUser().catch(console.error);
