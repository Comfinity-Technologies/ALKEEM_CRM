"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: string;
  name: string | null;
  phone: string | null;
  source: string;
  status: string;
  createdAt: string;
  leadSummaries: Array<{ temperature: string; score: number | null }>;
  conversations: Array<{ id: string; status: string; _count: { messages: number } }>;
}

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  beds: number | null;
  baths: number | null;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "properties">("overview");

  useEffect(() => {
    Promise.all([
      fetch("/api/leads").then((res) => res.json()),
      fetch("/api/properties").then((res) => res.json()),
    ])
      .then(([leadsData, propsData]) => {
        setLeads(leadsData.leads || []);
        setProperties(propsData.properties || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("failed to load stats", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#64748B" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ fontWeight: 500 }}>Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  const hotLeads = leads.filter((l) => l.leadSummaries?.[0]?.temperature === "HOT").length;
  const warmLeads = leads.filter((l) => l.leadSummaries?.[0]?.temperature === "WARM").length;
  const activeConversations = leads.reduce(
    (acc, l) => acc + (l.conversations?.filter((c) => c.status === "ACTIVE").length || 0),
    0
  );

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid #E2E8F0" }}>
        {(["overview", "leads", "properties"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 24px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? "#2563EB" : "#64748B",
              borderBottom: activeTab === tab ? "2px solid #2563EB" : "2px solid transparent",
              fontSize: "0.9rem",
              textTransform: "capitalize",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {tab === "overview" ? "📊 Overview" : tab === "leads" ? "👥 Leads" : "🏢 Properties"}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ──────────────────────────────────── */}
      {activeTab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total Leads", value: leads.length, color: "#2563EB", icon: "👥" },
              { label: "Hot Leads", value: hotLeads, color: "#EF4444", icon: "🔥" },
              { label: "Warm Leads", value: warmLeads, color: "#F59E0B", icon: "🌡️" },
              { label: "Properties", value: properties.length, color: "#10B981", icon: "🏢" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{
                  background: "white",
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{kpi.icon} {kpi.label}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: kpi.color, marginTop: 8, fontFamily: "var(--font-display)" }}>
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Leads Preview */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", fontWeight: 600 }}>Recent Leads</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Name", "Phone", "Source", "Status", "Messages", "Created"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{lead.name || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#64748B", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{lead.phone || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: 12, fontSize: "0.75rem", fontWeight: 600 }}>
                        {lead.source}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        background: lead.status === "NEW" ? "#F0FDF4" : lead.status === "CONTACTED" ? "#FFF7ED" : lead.status === "QUALIFIED" ? "#EFF6FF" : "#FEF2F2",
                        color: lead.status === "NEW" ? "#16A34A" : lead.status === "CONTACTED" ? "#EA580C" : lead.status === "QUALIFIED" ? "#2563EB" : "#DC2626",
                        padding: "2px 8px", borderRadius: 12, fontSize: "0.75rem", fontWeight: 600
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748B" }}>
                      {lead.conversations?.[0]?._count?.messages || 0}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94A3B8", fontSize: "0.8rem" }}>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No leads yet. Send a message via the WhatsApp Simulator to create one!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Leads Tab ──────────────────────────────────── */}
      {activeTab === "leads" && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>All Leads ({leads.length})</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Name", "Phone", "Source", "Status", "Temperature", "Score", "Messages", "Created"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const summary = lead.leadSummaries?.[0];
                return (
                  <tr key={lead.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{lead.name || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#64748B", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{lead.phone || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: 12, fontSize: "0.75rem", fontWeight: 600 }}>{lead.source}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        background: lead.status === "NEW" ? "#F0FDF4" : lead.status === "CONTACTED" ? "#FFF7ED" : lead.status === "QUALIFIED" ? "#EFF6FF" : "#FEF2F2",
                        color: lead.status === "NEW" ? "#16A34A" : lead.status === "CONTACTED" ? "#EA580C" : lead.status === "QUALIFIED" ? "#2563EB" : "#DC2626",
                        padding: "2px 8px", borderRadius: 12, fontSize: "0.75rem", fontWeight: 600
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {summary ? (
                        <span style={{
                          background: summary.temperature === "HOT" ? "#FEF2F2" : summary.temperature === "WARM" ? "#FFF7ED" : "#F1F5F9",
                          color: summary.temperature === "HOT" ? "#DC2626" : summary.temperature === "WARM" ? "#EA580C" : "#64748B",
                          padding: "2px 8px", borderRadius: 12, fontSize: "0.75rem", fontWeight: 600
                        }}>
                          {summary.temperature === "HOT" ? "🔥" : summary.temperature === "WARM" ? "🌡️" : "❄️"} {summary.temperature}
                        </span>
                      ) : <span style={{ color: "#CBD5E1", fontSize: "0.8rem" }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748B" }}>{summary?.score ?? "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#64748B" }}>{lead.conversations?.[0]?._count?.messages || 0}</td>
                    <td style={{ padding: "12px 16px", color: "#94A3B8", fontSize: "0.8rem" }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No leads yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Properties Tab ─────────────────────────────── */}
      {activeTab === "properties" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {properties.map((p) => (
            <div key={p.id} style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer" }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ height: 120, background: "linear-gradient(135deg, #1e3a5f, #2563EB)", display: "flex", alignItems: "flex-end", padding: 16 }}>
                <span style={{ background: "rgba(0,0,0,0.5)", color: "white", padding: "4px 10px", borderRadius: 6, fontWeight: 600, fontSize: "0.9rem" }}>
                  AED {p.price.toLocaleString()}/yr
                </span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4, lineHeight: 1.3 }}>{p.title}</div>
                <div style={{ color: "#64748B", fontSize: "0.8rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  📍 {p.location}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: "0.8rem", color: "#64748B" }}>
                  <span>🏠 {p.type}</span>
                  {p.beds !== null && <span>🛏 {p.beds} Bed</span>}
                  {p.baths !== null && <span>🚿 {p.baths} Bath</span>}
                </div>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: 60, textAlign: "center", color: "#94A3B8" }}>No properties found.</div>
          )}
        </div>
      )}
    </div>
  );
}
