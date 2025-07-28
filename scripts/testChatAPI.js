// Test the fixed chat API
import { MongoClient } from "mongodb";
import { config } from "dotenv";

config({ path: ".env.local" });

async function testChatAPI() {
  console.log("🧪 Testing Fixed Chat API...\n");

  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();

  // Test with Suresh who has 3 chats
  const testUser = await db.collection("users").findOne({
    email: "suresh.24csz0009@iitrpr.ac.in",
  });

  if (!testUser) {
    console.log("❌ Test user not found");
    return;
  }

  console.log(`👤 Testing with: ${testUser.name}`);
  console.log(`📧 Email: ${testUser.email}`);
  console.log(`🆔 ID: ${testUser._id}\n`);

  // Run the fixed aggregation
  const userChats = await db
    .collection("chatmembers")
    .aggregate([
      {
        $match: { userId: testUser._id.toString() },
      },
      {
        $addFields: {
          chatObjectId: { $toObjectId: "$chatId" },
        },
      },
      {
        $lookup: {
          from: "chats",
          localField: "chatObjectId",
          foreignField: "_id",
          as: "chat",
        },
      },
      {
        $unwind: "$chat",
      },
      {
        $lookup: {
          from: "chatmembers",
          localField: "chatId",
          foreignField: "chatId",
          as: "allMembers",
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            memberIds: {
              $map: {
                input: "$allMembers",
                as: "member",
                in: { $toObjectId: "$$member.userId" },
              },
            },
          },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$memberIds"] } } },
            {
              $project: {
                _id: 1,
                name: 1,
                username: 1,
                image: 1,
                email: 1,
              },
            },
          ],
          as: "memberUsers",
        },
      },
    ])
    .toArray();

  console.log(`📊 Aggregation returned ${userChats.length} chats\n`);

  userChats.forEach((chatData, index) => {
    console.log(`💬 Chat ${index + 1}:`);
    console.log(`   ID: ${chatData.chat._id}`);
    console.log(`   Type: ${chatData.chat.isGroup ? "Group" : "Direct"}`);
    console.log(`   Created: ${chatData.chat.createdAt}`);
    console.log(`   Members (${chatData.memberUsers.length}):`);

    chatData.memberUsers.forEach((user) => {
      const isCurrentUser = user._id.toString() === testUser._id.toString();
      console.log(`     - ${user.name} ${isCurrentUser ? "(You)" : ""}`);
    });

    // Find other members
    const otherMembers = chatData.memberUsers.filter(
      (member) => member._id.toString() !== testUser._id.toString()
    );

    if (otherMembers.length > 0) {
      console.log(
        `   Chat with: ${otherMembers.map((m) => m.name).join(", ")}`
      );
    }
    console.log();
  });

  if (userChats.length > 0) {
    console.log("✅ Chat loading is working correctly!");
  } else {
    console.log("❌ No chats returned - still an issue");
  }

  await client.close();
}

testChatAPI();
