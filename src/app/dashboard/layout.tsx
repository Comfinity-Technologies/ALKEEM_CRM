import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./dashboard.css"; // bringing in the old styles for now

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // snag the session
  const session = await getServerSession(authOptions);
  
  // if not logged in, bounce them to login
  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      
      {/* sidebar - keeping it simple for the mvp */}
      <aside style={{ width: '250px', background: '#1A1F2B', color: 'white', padding: '20px' }}>
        <h2 style={{ marginBottom: '30px', color: '#3FB6A8' }}>Al Keem PMS</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>📊 Overview</Link>
          <Link href="/dashboard/leads" style={{ color: 'white', textDecoration: 'none' }}>👥 Leads</Link>
          <Link href="/dashboard/properties" style={{ color: 'white', textDecoration: 'none' }}>🏢 Properties</Link>
          <Link href="/simulator" style={{ color: '#E0A33B', textDecoration: 'none', marginTop: '20px' }}>🤖 WhatsApp Simulator</Link>
        </nav>
      </aside>

      {/* main content area */}
      <main style={{ flex: 1, padding: '20px' }}>
        {/* topbar */}
        <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <span style={{ fontWeight: 600 }}>{user?.name}</span> 
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>({user?.role})</span>
          </div>
          <Link href="/api/auth/signout" style={{ color: '#E07A5F', textDecoration: 'none', fontWeight: 'bold' }}>Sign Out</Link>
        </header>

        {children}
      </main>

    </div>
  );
}
