import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TestLoginsManager from "@/components/TestLoginsManager";
import BlockedUsersManager from "@/components/BlockedUsersManager";
import { isAdmin } from "@/lib/testLogins";

export const metadata = {
  title: "Admin Panel - IIT Connect",
  description:
    "Administrative panel for managing IIT Connect test logins and blocked users",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check if user is signed in and is an admin
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-8">
      <TestLoginsManager />
      <BlockedUsersManager />
    </div>
  );
}
