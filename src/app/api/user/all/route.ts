import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();

    // Get all users except the current user
    const users = await db
      .collection("users")
      .find(
        { email: { $ne: session.user.email } },
        {
          projection: {
            _id: 1,
            name: 1,
            username: 1,
            email: 1,
            image: 1,
            department: 1,
            course: 1,
          },
        }
      )
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
