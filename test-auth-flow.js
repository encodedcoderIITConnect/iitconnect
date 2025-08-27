// Test authentication flow for a specific IIT Ropar email
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.DATABASE_URL;

// Simulate the auth process for a specific user
async function testAuthFlow() {
  console.log("🧪 Testing authentication flow...");

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    // Test with a sample IIT Ropar email
    const testUser = {
      name: "Test Student",
      email: "test.24csz0099@iitrpr.ac.in",
      image: "https://lh3.googleusercontent.com/test-image",
    };

    console.log(`📧 Testing with email: ${testUser.email}`);

    // Step 1: Check domain validation
    const isIITEmail =
      testUser.email && testUser.email.endsWith("@iitrpr.ac.in");
    console.log(`✅ Domain check: ${isIITEmail ? "PASS" : "FAIL"}`);

    // Step 2: Check if user exists
    const existingUser = await usersCollection.findOne({
      email: testUser.email,
    });
    console.log(`👤 User exists: ${existingUser ? "YES" : "NO"}`);

    if (!existingUser) {
      console.log("🆕 Would create new user...");

      // Extract entry number and other info (same logic as in auth.ts)
      const emailParts = testUser.email.split("@")[0];
      const entryNoMatch = emailParts.match(/\.(\d{2}[a-z]{3}\d{4})$/i);
      const extractedEntryNo = entryNoMatch
        ? entryNoMatch[1].toUpperCase()
        : null;

      console.log(`📋 Extracted entry number: ${extractedEntryNo}`);

      // Extract department
      let department = "";
      if (extractedEntryNo) {
        const deptCode = extractedEntryNo.substring(2, 5);
        console.log(`🏢 Department code: ${deptCode}`);
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
          default:
            department = "Unknown";
        }
      }

      const course =
        extractedEntryNo && extractedEntryNo.startsWith("24")
          ? "B.Tech"
          : "Unknown";
      const username = testUser.email.split("@")[0];

      const newUser = {
        name: testUser.name || "",
        username: username,
        email: testUser.email,
        image: testUser.image || "",
        entryNo: extractedEntryNo,
        phone: "",
        department: department,
        course: course,
        socialLink: "",
        isPublicEmail: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log(`💾 Would create user:`, {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        entryNo: newUser.entryNo,
        department: newUser.department,
        course: newUser.course,
      });

      // Simulate insertion (don't actually insert)
      console.log("✅ User creation would succeed");
    } else {
      console.log("🔄 Would update existing user...");

      const username = testUser.email.split("@")[0];
      const updateData = {
        updatedAt: new Date(),
      };

      if (username && username !== existingUser.username) {
        updateData.username = username;
        console.log(
          `👤 Would update username: "${
            existingUser.username || "no username"
          }" -> "${username}"`
        );
      }

      if (testUser.image && testUser.image !== existingUser.image) {
        updateData.image = testUser.image;
        console.log(
          `🖼️ Would update image: "${existingUser.image || "no image"}" -> "${
            testUser.image
          }"`
        );
      }

      if (testUser.name && testUser.name !== existingUser.name) {
        updateData.name = testUser.name;
        console.log(
          `📝 Would update name: "${existingUser.name}" -> "${testUser.name}"`
        );
      }

      console.log("✅ User update would succeed");
    }

    // Test recent user creation patterns
    console.log("\n📊 Recent user creation analysis:");
    const recentUsers = await usersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    recentUsers.forEach((user) => {
      const createdDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "Unknown";
      console.log(
        `${user.email} - Created: ${createdDate} - Dept: ${
          user.department || "No dept"
        }`
      );
    });

    // Check for any users missing department info
    console.log("\n❓ Users with missing department info:");
    const usersWithoutDept = await usersCollection
      .find({
        email: { $regex: /@iitrpr\.ac\.in$/i },
        $or: [
          { department: { $exists: false } },
          { department: "" },
          { department: "No department" },
          { department: null },
        ],
      })
      .toArray();

    if (usersWithoutDept.length > 0) {
      console.log(
        `Found ${usersWithoutDept.length} users without proper department:`
      );
      usersWithoutDept.forEach((user) => {
        console.log(
          `- ${user.email} (${user.name || "No name"}) - Dept: "${
            user.department || "undefined"
          }"`
        );
      });
    } else {
      console.log("✅ All IIT users have department information");
    }
  } catch (error) {
    console.error("❌ Error during test:", error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testAuthFlow().catch(console.error);
