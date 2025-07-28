import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const targetEmail = searchParams.get("email");

    const usersCollection = await getUsersCollection();

    if (action === "check_all") {
      // Get all users to check for email case issues
      const users = await usersCollection
        .find(
          {},
          {
            projection: { email: 1, username: 1, name: 1 },
          }
        )
        .toArray();

      const caseIssues = [];
      const emailGroups = new Map();

      // Group emails by lowercase version
      for (const user of users) {
        const lowerEmail = user.email?.toLowerCase();
        if (lowerEmail) {
          if (!emailGroups.has(lowerEmail)) {
            emailGroups.set(lowerEmail, []);
          }
          emailGroups.get(lowerEmail)?.push(user);
        }
      }

      // Find groups with multiple different case versions
      for (const [lowerEmail, userGroup] of emailGroups) {
        if (userGroup.length > 1) {
          const uniqueEmails = new Set(
            userGroup.map((u: { email?: string }) => u.email)
          );
          if (uniqueEmails.size > 1) {
            caseIssues.push({
              lowerCaseEmail: lowerEmail,
              variants: Array.from(uniqueEmails),
              users: userGroup,
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        totalUsers: users.length,
        caseIssues,
        hasIssues: caseIssues.length > 0,
      });
    }

    if (action === "fix_email" && targetEmail) {
      // Fix a specific email case issue
      const normalizedEmail = targetEmail.toLowerCase();

      // Update all instances of this email to use lowercase
      const result = await usersCollection.updateMany(
        { email: { $regex: new RegExp("^" + normalizedEmail + "$", "i") } },
        { $set: { email: normalizedEmail, updatedAt: new Date() } }
      );

      return NextResponse.json({
        success: true,
        message: `Fixed ${result.modifiedCount} email entries to use lowercase`,
        modifiedCount: result.modifiedCount,
      });
    }

    // Default: check current user's email
    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionEmail: session.user.email,
      databaseEmail: currentUser.email,
      emailsMatch: session.user.email === currentUser.email,
      emailsMatchCaseInsensitive:
        session.user.email?.toLowerCase() === currentUser.email?.toLowerCase(),
      user: currentUser,
    });
  } catch (error) {
    console.error("Error in debug API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "normalize_all_emails") {
      const usersCollection = await getUsersCollection();

      // Get all users
      const users = await usersCollection.find({}).toArray();
      let fixedCount = 0;

      for (const user of users) {
        if (user.email && user.email !== user.email.toLowerCase()) {
          await usersCollection.updateOne(
            { _id: user._id },
            {
              $set: {
                email: user.email.toLowerCase(),
                updatedAt: new Date(),
              },
            }
          );
          fixedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Normalized ${fixedCount} email addresses to lowercase`,
        fixedCount,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in debug API POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
