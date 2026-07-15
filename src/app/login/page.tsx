"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Shield, KeyRound, User, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      
      if (res?.error) {
        setError("Invalid credentials. Please select a role card below.");
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: string) => {
    setUsername(role);
    setPassword(role);
    setError("");
  };

  return (
    <div style={{
      display: 'flex', 
      height: '100vh', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#0F172A',
      backgroundImage: 'radial-gradient(circle at 50% 120%, #1e293b, #0f172a)',
      fontFamily: 'var(--font-sans), sans-serif',
      color: '#F8FAFC'
    }}>
      <div style={{
        backgroundColor: '#1E293B',
        border: '1px solid #334155',
        padding: '48px 40px', 
        borderRadius: '16px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)', 
        width: '100%', 
        maxWidth: '440px',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        
        {/* LOGO AREA */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '54px', 
            height: '54px', 
            background: '#2563EB', 
            borderRadius: '14px', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '24px', 
            fontFamily: 'var(--font-display)',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)',
            marginBottom: '16px'
          }}>
            PS
          </div>
          <h2 style={{ margin: '0', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)', color: '#FFFFFF' }}>
            Al Alkeem Command
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>
            Real Estate Intelligence Desk
          </p>
        </div>
        
        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 14px 12px 42px', 
                  borderRadius: '10px', 
                  border: '1px solid #334155', 
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9rem',
                  transition: 'border-color 0.2s',
                }} 
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 14px 12px 42px', 
                  borderRadius: '10px', 
                  border: '1px solid #334155', 
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.9rem',
                  transition: 'border-color 0.2s',
                }} 
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', fontSize: '0.8rem', fontWeight: 500, backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px', 
              backgroundColor: '#2563EB', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              fontSize: '0.95rem',
              transition: 'background-color 0.2s, transform 0.1s',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              marginTop: '8px'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLoading ? "Authenticating..." : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* QUICK LOGIN / CREDENTIALS BOX */}
        <div style={{ marginTop: '36px', borderTop: '1px solid #334155', paddingTop: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            <Shield size={14} /> Quick Role Login
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div 
              onClick={() => handleQuickLogin("admin")}
              style={{
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '12px',
                cursor: 'pointer',
                backgroundColor: username === 'admin' ? 'rgba(37, 99, 235, 0.15)' : '#1E293B',
                borderColor: username === 'admin' ? '#2563EB' : '#334155',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#FFFFFF' }}>Admin Account</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>admin / admin</div>
            </div>
            
            <div 
              onClick={() => handleQuickLogin("super")}
              style={{
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '12px',
                cursor: 'pointer',
                backgroundColor: username === 'super' ? 'rgba(37, 99, 235, 0.15)' : '#1E293B',
                borderColor: username === 'super' ? '#2563EB' : '#334155',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#FFFFFF' }}>Super Admin</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>super / super</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
