# 🔗 Chat-User Relationship Structure in IIT Connect

## 📊 Database Collections

### 1. **`chats` Collection** (What you see in Compass)

```javascript
{
  _id: ObjectId("688734f474707b408550845"),
  name: null,                    // null for direct chats
  isGroup: false,               // false = direct chat, true = group chat
  createdAt: "2025-07-28T11:00:00Z",
  updatedAt: "2025-07-28T11:00:00Z"
}
```

### 2. **`chatmembers` Collection** (Junction Table - Links users to chats)

```javascript
{
  _id: ObjectId("..."),
  chatId: "688734f474707b408550845",    // References chats._id
  userId: "user123_id",                 // References users._id
  joinedAt: "2025-07-28T11:00:00Z",
  role: "member"                        // "member" or "admin"
}
```

### 3. **`users` Collection**

```javascript
{
  _id: ObjectId("user123_id"),
  name: "John Doe",
  email: "john@iitrpr.ac.in",
  username: "johndoe",
  // ... other user fields
}
```

## 🔄 How They Connect

### Direct Chat Example:

```
Chat: "688734f474707b408550845" (isGroup: false)
   ↓
ChatMembers:
   • { chatId: "688734f474707b408550845", userId: "user1_id" }
   • { chatId: "688734f474707b408550845", userId: "user2_id" }
   ↓
Users:
   • user1_id → "Alice Johnson"
   • user2_id → "Bob Smith"

Result: Direct chat between Alice and Bob
```

### Group Chat Example:

```
Chat: "688734f48b6309e097552006" (isGroup: true, name: "CS Department")
   ↓
ChatMembers:
   • { chatId: "688734f48b6309e097552006", userId: "user1_id" }
   • { chatId: "688734f48b6309e097552006", userId: "user2_id" }
   • { chatId: "688734f48b6309e097552006", userId: "user3_id" }
   ↓
Users:
   • user1_id → "Alice Johnson"
   • user2_id → "Bob Smith"
   • user3_id → "Charlie Brown"

Result: Group chat with Alice, Bob, and Charlie
```

## 🔍 What You're Seeing in MongoDB Compass

The 3 chat documents you see are:

1. **Chat 1**: `ObjectId('688734f474707b408550845')`
2. **Chat 2**: `ObjectId('688734f48b6309e097552006')`
3. **Chat 3**: `ObjectId('688734248b6309e097552009')`

**To see the complete relationships, you need to check:**

### Step 1: Click on `chatmembers` collection

This will show you which users belong to which chats:

```javascript
// Example data you might see:
[
  { chatId: "688734f474707b408550845", userId: "507f1f77bcf86cd799439011" },
  { chatId: "688734f474707b408550845", userId: "507f1f77bcf86cd799439012" },
  { chatId: "688734f48b6309e097552006", userId: "507f1f77bcf86cd799439011" },
  { chatId: "688734f48b6309e097552006", userId: "507f1f77bcf86cd799439013" },
];
```

### Step 2: Check `users` collection

This maps user IDs to actual people:

```javascript
// Example data:
[
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Alice",
    email: "alice@iitrpr.ac.in",
  },
  { _id: "507f1f77bcf86cd799439012", name: "Bob", email: "bob@iitrpr.ac.in" },
  {
    _id: "507f1f77bcf86cd799439013",
    name: "Charlie",
    email: "charlie@iitrpr.ac.in",
  },
];
```

## 🚀 How the System Works in Code

### Creating a Chat (from your route.ts):

```typescript
// 1. Create chat document
const chatResult = await chats.insertOne({
  name: null, // Direct chat has no name
  isGroup: false, // Direct chat
  createdAt: new Date(),
});

// 2. Add both users to chatmembers
await chatMembers.insertMany([
  { chatId: chatResult.insertedId.toString(), userId: user1._id.toString() },
  { chatId: chatResult.insertedId.toString(), userId: user2._id.toString() },
]);
```

### Finding User's Chats:

```typescript
// Get all chats for a user
const userChats = await chatMembers.aggregate([
  { $match: { userId: currentUser._id.toString() } },
  {
    $lookup: {
      from: "chats",
      localField: "chatId",
      foreignField: "_id",
      as: "chat",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "members",
    },
  },
]);
```

## 🔧 To Investigate Your Current Data:

1. **In MongoDB Compass, check these collections:**

   - `chatmembers` - Shows user-chat relationships
   - `users` - Shows who the users actually are
   - `messages` - Shows messages within chats

2. **Or run this query in Compass:**

   ```javascript
   // In chatmembers collection:
   db.chatmembers.find({});

   // In users collection:
   db.users.find({});
   ```

The chat IDs you see are just containers - the real connections are in the `chatmembers` collection! 🔗
