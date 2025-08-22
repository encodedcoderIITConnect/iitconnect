import { getDatabase } from "./mongodb";

export interface TestLogin {
  _id?: string;
  email: string;
  addedBy: string;
  addedAt: Date;
  isActive: boolean;
}

/**
 * Get the testLogins collection from MongoDB
 */
export async function getTestLoginsCollection() {
  const db = await getDatabase();
  return db.collection<TestLogin>("testLogins");
}

/**
 * Check if an email is in the testLogins collection and is active
 */
export async function isTestLoginAllowed(email: string): Promise<boolean> {
  try {
    const testLoginsCollection = await getTestLoginsCollection();
    const testLogin = await testLoginsCollection.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });
    return !!testLogin;
  } catch (error) {
    console.error("Error checking test login:", error);
    return false;
  }
}

/**
 * Add a new test login email
 */
export async function addTestLogin(
  email: string,
  addedBy: string
): Promise<{ success: boolean; message: string }> {
  try {
    const testLoginsCollection = await getTestLoginsCollection();

    // Check if email already exists
    const existing = await testLoginsCollection.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      if (existing.isActive) {
        return {
          success: false,
          message: "Email already exists and is active",
        };
      } else {
        // Reactivate existing email
        await testLoginsCollection.updateOne(
          { email: email.toLowerCase() },
          {
            $set: {
              isActive: true,
              addedBy,
              addedAt: new Date(),
            },
          }
        );
        return { success: true, message: "Email reactivated successfully" };
      }
    }

    // Add new test login
    const newTestLogin: TestLogin = {
      email: email.toLowerCase(),
      addedBy,
      addedAt: new Date(),
      isActive: true,
    };

    await testLoginsCollection.insertOne(newTestLogin);
    return { success: true, message: "Test login added successfully" };
  } catch (error) {
    console.error("Error adding test login:", error);
    return { success: false, message: "Failed to add test login" };
  }
}

/**
 * Remove/deactivate a test login email
 */
export async function removeTestLogin(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const testLoginsCollection = await getTestLoginsCollection();

    const result = await testLoginsCollection.updateOne(
      { email: email.toLowerCase() },
      { $set: { isActive: false } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Email not found" };
    }

    return { success: true, message: "Test login removed successfully" };
  } catch (error) {
    console.error("Error removing test login:", error);
    return { success: false, message: "Failed to remove test login" };
  }
}

/**
 * Get all active test logins
 */
export async function getActiveTestLogins(): Promise<TestLogin[]> {
  try {
    const testLoginsCollection = await getTestLoginsCollection();
    const testLogins = await testLoginsCollection
      .find({ isActive: true })
      .sort({ addedAt: -1 })
      .toArray();
    return testLogins;
  } catch (error) {
    console.error("Error fetching test logins:", error);
    return [];
  }
}

/**
 * Check if user is admin
 */
export function isAdmin(email: string): boolean {
  return email === process.env.ADMIN_EMAIL;
}
