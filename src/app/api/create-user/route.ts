import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, image } = body;

    if (!email || !email.endsWith("@iitrpr.ac.in")) {
      return NextResponse.json(
        { error: "Invalid email domain" },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists", user: existingUser },
        { status: 409 }
      );
    }

    // Extract entry number and other info from email
    const emailParts = email.split("@")[0];
    const entryNoMatch = emailParts.match(/\.(\d{2}[a-z]{3}\d{4})$/i);
    const extractedEntryNo = entryNoMatch
      ? entryNoMatch[1].toUpperCase()
      : null;

    // Extract department from entry number
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

    // Create new user
    const newUser = {
      name: name || "",
      email: email,
      image: image || "",
      entryNo: extractedEntryNo,
      phone: "",
      department: department,
      course: extractedEntryNo
        ? extractedEntryNo.startsWith("24")
          ? "B.Tech"
          : "Unknown"
        : "",
      socialLink: "",
      isPublicEmail: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    console.log(`✅ Manually created user: ${name} (${email})`);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: { ...newUser, _id: result.insertedId },
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
