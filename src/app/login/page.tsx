"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Bot, Building2, BarChart3, Workflow } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        username: email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-root {
          display: flex;
          min-height: 100vh;
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
        }

        /* ── Left branding panel ───────────────── */
        .login-brand {
          flex: 1;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          position: relative;
          overflow: hidden;
        }
        .login-brand::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-brand::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .brand-logo {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #2563EB, #3B82F6);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 22px;
          font-family: var(--font-display, system-ui);
          box-shadow: 0 0 30px rgba(37, 99, 235, 0.3);
          margin-bottom: 28px;
        }
        .brand-title {
          font-family: var(--font-display, system-ui);
          font-size: 2.4rem;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .brand-subtitle {
          color: #94A3B8;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 400px;
        }
        .brand-features {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .brand-feature {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #CBD5E1;
          font-size: 0.9rem;
        }
        .brand-feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        /* ── Right form panel ──────────────────── */
        .login-form-panel {
          width: 520px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          background: #FFFFFF;
        }
        .login-form-header {
          margin-bottom: 36px;
        }
        .login-form-header h2 {
          font-family: var(--font-display, system-ui);
          font-size: 1.75rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 8px 0;
        }
        .login-form-header p {
          color: #64748B;
          font-size: 0.9rem;
          margin: 0;
        }
        .login-field {
          margin-bottom: 20px;
        }
        .login-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }
        .login-input-wrap {
          position: relative;
        }
        .login-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          display: flex;
        }
        .login-input {
          width: 100%;
          padding: 13px 14px 13px 44px;
          border-radius: 10px;
          border: 1.5px solid #E2E8F0;
          background: #F8FAFC;
          color: #0F172A;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }
        .login-input:focus {
          border-color: #2563EB;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .login-input::placeholder {
          color: #94A3B8;
        }
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #DC2626;
          font-size: 0.8rem;
          font-weight: 500;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }
        .login-btn:hover:not(:disabled) {
          background: #1D4ED8;
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-btn .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .login-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #E2E8F0;
          text-align: center;
          color: #94A3B8;
          font-size: 0.8rem;
        }
        .login-footer a {
          color: #2563EB;
          text-decoration: none;
          font-weight: 500;
        }

        @media (max-width: 960px) {
          .login-brand { display: none; }
          .login-form-panel { width: 100%; }
        }
      `}</style>

      <div className="login-root">
        {/* ── Left branding ─────────────────────── */}
        <div className="login-brand">
          <div className="brand-logo">AK</div>
          <h1 className="brand-title">
            Al Alkeem<br />
            Command Centre
          </h1>
          <p className="brand-subtitle">
            Your intelligent real estate operations platform. 
            Manage leads, properties, and AI-powered client conversations all in one place.
          </p>
          <div className="brand-features">
            <div className="brand-feature">
              <div className="brand-feature-icon"><Bot size={20} /></div>
              <span>AI-powered WhatsApp lead qualification</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><Building2 size={20} /></div>
              <span>20+ property listings with live search</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><BarChart3 size={20} /></div>
              <span>Real-time lead scoring and analytics</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><Workflow size={20} /></div>
              <span>Automated bot-to-human handoff workflow</span>
            </div>
          </div>
        </div>

        {/* ── Right form ────────────────────────── */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <div className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input
                  className="login-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@al-alkeem.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <div className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  className="login-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            © {new Date().getFullYear()} Al Alkeem Group · All rights reserved
          </div>
        </div>
      </div>
    </>
  );
}
