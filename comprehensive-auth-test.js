// Comprehensive authentication test and improvement
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.DATABASE_URL;

async function comprehensiveAuthTest() {
  console.log("🔍 Running comprehensive authentication analysis...");

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("iitconnect");
    const usersCollection = db.collection("users");

    // Test various edge cases
    const testCases = [
      // Valid cases
      {
        email: "student.24csz0001@iitrpr.ac.in",
        name: "Valid CSE Student",
        shouldPass: true,
      },
      {
        email: "user.23chz0002@iitrpr.ac.in",
        name: "Valid CHE Student",
        shouldPass: true,
      },
      {
        email: "test.25eez0003@iitrpr.ac.in",
        name: "Valid EEE Student",
        shouldPass: true,
      },

      // Edge cases that might cause issues
      {
        email: "name.24xyz0001@iitrpr.ac.in",
        name: "Unknown Department",
        shouldPass: true,
      },
      {
        email: "student.24csz@iitrpr.ac.in",
        name: "Invalid Entry Format",
        shouldPass: true,
      }, // Missing numbers
      { email: "user@iitrpr.ac.in", name: "No Entry Number", shouldPass: true },

      // Invalid cases
      { email: "user@gmail.com", name: "Gmail User", shouldPass: false },
      {
        email: "student@iitropar.ac.in",
        name: "Wrong Domain",
        shouldPass: false,
      },
    ];

    console.log("\n📋 Testing authentication logic:");

    for (const testCase of testCases) {
      console.log(`\n🧪 Testing: ${testCase.email}`);

      // Domain check
      const isIITEmail =
        testCase.email && testCase.email.endsWith("@iitrpr.ac.in");
      console.log(`   Domain check: ${isIITEmail ? "✅ PASS" : "❌ FAIL"}`);

      if (isIITEmail) {
        // Entry number extraction
        const emailParts = testCase.email.split("@")[0];
        const entryNoMatch = emailParts.match(/\.(\d{2}[a-z]{3}\d{4})$/i);
        const extractedEntryNo = entryNoMatch
          ? entryNoMatch[1].toUpperCase()
          : null;
        console.log(`   Entry extraction: ${extractedEntryNo || "None"}`);

        // Department extraction
        let department = "";
        if (extractedEntryNo) {
          const deptCode = extractedEntryNo.substring(2, 5);
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
        }
        console.log(`   Department: ${department || "None extracted"}`);

        const course =
          extractedEntryNo && extractedEntryNo.startsWith("24")
            ? "B.Tech"
            : extractedEntryNo && extractedEntryNo.startsWith("23")
            ? "B.Tech"
            : extractedEntryNo && extractedEntryNo.startsWith("25")
            ? "B.Tech"
            : "Unknown";
        console.log(`   Course: ${course}`);
      }

      console.log(
        `   Expected result: ${testCase.shouldPass ? "✅ ALLOW" : "❌ DENY"}`
      );
      console.log(`   Actual result: ${isIITEmail ? "✅ ALLOW" : "❌ DENY"}`);
      console.log(
        `   Match: ${isIITEmail === testCase.shouldPass ? "✅" : "❌"}`
      );
    }

    // Check current database state for consistency
    console.log("\n📊 Current database consistency check:");

    const allIITUsers = await usersCollection
      .find({ email: { $regex: /@iitrpr\.ac\.in$/i } })
      .toArray();

    console.log(`Total IIT users: ${allIITUsers.length}`);

    // Group by department
    const deptStats = {};
    allIITUsers.forEach((user) => {
      const dept = user.department || "No Department";
      deptStats[dept] = (deptStats[dept] || 0) + 1;
    });

    console.log("Department distribution:");
    Object.entries(deptStats).forEach(([dept, count]) => {
      console.log(`  ${dept}: ${count} users`);
    });

    // Check for potential data issues
    const issues = [];

    allIITUsers.forEach((user) => {
      if (!user.entryNo) {
        issues.push(`${user.email}: Missing entry number`);
      }
      if (!user.department || user.department === "") {
        issues.push(`${user.email}: Missing department`);
      }
      if (!user.username) {
        issues.push(`${user.email}: Missing username`);
      }
      if (user.department === "Unknown" && user.entryNo) {
        issues.push(
          `${user.email}: Has entry number but department is 'Unknown'`
        );
      }
    });

    if (issues.length > 0) {
      console.log("\n⚠️ Found data issues:");
      issues.forEach((issue) => console.log(`  - ${issue}`));
    } else {
      console.log("\n✅ No data consistency issues found");
    }

    // Check for duplicate entries
    const emailGroups = {};
    allIITUsers.forEach((user) => {
      if (emailGroups[user.email]) {
        emailGroups[user.email].push(user._id);
      } else {
        emailGroups[user.email] = [user._id];
      }
    });

    const duplicates = Object.entries(emailGroups).filter(
      ([email, ids]) => ids.length > 1
    );
    if (duplicates.length > 0) {
      console.log("\n❌ Found duplicate email addresses:");
      duplicates.forEach(([email, ids]) => {
        console.log(
          `  ${email}: ${ids.length} entries (IDs: ${ids.join(", ")})`
        );
      });
    } else {
      console.log("\n✅ No duplicate email addresses found");
    }
  } catch (error) {
    console.error("❌ Error during comprehensive test:", error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

comprehensiveAuthTest().catch(console.error);
