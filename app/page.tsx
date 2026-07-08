export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Al Alkeem Group — WhatsApp Lead-Gen Bot</h1>
      <p>Backend API is running. Available endpoints:</p>
      <ul>
        <li><code>GET  /api/webhook</code> — Meta webhook verification</li>
        <li><code>POST /api/webhook</code> — Incoming WhatsApp messages</li>
        <li><code>POST /api/test</code> — <strong>Simulate a conversation (demo)</strong></li>
        <li><code>GET  /api/leads</code> — List all leads</li>
        <li><code>POST /api/leads</code> — Ingest lead from website form</li>
        <li><code>GET  /api/leads/[id]</code> — Lead detail with history</li>
        <li><code>GET  /api/properties</code> — List all properties</li>
        <li><code>POST /api/properties</code> — Add a property</li>
        <li><code>GET  /api/conversations</code> — List all conversations</li>
        <li><code>GET  /api/conversations/[id]</code> — Conversation detail</li>
        <li><code>POST /api/score</code> — Score a lead (hot/warm/cold)</li>
      </ul>
    </main>
  );
}
