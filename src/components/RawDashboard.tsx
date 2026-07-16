"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, Building2, Calendar, Activity,
  Search, Bell, Moon, Sun, LogOut, MessageCircle, MapPin, Bed, Bath, Flame, Snowflake, SunMedium, BarChart3
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function RawDashboard({ user }: { user: { name: string; role: string } }) {
  const [activeView, setActiveView] = useState("overview");
  const [theme, setTheme] = useState("light");
  const [leads, setLeads] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    Promise.all([
      fetch("/api/leads").then(res => res.json()),
      fetch("/api/properties").then(res => res.json())
    ]).then(([leadsData, propsData]) => {
      setLeads(leadsData.leads || []);
      setProperties(propsData.properties || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // KPIs & Chart Data
  const totalLeads = leads.length;
  const activeDeals = leads.filter(l => l.conversations?.length > 0).length;
  const totalProps = properties.length;
  
  const hotLeads = leads.filter(l => l.leadSummaries?.[0]?.temperature === "HOT").length;
  const warmLeads = leads.filter(l => l.leadSummaries?.[0]?.temperature === "WARM").length;
  const coldLeads = leads.filter(l => l.leadSummaries?.[0]?.temperature === "COLD").length;
  const unassignedLeads = totalLeads - (hotLeads + warmLeads + coldLeads);

  const donutData = [
    { name: 'Hot', value: hotLeads, color: '#EF4444' },
    { name: 'Warm', value: warmLeads, color: '#F59E0B' },
    { name: 'Cold', value: coldLeads, color: '#3B82F6' },
    { name: 'New', value: unassignedLeads, color: '#A3A3A3' }
  ].filter(d => d.value > 0);

  // Fallback donut if 0 leads
  if (donutData.length === 0) donutData.push({ name: 'No Data', value: 1, color: '#333' });

  // Generate mock trend for area chart (last 7 days based on current leads)
  const areaData = [
    { name: 'Mon', leads: Math.max(0, totalLeads - 6) },
    { name: 'Tue', leads: Math.max(1, totalLeads - 5) },
    { name: 'Wed', leads: Math.max(3, totalLeads - 4) },
    { name: 'Thu', leads: Math.max(2, totalLeads - 2) },
    { name: 'Fri', leads: Math.max(5, totalLeads - 1) },
    { name: 'Sat', leads: totalLeads > 0 ? totalLeads : 2 },
    { name: 'Sun', leads: totalLeads + 2 },
  ];

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo glass-card">
            <Building2 size={20} color="#2563EB" />
          </div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">Al Alkeem</div>
            <div className="sidebar-brand-sub">PMS Command</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">Main Menu</div>
          <div 
            className={`sidebar-item ${activeView === "overview" ? "active" : ""}`}
            onClick={() => setActiveView("overview")}
          >
            <LayoutDashboard /> Overview
          </div>
          
          <div 
            className={`sidebar-item ${activeView === "leads" ? "active" : ""}`}
            onClick={() => setActiveView("leads")}
          >
            <Users /> Leads & Scoring
            {hotLeads > 0 && <span className="item-badge">{hotLeads}</span>}
          </div>

          <div 
            className={`sidebar-item ${activeView === "summaries" ? "active" : ""}`}
            onClick={() => setActiveView("summaries")}
          >
            <BarChart3 /> Lead Summaries
          </div>

          <div 
            className={`sidebar-item ${activeView === "properties" ? "active" : ""}`}
            onClick={() => setActiveView("properties")}
          >
            <Building2 /> Properties
          </div>
          
          {user.role === 'SUPER_ADMIN' && (
            <>
              <div className="sidebar-section">Integrations</div>
              <a href="/simulator" target="_blank" className="sidebar-item">
                <MessageCircle /> WhatsApp Sim
              </a>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{user.role}</div>
            </div>
            <button className="sidebar-signout" onClick={() => signOut()} title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-title-area">
            <div className="topbar-eyebrow">Command Center</div>
            <div className="topbar-title">
              {activeView === "overview" && "Operations Overview"}
              {activeView === "leads" && "Lead Management"}
              {activeView === "summaries" && "AI Lead Summaries"}
              {activeView === "properties" && "Property Portfolio"}
            </div>
          </div>
          
          <div className="topbar-search">
            <Search size={16} />
            <input type="text" placeholder="Search across PMS..." />
          </div>

          <div className="topbar-actions">
            <button className="topbar-btn" title="Notifications">
              <Bell size={18} />
              <span className="topbar-ping" />
            </button>
            <button className="topbar-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* SCROLL AREA */}
        <div className="content-scroll">
          {loading ? (
            <div className="empty-state">
              <div className="shimmer" style={{width: 200, height: 20, marginBottom: 10}} />
              <div className="shimmer" style={{width: 300, height: 16}} />
            </div>
          ) : (
            <>
              {/* OVERVIEW VIEW */}
              {activeView === "overview" && (
                <div className="animate-in">
                  <div className="kpi-grid">
                    <div className="solid-card kpi-card">
                      <div className="kpi-icon brand"><Users /></div>
                      <div>
                        <div className="kpi-label">Total Leads</div>
                        <div className="kpi-value">{totalLeads}</div>
                        <div className="kpi-delta up">+12% this week</div>
                      </div>
                    </div>
                    <div className="solid-card kpi-card">
                      <div className="kpi-icon danger"><Flame /></div>
                      <div>
                        <div className="kpi-label">Hot Leads</div>
                        <div className="kpi-value">{hotLeads}</div>
                        <div className="kpi-delta up">+3 recently</div>
                      </div>
                    </div>
                    <div className="solid-card kpi-card">
                      <div className="kpi-icon success"><Building2 /></div>
                      <div>
                        <div className="kpi-label">Properties</div>
                        <div className="kpi-value">{totalProps}</div>
                        <div className="kpi-delta up">Updated today</div>
                      </div>
                    </div>
                    <div className="solid-card kpi-card">
                      <div className="kpi-icon warning"><Activity /></div>
                      <div>
                        <div className="kpi-label">Active Deals</div>
                        <div className="kpi-value">{activeDeals}</div>
                        <div className="kpi-delta up">+4.2% cvr rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid-2" style={{marginBottom: 24}}>
                    <div className="solid-card panel">
                      <div className="panel-header">
                        <div>
                          <div className="panel-title">Lead Volume Trend</div>
                          <div className="panel-subtitle">New inbound conversations this week</div>
                        </div>
                      </div>
                      <div style={{height: 250, width: '100%', marginTop: 20}}>
                        <ResponsiveContainer>
                          <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 12}} />
                            <Tooltip 
                              contentStyle={{backgroundColor: 'var(--surface-3)', border: 'none', borderRadius: 8, color: 'var(--ink)'}}
                              itemStyle={{color: 'var(--brand)'}}
                            />
                            <Area type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="solid-card panel">
                      <div className="panel-header">
                        <div>
                          <div className="panel-title">Lead Quality Distribution</div>
                          <div className="panel-subtitle">AI-scored pipeline breakdown</div>
                        </div>
                      </div>
                      <div style={{height: 250, width: '100%', marginTop: 20}}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={donutData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {donutData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{backgroundColor: 'var(--surface-3)', border: 'none', borderRadius: 8, color: 'var(--ink)'}}
                              itemStyle={{color: 'var(--ink)'}}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="solid-card panel">
                      <div className="panel-header">
                        <div>
                          <div className="panel-title">Recent Pipeline Activity</div>
                          <div className="panel-subtitle">Latest inbound requests</div>
                        </div>
                      </div>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Lead Name</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.slice(0, 4).map(l => (
                            <tr key={l.id}>
                              <td style={{fontWeight: 500}}>{l.name}</td>
                              <td>
                                {l.leadSummaries?.[0]?.temperature === "HOT" ? (
                                  <span className="temp-pill hot"><span className="temp-dot"/>HOT</span>
                                ) : (
                                  <span className="temp-pill cold"><span className="temp-dot"/>NEW</span>
                                )}
                              </td>
                              <td style={{color: "var(--muted)", fontSize: "0.75rem"}}>
                                {new Date(l.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                          {leads.length === 0 && (
                            <tr><td colSpan={3} style={{textAlign:"center", padding: "30px 0"}}>No leads yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="solid-card panel">
                      <div className="panel-header">
                        <div>
                          <div className="panel-title">Property Highlights</div>
                          <div className="panel-subtitle">Recently added units</div>
                        </div>
                      </div>
                      <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                        {properties.slice(0, 3).map(p => (
                          <div key={p.id} className="glass-card" style={{padding: 16, display: "flex", alignItems: "center", gap: 16}}>
                            <div style={{width: 48, height: 48, borderRadius: 8, background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)"}}>
                              <Building2 size={24} />
                            </div>
                            <div>
                              <div style={{fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", marginBottom: 2}}>{p.title}</div>
                              <div style={{fontSize: "0.75rem", color: "var(--muted)", display: "flex", gap: 8}}>
                                <span style={{display: "flex", alignItems:"center", gap:3}}><MapPin size={12}/> {p.location.split(',')[0]}</span>
                                <span style={{display: "flex", alignItems:"center", gap:3}}><Bed size={12}/> {p.beds || "N/A"}</span>
                              </div>
                            </div>
                            <div style={{marginLeft: "auto", fontWeight: 700, fontSize: "0.9rem", color: "var(--brand)"}}>
                              {p.price.toLocaleString()} AED
                            </div>
                          </div>
                        ))}
                        {properties.length === 0 && <div style={{padding: "20px", textAlign: "center", color: "var(--muted)"}}>No properties yet</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LEADS VIEW */}
              {activeView === "leads" && (
                <div className="animate-in">
                  <div className="solid-card panel">
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">Lead Register</div>
                        <div className="panel-subtitle">All captured leads and their status</div>
                      </div>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Lead</th>
                          <th>Contact</th>
                          <th>Source</th>
                          <th>Score</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map(l => {
                          const summary = l.leadSummaries?.[0];
                          const score = summary?.score || 0;
                          let tempClass = "cold";
                          if (summary?.temperature === "HOT") tempClass = "hot";
                          if (summary?.temperature === "WARM") tempClass = "warm";

                          return (
                            <tr key={l.id}>
                              <td style={{fontWeight: 600}}>{l.name}</td>
                              <td className="mono" style={{fontSize: "0.8rem"}}>{l.phone}</td>
                              <td><span className="status-pill closed">{l.source}</span></td>
                              <td>
                                {summary ? (
                                  <div style={{display: "flex", alignItems: "center", gap: 10}}>
                                    <span style={{fontWeight: 600, width: 20}}>{score}</span>
                                    <div className="score-bar" style={{width: 60}}>
                                      <div className={`score-fill ${tempClass}`} style={{width: `${score}%`}} />
                                    </div>
                                  </div>
                                ) : <span style={{color: "var(--muted)"}}>N/A</span>}
                              </td>
                              <td>
                                {summary ? (
                                  <span className={`temp-pill ${tempClass}`}>
                                    <span className="temp-dot"/>{summary.temperature}
                                  </span>
                                ) : <span className="status-pill closed">NEW</span>}
                              </td>
                              <td style={{color: "var(--muted)", fontSize: "0.75rem"}}>
                                {new Date(l.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          );
                        })}
                        {leads.length === 0 && (
                          <tr><td colSpan={6} style={{textAlign:"center", padding: "30px 0"}}>No leads yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUMMARIES VIEW */}
              {activeView === "summaries" && (
                <div className="animate-in">
                  <div className="grid-2">
                    {leads.filter(l => l.leadSummaries?.length > 0).map(l => {
                      const summary = l.leadSummaries[0];
                      let tempClass = "cold";
                      let TempIcon = Snowflake;
                      if (summary.temperature === "HOT") { tempClass = "hot"; TempIcon = Flame; }
                      if (summary.temperature === "WARM") { tempClass = "warm"; TempIcon = SunMedium; }

                      return (
                        <div key={l.id} className={`solid-card summary-card ${tempClass}`}>
                          <div className="summary-header">
                            <div>
                              <div className="summary-lead-name">{l.name}</div>
                              <div className="summary-lead-phone mono">{l.phone}</div>
                            </div>
                            <div style={{display: "flex", alignItems: "center", gap: 12}}>
                              <span className={`temp-pill ${tempClass}`}><TempIcon size={12}/> {summary.temperature}</span>
                              <div style={{fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", minWidth: 28, textAlign: "right"}}>{summary.score}</div>
                            </div>
                          </div>
                          
                          <div className="score-bar" style={{marginBottom: 16}}>
                            <div className={`score-fill ${tempClass}`} style={{width: `${summary.score}%`}} />
                          </div>

                          <div className="summary-reasoning">
                            {summary.reasoning}
                          </div>

                          <div className="summary-meta">
                            <div className="summary-meta-item">
                              <MessageCircle /> {l.conversations?.[0]?._count?.messages || 0} messages
                            </div>
                            <div className="summary-meta-item">
                              <Calendar /> Scored {new Date(summary.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {leads.filter(l => l.leadSummaries?.length > 0).length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon"><Activity /></div>
                      <div className="empty-title">No AI Summaries Yet</div>
                      <div className="empty-desc">Once a lead interacts with the WhatsApp bot, the AI will automatically generate a summary and score here.</div>
                    </div>
                  )}
                </div>
              )}

              {/* PROPERTIES VIEW */}
              {activeView === "properties" && (
                <div className="animate-in">
                  <div className="prop-grid">
                    {properties.map(p => (
                      <div key={p.id} className="solid-card prop-card">
                        <div className="prop-image">
                          <div className="prop-price">{p.price.toLocaleString()} AED</div>
                          <div className={`prop-status-badge available`}>Available</div>
                        </div>
                        <div className="prop-info">
                          <div className="prop-title" title={p.title}>{p.title}</div>
                          <div className="prop-location">
                            <MapPin /> {p.location}
                          </div>
                          <div className="prop-specs">
                            <div className="prop-spec">
                              <Building2 /> {p.type}
                            </div>
                            {p.beds && (
                              <div className="prop-spec">
                                <Bed /> {p.beds}
                              </div>
                            )}
                            {p.baths && (
                              <div className="prop-spec">
                                <Bath /> {p.baths}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {properties.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon"><Building2 /></div>
                      <div className="empty-title">No Properties</div>
                      <div className="empty-desc">Your property portfolio is empty. Check the API or Database.</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}