"use client";

import { useState, useEffect } from "react";

export default function SimulatorPage() {
  const [phone, setPhone] = useState("971501234567");
  const [name, setName] = useState("John Doe");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<{ sender: string, content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // poll the db every 3 seconds to get the AI's reply
  useEffect(() => {
    const interval = setInterval(() => {
      if (phone) {
        fetch(`/api/test/conversation?phone=${phone}`)
          .then(r => r.json())
          .then(data => {
            if (data.messages) {
              setLogs(data.messages);
            }
          })
          .catch(() => {});
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [phone]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);

    // format exactly like Meta's WhatsApp Webhook payload
    const payload = {
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              value: {
                contacts: [{ wa_id: phone, profile: { name } }],
                messages: [{ text: { body: message } }]
              }
            }
          ]
        }
      ]
    };

    try {
      await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      // The polling useEffect will pick up the new messages from the DB
    } catch (err) {
      console.error(err);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '10px' }}>🤖 WhatsApp Simulator</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Test the AI pipeline. It sends payloads to the webhook exactly as WhatsApp would.
        The chat below syncs with your database in real-time.
      </p>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Simulated Phone</label>
          <input 
            type="text" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Simulated Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>
      </div>

      <div style={{ background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', minHeight: '300px', maxHeight: '500px', overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.length === 0 ? <p style={{ color: '#999', fontStyle: 'italic', margin: 'auto' }}>No messages sent yet...</p> : null}
        
        {logs.map((log, i) => {
          const isMe = log.sender === "CLIENT";
          return (
            <div key={i} style={{ 
              alignSelf: isMe ? 'flex-end' : 'flex-start',
              background: isMe ? '#d1f2eb' : '#fff', 
              padding: '10px 14px', 
              borderRadius: '12px',
              maxWidth: '70%',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', fontWeight: 'bold' }}>
                {isMe ? 'You (Client)' : 'AI Agent'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{log.content}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Type a message (e.g. 'I am looking for a 2BR apartment')..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !message.trim()}
          style={{ padding: '0 20px', background: '#3FB6A8', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
