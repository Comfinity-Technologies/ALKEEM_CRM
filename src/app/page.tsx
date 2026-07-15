import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { readFileSync } from "fs";
import path from "path";
import DashboardShell from "./DashboardShell";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Read the original HTML and inject the dark mode styles + auth scripts
  const htmlPath = path.join(process.cwd(), "pms_updated.html");
  let rawHtml = "";
  try {
    rawHtml = readFileSync(htmlPath, "utf-8");
  } catch {
    rawHtml = "";
  }

  const isSuperAdmin = (session?.user as any)?.role === "super";

  return (
    <DashboardShell 
      isSuperAdmin={isSuperAdmin} 
      userName={(session.user as any)?.name || "Admin"}
      rawHtml={rawHtml}
    />
  );
}
