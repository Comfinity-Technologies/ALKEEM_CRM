"use client";

import { useState, useEffect, useRef } from "react";

// ── Format time as WhatsApp-style "3:45 PM" ────────────────────────
function formatTime(date?: Date) {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

interface ChatMessage {
  sender: string;
  content: string;
  time: string;
}

export default function SimulatorPage() {
  const [phone, setPhone] = useState("971501234567");
  const [name, setName] = useState("John Doe");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevCountRef = useRef(0);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, typing]);

  // Poll for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (phone) {
        fetch(`/api/test/conversation?phone=${phone}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.messages) {
              const newMessages = data.messages.map((m: any) => ({
                sender: m.sender,
                content: m.content,
                time: formatTime(),
              }));
              setLogs(newMessages);

              // If we got a new BOT message, stop typing indicator
              if (newMessages.length > prevCountRef.current) {
                const latest = newMessages[newMessages.length - 1];
                if (latest.sender === "BOT") {
                  setTyping(false);
                }
              }
              prevCountRef.current = newMessages.length;
            }
          })
          .catch(() => {});
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [phone]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setTyping(true);

    const payload = {
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              value: {
                contacts: [{ wa_id: phone, profile: { name } }],
                messages: [{ text: { body: message } }],
              },
            },
          ],
        },
      ],
    };

    // Optimistic: add the user message immediately
    setLogs((prev) => [...prev, { sender: "CLIENT", content: message, time: formatTime() }]);

    try {
      await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }

    setMessage("");
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <style>{`
        .sim-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0f1a 0%, #0d1526 50%, #111d35 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
        }

        .sim-container {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          height: 92vh;
          max-height: 900px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 25px 60px rgba(0,0,0,0.5),
            0 0 120px rgba(37, 211, 102, 0.08);
          position: relative;
        }

        /* ── Header ────────────────────────────────── */
        .sim-header {
          background: #202C33;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sim-back {
          color: #00A884;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .sim-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00A884, #25D366);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .sim-header-info {
          flex: 1;
          min-width: 0;
        }
        .sim-header-name {
          color: #E9EDEF;
          font-size: 16px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sim-header-status {
          color: #8696A0;
          font-size: 13px;
        }
        .sim-header-status.typing {
          color: #25D366;
        }
        .sim-header-actions {
          display: flex;
          gap: 20px;
          color: #AEBAC1;
        }
        .sim-header-actions svg {
          cursor: pointer;
          transition: color 0.15s;
        }
        .sim-header-actions svg:hover {
          color: #E9EDEF;
        }

        /* ── Chat area ─────────────────────────────── */
        .sim-chat {
          flex: 1;
          overflow-y: auto;
          padding: 12px 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background-color: #0B141A;
          background-image:
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .sim-chat::-webkit-scrollbar { width: 6px; }
        .sim-chat::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        .sim-chat::-webkit-scrollbar-track { background: transparent; }

        /* ── Empty state ────────────────────────────── */
        .sim-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          text-align: center;
          color: #8696A0;
          gap: 12px;
          padding: 40px;
        }
        .sim-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(0, 168, 132, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 8px;
        }
        .sim-empty h3 {
          color: #E9EDEF;
          font-size: 18px;
          font-weight: 500;
        }
        .sim-empty p {
          font-size: 14px;
          line-height: 1.5;
          max-width: 300px;
        }

        /* ── Date chip ──────────────────────────────── */
        .sim-date-chip {
          align-self: center;
          background: #182229;
          color: #8696A0;
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 8px;
          margin: 8px 0;
          box-shadow: 0 1px 1px rgba(0,0,0,0.2);
        }

        /* ── Bubble ────────────────────────────────── */
        .sim-bubble-row {
          display: flex;
          animation: bubbleIn 0.25s ease-out;
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .sim-bubble-row.out { justify-content: flex-end; }
        .sim-bubble-row.in { justify-content: flex-start; }

        .sim-bubble {
          max-width: 85%;
          padding: 8px 10px 6px;
          border-radius: 8px;
          font-size: 14.2px;
          line-height: 1.45;
          position: relative;
          box-shadow: 0 1px 1px rgba(0,0,0,0.15);
        }
        .sim-bubble.out {
          background: #005C4B;
          color: #E9EDEF;
          border-top-right-radius: 0;
        }
        .sim-bubble.in {
          background: #1F2C34;
          color: #E9EDEF;
          border-top-left-radius: 0;
        }
        .sim-bubble .sim-sender {
          font-size: 13px;
          font-weight: 600;
          color: #00A884;
          margin-bottom: 2px;
        }
        .sim-bubble .sim-text {
          white-space: pre-wrap;
          word-break: break-word;
        }
        .sim-bubble .sim-time {
          text-align: right;
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          margin-top: 3px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
        }

        /* ── Typing indicator ──────────────────────── */
        .sim-typing-row {
          display: flex;
          justify-content: flex-start;
        }
        .sim-typing {
          background: #1F2C34;
          padding: 12px 18px;
          border-radius: 8px;
          border-top-left-radius: 0;
          display: flex;
          gap: 5px;
          align-items: center;
          box-shadow: 0 1px 1px rgba(0,0,0,0.15);
        }
        .sim-typing span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #8696A0;
          animation: typeBounce 1.4s ease-in-out infinite;
        }
        .sim-typing span:nth-child(2) { animation-delay: 0.2s; }
        .sim-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typeBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* ── Input bar ─────────────────────────────── */
        .sim-input-bar {
          background: #202C33;
          padding: 8px 10px;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .sim-input-wrap {
          flex: 1;
          background: #2A3942;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          min-height: 42px;
        }
        .sim-input-wrap input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #D1D7DB;
          font-size: 15px;
          font-family: inherit;
          padding: 10px 0;
        }
        .sim-input-wrap input::placeholder {
          color: #8696A0;
        }
        .sim-send-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #00A884;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .sim-send-btn:hover { background: #06CF9C; transform: scale(1.05); }
        .sim-send-btn:disabled { background: #2A3942; cursor: not-allowed; transform: none; }
        .sim-send-btn svg { color: #fff; }

        /* ── Settings panel ─────────────────────────── */
        .sim-settings-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 20;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 80px;
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .sim-settings-panel {
          background: #111B21;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 24px;
          width: 90%;
          max-width: 360px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          animation: slideDown 0.25s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sim-settings-panel h3 {
          color: #E9EDEF;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sim-settings-panel label {
          display: block;
          color: #8696A0;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .sim-settings-panel input {
          width: 100%;
          background: #2A3942;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #D1D7DB;
          padding: 10px 14px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          margin-bottom: 16px;
          transition: border-color 0.15s;
        }
        .sim-settings-panel input:focus {
          border-color: #00A884;
        }
        .sim-settings-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 4px;
        }
        .sim-settings-actions button {
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: inherit;
          transition: all 0.15s;
        }
        .sim-btn-cancel {
          background: transparent;
          color: #8696A0;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .sim-btn-cancel:hover { background: rgba(255,255,255,0.05); }
        .sim-btn-done {
          background: #00A884;
          color: #fff;
        }
        .sim-btn-done:hover { background: #06CF9C; }

        /* ── Branding bar ──────────────────────────── */
        .sim-brand-bar {
          text-align: center;
          padding: 16px;
          color: rgba(255,255,255,0.3);
          font-size: 11px;
          letter-spacing: 0.05em;
        }
        .sim-brand-bar a {
          color: #00A884;
          text-decoration: none;
          font-weight: 600;
        }

        /* ── Suggested prompts ──────────────────────── */
        .sim-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px 16px 12px;
          background: #0B141A;
        }
        .sim-suggestion {
          background: rgba(0, 168, 132, 0.1);
          border: 1px solid rgba(0, 168, 132, 0.2);
          color: #00A884;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .sim-suggestion:hover {
          background: rgba(0, 168, 132, 0.2);
          border-color: rgba(0, 168, 132, 0.4);
        }
      `}</style>

      <div className="sim-root">
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div className="sim-container">
            {/* ── Header ──────────────────────────────── */}
            <div className="sim-header">
              <div className="sim-back">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </div>
              <div className="sim-avatar">A</div>
              <div className="sim-header-info">
                <div className="sim-header-name">Al Alkeem Group</div>
                <div className={`sim-header-status ${typing ? "typing" : ""}`}>
                  {typing ? "typing..." : "online"}
                </div>
              </div>
              <div className="sim-header-actions">
                <svg onClick={() => setSettingsOpen(true)} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
              </div>
            </div>

            {/* ── Settings overlay ─────────────────────── */}
            {settingsOpen && (
              <div className="sim-settings-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSettingsOpen(false); }}>
                <div className="sim-settings-panel">
                  <h3>⚙️ Simulator Settings</h3>
                  <label>Phone Number</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <label>Contact Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  <div className="sim-settings-actions">
                    <button className="sim-btn-cancel" onClick={() => setSettingsOpen(false)}>Cancel</button>
                    <button className="sim-btn-done" onClick={() => setSettingsOpen(false)}>Done</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Chat area ────────────────────────────── */}
            <div className="sim-chat" ref={scrollRef}>
              {logs.length === 0 ? (
                <div className="sim-empty">
                  <div className="sim-empty-icon">🏢</div>
                  <h3>Al Alkeem Group AI Assistant</h3>
                  <p>Send a message to test the AI property consultant. It searches real listings and follows business rules.</p>
                </div>
              ) : (
                <>
                  <div className="sim-date-chip">Today</div>
                  {logs.map((log, i) => {
                    const isOut = log.sender === "CLIENT";
                    return (
                      <div key={i} className={`sim-bubble-row ${isOut ? "out" : "in"}`}>
                        <div className={`sim-bubble ${isOut ? "out" : "in"}`}>
                          {!isOut && i === 0 || (!isOut && logs[i-1]?.sender === "CLIENT") ? (
                            <div className="sim-sender">Al Alkeem AI</div>
                          ) : null}
                          <div className="sim-text">{log.content}</div>
                          <div className="sim-time">
                            {log.time}
                            {isOut && (
                              <svg width="16" height="11" viewBox="0 0 16 11"><path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.175a.463.463 0 0 0-.36-.186.457.457 0 0 0-.344.153.441.441 0 0 0-.101.382.454.454 0 0 0 .2.333l2.456 2.638a.46.46 0 0 0 .353.166h.013a.463.463 0 0 0 .353-.176l6.525-8.09a.459.459 0 0 0-.21-.757z" fill="currentColor" opacity="0.7"/><path d="M15.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-1.2-1.298-.463.574 1.218 1.362a.46.46 0 0 0 .353.166h.013a.463.463 0 0 0 .353-.176l6.525-8.09a.459.459 0 0 0 .076-.354z" fill="currentColor" opacity="0.7"/></svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {typing && (
                <div className="sim-typing-row">
                  <div className="sim-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>

            {/* ── Suggested prompts ────────────────────── */}
            {logs.length === 0 && (
              <div className="sim-suggestions">
                {[
                  "I need a 1BR apartment",
                  "What's the commission?",
                  "Properties under 30K",
                  "Book a viewing",
                ].map((s) => (
                  <div key={s} className="sim-suggestion" onClick={() => { setMessage(s); inputRef.current?.focus(); }}>
                    {s}
                  </div>
                ))}
              </div>
            )}

            {/* ── Input bar ────────────────────────────── */}
            <div className="sim-input-bar">
              <div className="sim-input-wrap">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>
              <button className="sim-send-btn" onClick={handleSend} disabled={loading || !message.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* ── Branding ──────────────────────────────── */}
          <div className="sim-brand-bar">
            Powered by <a href="#">Al Alkeem Group</a> · AI Property Consultant
          </div>
        </div>
      </div>
    </>
  );
}
