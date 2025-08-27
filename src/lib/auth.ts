import GoogleProvider from "next-auth/providers/google";
import { getUsersCollection } from "./mongodb";
import { isTestLoginAllowed } from "./testLogins";
import { isUserBlocked } from "./blockedUsers";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { db } from "./db";

export const authOptions = {
  // adapter: PrismaAdapter(db), // Temporarily disabled to fix OAuth issue
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user }: any) {
      console.log(`🔍 SignIn callback triggered for: ${user.email}`);

      // First check if user is blocked
      const userBlocked = await isUserBlocked(user.email);
      if (userBlocked) {
        console.log(`🚫 Login denied: ${user.email} - User is blocked`);
        return false;
      }

      // Check if user is admin
      const isAdminUser = user.email === process.env.ADMIN_EMAIL;

      // Check if user has @iitrpr.ac.in domain
      const isIITEmail = user.email && user.email.endsWith("@iitrpr.ac.in");

      // Check if user is in testLogins database collection
      const isTestEmail = await isTestLoginAllowed(user.email);

      // Allow login if: IIT email OR admin OR in testLogins collection
      if (!user.email || (!isIITEmail && !isAdminUser && !isTestEmail)) {
        console.log(
          `❌ Login denied: ${user.email} - Not IIT email, not admin, and not in test logins`
        );
        return false;
      }

      if (isAdminUser) {
        console.log(`👑 Admin login: ${user.email}`);
      } else if (isTestEmail) {
        console.log(`🧪 Test email login allowed: ${user.email}`);
      }

      try {
        console.log(`🔗 Attempting to connect to MongoDB...`);
        // Get users collection from MongoDB
        const usersCollection = await getUsersCollection();
        console.log(`✅ MongoDB connection successful`);

        // Check if user already exists in the database
        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        if (!existingUser) {
          console.log(`👤 New user detected: ${user.email}`);

          // Extract username from email (part before @)
          const username = user.email.split("@")[0];
          console.log(`� Extracted username: ${username}`);

          // Create new user with only basic information
          const newUser = {
            name: user.name || "",
            username: username,
            email: user.email,
            image: user.image || "",
            entryNo: "", // Empty string - no extraction
            phone: "", // Empty string
            department: "", // Empty string
            course: "", // Empty string
            socialLink: "", // Empty string
            isPublicEmail: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          console.log(`💾 Creating user with basic data:`, {
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            image: newUser.image ? "Has image" : "No image",
          });

          const result = await usersCollection.insertOne(newUser);
          console.log(
            `✅ New user created in database with ID: ${result.insertedId} - ${user.name} (${user.email})`
          );
        } else {
          console.log(
            `✅ Existing user logged in: ${user.name} (${user.email})`
          );

          // Extract username from email (part before @)
          const username = user.email.split("@")[0];

          // Update existing user's profile picture, username, and other info from Google
          const updateData: {
            updatedAt: Date;
            image?: string;
            name?: string;
            username?: string;
          } = {
            updatedAt: new Date(),
          };

          // Only update username if it has changed or is missing
          if (username && username !== existingUser.username) {
            updateData.username = username;
            console.log(
              `👤 Updating username for ${user.email}: "${
                existingUser.username || "no username"
              }" -> "${username}"`
            );
          } else if (!existingUser.username) {
            // Set username if it doesn't exist in the database
            updateData.username = username;
            console.log(`👤 Setting username for ${user.email}: "${username}"`);
          }

          // Always update profile image from Google if available
          // This ensures database always has the most current Google profile picture
          if (user.image) {
            updateData.image = user.image;
            console.log(
              `🖼️ Updating profile image from Google for ${user.email}: "${
                existingUser.image || "no image"
              }" -> "${user.image}"`
            );
          } else if (existingUser.image) {
            // Handle case where Google account no longer has an image
            updateData.image = "";
            console.log(
              `🖼️ Removing profile image for ${user.email} (no longer available on Google)`
            );
          }

          // Update name if it has changed in Google account
          if (user.name && user.name !== existingUser.name) {
            updateData.name = user.name;
            console.log(
              `📝 Updating name from Google for ${user.email}: ${existingUser.name} -> ${user.name}`
            );
          }

          // Only update if there are changes
          if (Object.keys(updateData).length > 1) {
            // More than just updatedAt
            await usersCollection.updateOne(
              { email: user.email },
              { $set: updateData }
            );
            console.log(
              `✅ Updated user profile from Google for ${user.email}`
            );
          }
        }
      } catch (error) {
        console.error("❌ Error checking/creating user in database:", error);
        console.error("❌ Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : typeof error,
        });
        console.error("Database URL configured:", !!process.env.DATABASE_URL);

        // Continue with login even if database operation fails
        console.log("⚠️ Continuing with login despite database error");
      }

      console.log(`✅ User login completed: ${user.name} (${user.email})`);
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;

        // Extract additional user info from email
        if (user.email) {
          const emailParts = user.email.split("@")[0];
          const entryNoMatch = emailParts.match(/\.(\d{2}[a-z]{3}\d{4})$/i);
          const extractedEntryNo = entryNoMatch
            ? entryNoMatch[1].toUpperCase()
            : null;

          if (extractedEntryNo) {
            token.entryNo = extractedEntryNo;

            // Extract department from entry number
            const deptCode = extractedEntryNo.substring(2, 5);
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
            token.department = department;
            token.academicYear = `20${extractedEntryNo.substring(0, 2)}`;
          }
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;

        // Add extracted user info to session
        session.user.entryNo = token.entryNo as string;
        session.user.department = token.department as string;
        session.user.academicYear = token.academicYear as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
};
