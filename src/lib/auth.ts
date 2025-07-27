import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUsersCollection } from "./mongodb";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { db } from "./db";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(db), // Temporarily disabled to fix OAuth issue
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if the user's email domain is @iitrpr.ac.in
      if (!user.email || !user.email.endsWith("@iitrpr.ac.in")) {
        console.log(`❌ Login denied: Invalid email domain - ${user.email}`);
        return false;
      }

      try {
        // Get users collection from MongoDB
        const usersCollection = await getUsersCollection();

        // Check if user already exists in the database
        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        if (!existingUser) {
          // User doesn't exist, create new user in database
          const newUser = {
            name: user.name || "",
            email: user.email,
            image: user.image || "",
            entryNo: null, // Use null instead of empty string to avoid unique constraint issues
            phone: "",
            department: "",
            course: "",
            socialLink: "",
            isPublicEmail: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await usersCollection.insertOne(newUser);
          console.log(
            `✅ New user created in database: ${user.name} (${user.email})`
          );
        } else {
          console.log(
            `✅ Existing user logged in: ${user.name} (${user.email})`
          );
        }
      } catch (error) {
        console.error("❌ Error checking/creating user in database:", error);
        console.error("Database URL configured:", !!process.env.DATABASE_URL);
        // Continue with login even if database operation fails
      }

      console.log(`✅ User logged in: ${user.name} (${user.email})`);
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // @ts-expect-error - Adding custom fields to session user
        session.user.id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
