"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

declare global {
  interface Window {
    go: (view: string) => void;
    toast: (msg: string, ic?: string, alert?: boolean) => void;
  }
}

export default function DashboardPage({ session }: { session: any }) {
  const isSuperAdmin = session?.user?.role === "super";

  useEffect(() => {
    // Fetch live Property Finder data from our API and inject into the dashboard
    fetch("/api/properties")
      .then(r => r.json())
      .then(data => {
        const props = data.properties || [];
        // Update the props variable in the embedded dashboard
        const win = window as any;
        if (win.updateLiveProperties) {
          win.updateLiveProperties(props);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Auth Overlay bar – sits on top of embedded content */}
      <div id="auth-topbar" style={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 16px',
        background: 'transparent',
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'all', display: 'flex', gap: 8 }}>
          {/* Dark/Light Mode Toggle */}
          <button
            id="theme-toggle"
            onClick={() => {
              const root = document.documentElement;
              const isDark = root.getAttribute('data-theme') === 'dark';
              root.setAttribute('data-theme', isDark ? 'light' : 'dark');
              const btn = document.getElementById('theme-toggle');
              if (btn) btn.textContent = isDark ? '🌙' : '☀️';
              localStorage.setItem('theme', isDark ? 'light' : 'dark');
            }}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(0,0,0,0.1)',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            title="Toggle dark/light mode"
          >
            🌙
          </button>
          
          {/* Auth user badge + sign out */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: '6px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: isSuperAdmin ? 'linear-gradient(135deg,#EBBA63,#E0A33B)' : 'linear-gradient(135deg,#3FB6A8,#268a7e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 10, fontWeight: 700
            }}>
              {isSuperAdmin ? 'SA' : 'AD'}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#13192B' }}>
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, color: '#E07A5F', fontWeight: 700, padding: '2px 4px'
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Embedded pms_updated.html inline with theme + live data */}
      <EmbeddedDashboard isSuperAdmin={isSuperAdmin} />
    </div>
  );
}

function EmbeddedDashboard({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  useEffect(() => {
    // Initialize theme from localStorage
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';

    // Set role based on session
    const win = window as any;
    if (win.setRole) {
      win.setRole(isSuperAdmin ? 'super' : 'admin', true);
    }
  }, [isSuperAdmin]);

  return null;
}
