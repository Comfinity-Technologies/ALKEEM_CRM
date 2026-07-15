import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RawDashboard from "@/components/RawDashboard";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // The original HTML file is missing from the local repo, 
  // so we use the JSX equivalent that your friend's previous developer saved.
  return (
    <>
      <RawDashboard />
    </>
  );
}
