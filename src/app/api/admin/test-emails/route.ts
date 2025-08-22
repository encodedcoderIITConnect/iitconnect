import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";

// List of admin emails who can manage test emails
const ADMIN_EMAILS = [
  "sureshrao10000@gmail.com",
  "sureshrao100000@gmail.com",
  // Add more admin emails as needed
];

async function isAdmin(email: string): Promise<boolean> {
  return ADMIN_EMAILS.includes(email);
}

// GET: Retrieve current test emails
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowedTestEmails =
      process.env.ALLOWED_TEST_EMAILS?.split(",").map((email) =>
        email.trim()
      ) || [];

    return NextResponse.json({
      testEmails: allowedTestEmails,
      adminEmail: session.user.email,
    });
  } catch (error) {
    console.error("Error fetching test emails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a new test email
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();

    // Add audit log
    await usersCollection.insertOne({
      type: "admin_action",
      action: "add_test_email",
      email: email,
      adminEmail: session.user.email,
      timestamp: new Date(),
    });

    console.log(`🔧 Admin ${session.user.email} added test email: ${email}`);

    return NextResponse.json({
      message: "Test email added successfully",
      email,
      note: "Restart the application for changes to take effect",
    });
  } catch (error) {
    console.error("Error adding test email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a test email
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();

    // Add audit log
    await usersCollection.insertOne({
      type: "admin_action",
      action: "remove_test_email",
      email: email,
      adminEmail: session.user.email,
      timestamp: new Date(),
    });

    console.log(`🔧 Admin ${session.user.email} removed test email: ${email}`);

    return NextResponse.json({
      message: "Test email removal logged",
      email,
      note: "Update environment variable and restart for changes to take effect",
    });
  } catch (error) {
    console.error("Error removing test email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
