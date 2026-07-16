import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RawDashboard from "@/components/RawDashboard";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = {
    name: session.user.name || "User",
    role: "Super Admin", // Fallback if missing
  };

  return (
    <>
      <RawDashboard user={user} />
    </>
  );
}
