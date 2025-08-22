import { getDatabase } from "./mongodb";

export interface BlockedUser {
  email: string;
  blockedBy: string;
  blockedAt: Date;
  reason?: string;
  isActive: boolean;
}

export async function isUserBlocked(email: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const blockedUser = await db.collection("blockedUsers").findOne({
      email: email.toLowerCase(),
      isActive: true,
    });
    return !!blockedUser;
  } catch (error) {
    console.error("Error checking if user is blocked:", error);
    return false;
  }
}

export async function blockUser(
  email: string,
  blockedBy: string,
  reason?: string
): Promise<boolean> {
  try {
    const db = await getDatabase();

    // Check if user is already blocked
    const existingBlock = await db.collection("blockedUsers").findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (existingBlock) {
      return false; // User already blocked
    }

    await db.collection("blockedUsers").insertOne({
      email: email.toLowerCase(),
      blockedBy,
      blockedAt: new Date(),
      reason: reason || "No reason provided",
      isActive: true,
    });

    return true;
  } catch (error) {
    console.error("Error blocking user:", error);
    return false;
  }
}

export async function removeBlockedUser(email: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const result = await db
      .collection("blockedUsers")
      .updateOne(
        { email: email.toLowerCase(), isActive: true },
        { $set: { isActive: false } }
      );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error removing blocked user:", error);
    return false;
  }
}

export async function getAllBlockedUsers(): Promise<BlockedUser[]> {
  try {
    const db = await getDatabase();
    const blockedUsers = await db
      .collection("blockedUsers")
      .find({
        isActive: true,
      })
      .sort({ blockedAt: -1 })
      .toArray();

    return blockedUsers.map((user) => ({
      email: user.email,
      blockedBy: user.blockedBy,
      blockedAt: user.blockedAt,
      reason: user.reason,
      isActive: user.isActive,
    }));
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    return [];
  }
}

export async function isAdmin(email: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  return adminEmail === email;
}
