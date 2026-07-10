import React from 'react';
import './dashboard.css';

export default function RawDashboard() {
  return (
    <>
<div>
  <div className="app">
    <aside className="sidebar">
      <div className="brand">
        <svg className="mark" viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="g1" x1={0} y1={0} x2={1} y2={1}>
              <stop offset={0} stopColor="#6477DE" />
              <stop offset={1} stopColor="#4F63D2" />
            </linearGradient>
          </defs>
          <rect x={6} y={6} width={88} height={88} rx={22} fill="url(#g1)" />
          {/* P monogram for PropSync */}
          <rect x={28} y={22} width={10} height={56} rx={4} fill="#fff" />
          <rect x={28} y={22} width={36} height={10} rx={4} fill="#fff" />
          <rect x={28} y={48} width={36} height={10} rx={4} fill="#fff" />
          <rect x={54} y={22} width={10} height={36} rx={4} fill="#fff" />
        </svg>
        <div>
          <div className="brand-name">PropSync</div>
          <div className="brand-sub">Real Estate Intelligence</div>
        </div>
      </div>
      <div className="nav-label">Command</div>
      <div className="nav-item active" data-view="overview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x={3} y={3} width={7} height={9} rx="1.5" />
          <rect x={14} y={3} width={7} height={5} rx="1.5" />
          <rect x={14} y={12} width={7} height={9} rx="1.5" />
          <rect x={3} y={16} width={7} height={5} rx="1.5" />
        </svg>Overview</div>
      <div className="nav-item" data-view="database"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>WhatsApp Integration</div>
      <div className="nav-item" data-view="leads"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx={9} cy={7} r={4} />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>Leads &amp; Scoring</div>
      <div className="nav-item" data-view="properties"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3" />
          <path d="M9 9v.01M9 13v.01M9 17v.01" />
        </svg>Property Availability</div>
      <div className="nav-item" data-view="appointments"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x={3} y={4} width={18} height={18} rx={2} />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>Appointments &amp; Calendar</div>
      <div className="nav-item" data-view="pipeline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-6 4 3 5-7" />
        </svg>Deal Pipeline</div>
      <div className="nav-label">Automation</div>
      <div className="nav-item" data-view="automations"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>Follow-Up Automation<span className="badge dot">10</span></div>
      <div className="nav-item" data-view="portals"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx={12} cy={12} r={10} />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>Portal Sync</div>
      <div className="nav-label hidden" data-sa={1}>Super Admin</div>
      <div className="nav-item hidden" data-sa={1} data-view="client"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
        </svg>Client Account</div>
      <div className="nav-item hidden" data-sa={1} data-view="billing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x={2} y={5} width={20} height={14} rx={2} />
          <path d="M2 10h20" />
        </svg>Subscription<span className="badge" id="bill-badge">!</span></div>
      <div className="side-foot">
        <div className="role-switch" id="role-switch"><button className="on" data-r="admin">Admin</button><button data-r="super">Super Admin</button></div>
        <div className="agent-mini">
          <div className="avatar" id="me-av" style={{background: 'linear-gradient(135deg,#3FB6A8,#268a7e)'}}>MS</div>
          <div style={{flex: 1, minWidth: 0}}>
            <div className="nm" id="me-nm">Mariam Saeed</div>
            <div className="rl" id="me-rl">Admin · Sales Desk</div>
          </div><a id="signout-btn" href="/api/auth/signout" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, color: 'var(--muted)', textDecoration: 'none', border: '1px solid var(--line)', transition: '.15s', flexShrink: 0}} title="Sign out" onmouseover="this.style.color='var(--hot)';this.style.borderColor='var(--hot)'" onmouseout="this.style.color='var(--muted)';this.style.borderColor='var(--line)'"><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg></a>
        </div>
      </div>
    </aside>
    <div className="main">
      <header className="topbar">
        <div>
          <div className="page-eyebrow" id="eyebrow">Command Center</div>
          <div className="page-title" id="ptitle">Operations Overview</div>
        </div>
        <div className="search"><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx={11} cy={11} r={8} />
            <path d="M21 21l-4.35-4.35" />
          </svg><input placeholder="Search leads, properties…" /></div>
        <div className="lang"><button className="on">EN</button><button>ع</button></div>
        <div className="t-btn" onclick="toast('You have 4 unread AI conversations','bell')"><span className="ping" /><svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg></div>
        <div className="t-btn" id="theme-btn" onclick="toggleTheme()" title="Toggle light / dark mode"><svg id="theme-icon-sun" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{display: 'none'}}>
            <circle cx={12} cy={12} r={5} />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg><svg id="theme-icon-moon" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg></div>
      </header>
      <div className="scroll">
        {/* OVERVIEW */}
        <section className="view active" id="overview">
          <div className="kpi-grid">
            <div className="card kpi">
              <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx={9} cy={7} r={4} />
                </svg></div>
              <div className="lbl">New Leads</div>
              <div className="num">1,024</div><span className="delta up">▲ 18.2%<span className="vs">vs last mo</span></span>
            </div>
            <div className="card kpi">
              <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg></div>
              <div className="lbl">Pipeline Value</div>
              <div className="num">142<small>M</small></div><span className="delta up">▲ 9.4%<span className="vs">AED</span></span>
            </div>
            <div className="card kpi">
              <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x={3} y={4} width={18} height={18} rx={2} />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg></div>
              <div className="lbl">Site Visits</div>
              <div className="num">37</div><span className="delta up">▲ 6<span className="vs">this week</span></span>
            </div>
            <div className="card kpi">
              <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg></div>
              <div className="lbl">Deals Won</div>
              <div className="num">14</div><span className="delta up">▲ 3<span className="vs">this mo</span></span>
            </div>
            <div className="card kpi">
              <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 3v18h18" />
                  <path d="M19 9l-5 5-4-4-3 3" />
                </svg></div>
              <div className="lbl">Conversion</div>
              <div className="num">22<small>%</small></div><span className="delta up">▲ 2.1pt<span className="vs">lead→won</span></span>
            </div>
            <div className="card kpi">
              <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx={12} cy={12} r={10} />
                  <path d="M12 6v6l4 2" />
                </svg></div>
              <div className="lbl">Deal Cycle</div>
              <div className="num">31<small>d</small></div><span className="delta down">▼ 4d<span className="vs">faster</span></span>
            </div>
          </div>
          <div className="row c2" style={{marginBottom: 16}}>
            <div className="card panel">
              <div className="panel-h">
                <div>
                  <h3>Lead Flow</h3>
                  <div className="sub">Inbound volume · all channels</div>
                </div>
                <div className="seg"><button>7D</button><button className="on">30D</button><button>90D</button></div>
              </div>
              <svg viewBox="0 0 720 250" style={{width: '100%', height: 'auto'}}>
                <defs>
                  <linearGradient id="area1" x1={0} y1={0} x2={0} y2={1}>
                    <stop offset={0} stopColor="#4F63D2" stopOpacity=".22" />
                    <stop offset={1} stopColor="#4F63D2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <g stroke="rgba(0,0,0,.06)" strokeWidth={1}>
                  <line x1={40} y1={40} x2={700} y2={40} />
                  <line x1={40} y1={95} x2={700} y2={95} />
                  <line x1={40} y1={150} x2={700} y2={150} />
                  <line x1={40} y1={205} x2={700} y2={205} />
                </g>
                <g fill="#5E7172" fontSize={10} fontFamily="monospace"><text x={10} y={44}>60</text><text x={10} y={99}>40</text><text x={10} y={154}>20</text><text x={10} y={209}>0</text></g>
                <path d="M40 175 L130 150 L220 160 L310 110 L400 130 L490 78 L580 95 L670 52 L700 60 L700 205 L40 205 Z" fill="url(#area1)" />
                <path d="M40 175 L130 150 L220 160 L310 110 L400 130 L490 78 L580 95 L670 52 L700 60" fill="none" stroke="#4F63D2" strokeWidth="2.6" strokeLinejoin="round" />
                <g fill="#ffffff" stroke="#4F63D2" strokeWidth="2.5">
                  <circle cx={310} cy={110} r={4} />
                  <circle cx={490} cy={78} r={4} />
                  <circle cx={670} cy={52} r={4} />
                </g>
                <g fill="#5E7172" fontSize={10}><text x={118} y={228}>Wk 1</text><text x={298} y={228}>Wk 2</text><text x={478} y={228}>Wk 3</text><text x={648} y={228}>Wk 4</text></g>
              </svg>
            </div>
            <div className="card panel">
              <div className="panel-h">
                <div>
                  <h3>Lead Sources</h3>
                  <div className="sub">This month · 1,024 leads</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <svg viewBox="0 0 120 120" width={134} height={134}>
                  <circle cx={60} cy={60} r={46} fill="none" stroke="#EAEDF2" strokeWidth={16} />
                  <circle cx={60} cy={60} r={46} fill="none" stroke="#4F63D2" strokeWidth={16} strokeDasharray="130 289" transform="rotate(-90 60 60)" />
                  <circle cx={60} cy={60} r={46} fill="none" stroke="#2E9E8F" strokeWidth={16} strokeDasharray="78 289" strokeDashoffset={-130} transform="rotate(-90 60 60)" />
                  <circle cx={60} cy={60} r={46} fill="none" stroke="#3D7BB4" strokeWidth={16} strokeDasharray="52 289" strokeDashoffset={-208} transform="rotate(-90 60 60)" />
                  <circle cx={60} cy={60} r={46} fill="none" stroke="#C28A2B" strokeWidth={16} strokeDasharray="29 289" strokeDashoffset={-260} transform="rotate(-90 60 60)" />
                  <text x={60} y={55} textAnchor="middle" fill="#1E2733" fontSize={20} fontFamily="Georgia" fontWeight={700}>45%</text>
                  <text x={60} y={71} textAnchor="middle" fill="#8FA0A0" fontSize={8} fontWeight={700}>WHATSAPP</text>
                </svg>
                <div className="legend" style={{flex: 1}}>
                  <div className="li"><span className="sw" style={{background: '#4F63D2'}} /><span className="nm">WhatsApp
                      AI</span><span className="v">45%</span></div>
                  <div className="li"><span className="sw" style={{background: '#2E9E8F'}} /><span className="nm">Bayut</span><span className="v">27%</span></div>
                  <div className="li"><span className="sw" style={{background: '#3D7BB4'}} /><span className="nm">Property
                      Finder</span><span className="v">18%</span></div>
                  <div className="li"><span className="sw" style={{background: '#C28A2B'}} /><span className="nm">Referral ·
                      Walk-in</span><span className="v">10%</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="row c2">
            <div className="card panel">
              <div className="panel-h">
                <div>
                  <h3>Conversion Funnel</h3>
                  <div className="sub">Lead lifecycle this month</div>
                </div><a className="link" onclick="go('pipeline')">Open pipeline →</a>
              </div>
              <div className="funnel-row">
                <div className="fl">Inquiry</div>
                <div className="funnel-bar">
                  <div className="funnel-fill" style={{width: '100%'}}>1,024</div>
                </div>
              </div>
              <div className="funnel-row">
                <div className="fl">Qualified</div>
                <div className="funnel-bar">
                  <div className="funnel-fill" style={{width: '62%'}}>634</div>
                </div>
              </div>
              <div className="funnel-row">
                <div className="fl">Site Visit</div>
                <div className="funnel-bar">
                  <div className="funnel-fill" style={{width: '38%'}}>389</div>
                </div>
              </div>
              <div className="funnel-row">
                <div className="fl">Offer</div>
                <div className="funnel-bar">
                  <div className="funnel-fill" style={{width: '21%'}}>216</div>
                </div>
              </div>
              <div className="funnel-row">
                <div className="fl">Won</div>
                <div className="funnel-bar">
                  <div className="funnel-fill" style={{width: '9%'}}>94</div>
                </div>
              </div>
            </div>
            <div className="card panel">
              <div className="panel-h">
                <div>
                  <h3>Agent Leaderboard</h3>
                  <div className="sub">Deals won · this month</div>
                </div>
              </div>
              <div id="leaderboard" />
            </div>
          </div>
        </section>
        {/* WHATSAPP INTEGRATION */}
        <section className="view" id="database">
          <div className="card panel" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 500, textAlign: 'center'}}>
            <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5" style={{marginBottom: 20}}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <h2 className="serif" style={{color: 'var(--ink)', marginBottom: 12, fontSize: '1.8rem'}}>WhatsApp Integration</h2>
            <p style={{color: 'var(--muted)', marginBottom: 30, maxWidth: 400, lineHeight: '1.6'}}>Scan the QR code below to connect your WhatsApp account with Al Alkeem PMS and sync your leads.</p>
            <div style={{background: '#fff', padding: 16, borderRadius: 12, display: 'inline-block', border: '1px solid var(--line)', marginBottom: 24}}>
              <svg width={180} height={180} viewBox="0 0 24 24" fill="var(--ink)">
                <path d="M3 3h8v8H3zM5 5v4h4V5zM13 3h8v8h-8zM15 5v4h4V5zM3 13h8v8H3zM5 15v4h4v-4zM13 13h2v2h-2zM17 13h4v2h-4zM15 15h2v2h-2zM19 15h2v2h-2zM13 17h4v4h-4zM19 17h2v4h-2zM15 17h2v2h-2zM13 19h2v2h-2z" />
              </svg>
            </div>
            <div>
              <button style={{background: 'var(--ink)', color: 'var(--surface)', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '.9rem'}} onclick="toast('Waiting for scan...', 'sync')">Regenerate QR</button>
            </div>
          </div>
        </section>
        {/* LEADS */}
        <section className="view" id="leads">
          <div className="row c3" style={{marginBottom: 16}}>
            <div className="card panel" style={{display: 'flex', alignItems: 'center', gap: 15}}>
              <div className="auto-ic" style={{background: 'var(--hot-soft)', color: 'var(--hot)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2s7 4 7 11a7 7 0 0 1-14 0c0-2 1-4 1-4s2 2 3 2c0-3 3-9 3-9z" />
                </svg></div>
              <div>
                <div className="serif" style={{fontSize: '1.9rem', color: 'var(--ink)', lineHeight: 1, fontWeight: 700}}>142</div>
                <span className="chip hot" style={{marginTop: 5}}><span className="d" style={{background: 'var(--hot)'}} />HOT ·
                  score &gt; 60</span>
              </div>
            </div>
            <div className="card panel" style={{display: 'flex', alignItems: 'center', gap: 15}}>
              <div className="auto-ic" style={{background: 'var(--warm-soft)', color: 'var(--warm)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx={12} cy={12} r={9} />
                  <path d="M12 8v4l3 2" />
                </svg></div>
              <div>
                <div className="serif" style={{fontSize: '1.9rem', color: 'var(--ink)', lineHeight: 1, fontWeight: 700}}>358</div>
                <span className="chip warm" style={{marginTop: 5}}><span className="d" style={{background: 'var(--warm)'}} />WARM · 30–60</span>
              </div>
            </div>
            <div className="card panel" style={{display: 'flex', alignItems: 'center', gap: 15}}>
              <div className="auto-ic" style={{background: 'var(--cold-soft)', color: 'var(--cold)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
                  <circle cx={12} cy={12} r={3} />
                </svg></div>
              <div>
                <div className="serif" style={{fontSize: '1.9rem', color: 'var(--ink)', lineHeight: 1, fontWeight: 700}}>524</div>
                <span className="chip cold" style={{marginTop: 5}}><span className="d" style={{background: 'var(--cold)'}} />COLD · &lt; 30</span>
              </div>
            </div>
          </div>
          <div className="card panel">
            <div className="panel-h">
              <div>
                <h3>Lead Register</h3>
                <div className="sub">AI-scored &amp; auto-assigned · round-robin routing</div>
              </div>
              <div className="flex">
                <div className="seg" id="lead-filter"><button className="on" data-f="all">All</button><button data-f="hot">Hot</button><button data-f="warm">Warm</button><button data-f="cold">Cold</button>
                </div><button className="mini-btn gold" onclick="toast('New lead form opened','plus')">+ New Lead</button>
              </div>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Source</th>
                  <th>Requirement</th>
                  <th>Score</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody id="leads-body" />
            </table>
          </div>
        </section>
        {/* PROPERTIES */}
        <section className="view" id="properties">
          <div className="card panel" style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'}}>
            <div className="search" style={{margin: 0, width: 240}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={8} />
                <path d="M21 21l-4.35-4.35" />
              </svg><input placeholder="Search area, developer, ref…" /></div>
            <div className="seg" id="prop-filter"><button className="on" data-f="all">All</button><button data-f="available">Available</button><button data-f="reserved">Reserved</button><button data-f="offer">Under Offer</button><button data-f="sold">Sold</button></div>
            <button className="mini-btn gold" style={{marginLeft: 'auto'}} onclick="toast('Add property form opened','plus')">+
              Add Property</button>
          </div>
          <div className="prop-grid" id="prop-grid" />
        </section>
        {/* APPOINTMENTS */}
        <section className="view" id="appointments">
          <div className="row split" style={{marginBottom: 16}}>
            <div className="card panel" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12}}>
              <div>
                <div className="page-eyebrow">Week of 23 June 2026</div>
                <h3 className="serif" style={{fontSize: '1.35rem', color: 'var(--ink)', marginTop: 3}}>Site Visit Calendar</h3>
              </div>
              <div className="flex"><span className="chip green"><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>Google Calendar synced</span><button className="mini-btn" style={{background: 'var(--ink)', color: '#fff', border: 'none'}} onclick="toast('Site visit booking opened','cal')">+ Book Visit</button></div>
            </div>
            <div className="card panel" style={{display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'space-around'}}>
              <div style={{textAlign: 'center'}}>
                <div className="serif" style={{fontSize: '1.8rem', color: 'var(--ink)', fontWeight: 700}}>37</div>
                <div style={{fontSize: '.66rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700}}>
                  Scheduled</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div className="serif" style={{fontSize: '1.8rem', color: 'var(--emerald)', fontWeight: 700}}>28</div>
                <div style={{fontSize: '.66rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700}}>
                  Confirmed</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div className="serif" style={{fontSize: '1.8rem', color: 'var(--warm)', fontWeight: 700}}>5</div>
                <div style={{fontSize: '.66rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700}}>
                  Awaiting</div>
              </div>
            </div>
          </div>
          <div className="card panel">
            <div className="cal">
              <div className="cal-head">Mon 23</div>
              <div className="cal-head">Tue 24</div>
              <div className="cal-head">Wed 25</div>
              <div className="cal-head">Thu 26</div>
              <div className="cal-head">Fri 27</div>
              <div className="cal-head">Sat 28</div>
              <div className="cal-head">Sun 29</div>
              <div className="cal-day today"><div className="dn">23</div></div>
              <div className="cal-day"><div className="dn">24</div></div>
              <div className="cal-day"><div className="dn">25</div></div>
              <div className="cal-day"><div className="dn">26</div></div>
              <div className="cal-day"><div className="dn">27</div></div>
              <div className="cal-day"><div className="dn">28</div></div>
              <div className="cal-day"><div className="dn">29</div></div>
            </div>
          </div>
        </section>
        {/* PIPELINE */}
        <section className="view" id="pipeline">
          <div className="card panel" style={{marginBottom: 16, display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center'}}>
            <div>
              <div className="page-eyebrow">Total pipeline</div>
              <div className="serif" style={{fontSize: '1.85rem', color: 'var(--ink)', fontWeight: 700}}>AED 142.4M</div>
            </div>
            <div style={{width: 1, height: 40, background: 'var(--line)'}} />
            <div>
              <div className="page-eyebrow">Weighted</div>
              <div className="serif" style={{fontSize: '1.85rem', color: 'var(--amber-2)', fontWeight: 700}}>AED 61.8M</div>
            </div>
            <div style={{width: 1, height: 40, background: 'var(--line)'}} />
            <div>
              <div className="page-eyebrow">Win rate</div>
              <div className="serif" style={{fontSize: '1.85rem', color: 'var(--emerald)', fontWeight: 700}}>43%</div>
            </div>
            <div className="seg" style={{marginLeft: 'auto'}}><button className="on">Board</button><button>List</button></div>
          </div>
          <div className="kanban" id="kanban" />
        </section>
        {/* AUTOMATIONS */}
        <section className="view" id="automations">
          <div className="row c3" style={{marginBottom: 16}}>
            <div className="card panel" style={{textAlign: 'center'}}>
              <div className="serif" style={{fontSize: '2rem', color: 'var(--ink)', fontWeight: 700}}>10</div>
              <div style={{fontSize: '.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700}}>
                Active Workflows</div>
            </div>
            <div className="card panel" style={{textAlign: 'center'}}>
              <div className="serif" style={{fontSize: '2rem', color: 'var(--emerald)', fontWeight: 700}}>3,847</div>
              <div style={{fontSize: '.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700}}>
                Messages · 30d</div>
            </div>
            <div className="card panel" style={{textAlign: 'center'}}>
              <div className="serif" style={{fontSize: '2rem', color: 'var(--amber-2)', fontWeight: 700}}>99.4%</div>
              <div style={{fontSize: '.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700}}>
                Delivery Success</div>
            </div>
          </div>
          <div className="row c2" id="auto-list" />
        </section>
        {/* PORTALS */}
        <section className="view" id="portals">
          <div className="card panel" style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'}}>
            <div className="auto-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M16 6l4 4-4 4M8 18l-4-4 4-4M14 4l-4 16" />
              </svg></div>
            <div style={{flex: 1, minWidth: 200}}>
              <h3 className="serif" style={{fontSize: '1.2rem', color: 'var(--ink)'}}>Portal Distribution</h3>
              <div className="sub">Auto-published to UAE portals · last full sync 2 hours ago</div>
            </div>
            <button className="mini-btn gold" onclick="toast('Syncing 84 listings to Bayut and Property Finder…','sync')">Sync all now</button>
          </div>
          <div className="row c2">
            <div className="card portal-card">
              <div className="portal-h">
                <div className="portal-logo" style={{background: 'linear-gradient(135deg,#3DBE6E,#1f9d52)'}}>B</div>
                <div>
                  <div className="nm">Bayut</div>
                  <div className="url">bayut.com/your-agency</div>
                </div>
                <div className="sync-stat"><span className="live-dot" />Connected</div>
              </div>
              <div className="portal-metrics">
                <div className="pm">
                  <div className="n">84</div>
                  <div className="l">Live Listings</div>
                </div>
                <div className="pm">
                  <div className="n">312</div>
                  <div className="l">Leads · 30d</div>
                </div>
                <div className="pm">
                  <div className="n">9.2K</div>
                  <div className="l">Views · 30d</div>
                </div>
              </div>
              <div className="sync-log"><span className="dot" />Pushed 3 new Marina listings · 2h ago</div>
              <div className="sync-log"><span className="dot" />Updated price · Palm Villa PJ-204 · 5h ago</div>
              <div className="sync-log"><span className="dot" />Removed sold · Downtown DT-118 · yesterday</div>
            </div>
            <div className="card portal-card">
              <div className="portal-h">
                <div className="portal-logo" style={{background: 'linear-gradient(135deg,#E8765A,#c4493a)'}}>P</div>
                <div>
                  <div className="nm">Property Finder</div>
                  <div className="url">propertyfinder.ae/your-agency</div>
                </div>
                <div className="sync-stat"><span className="live-dot" />Connected</div>
              </div>
              <div className="portal-metrics">
                <div className="pm">
                  <div className="n">84</div>
                  <div className="l">Live Listings</div>
                </div>
                <div className="pm">
                  <div className="n">208</div>
                  <div className="l">Leads · 30d</div>
                </div>
                <div className="pm">
                  <div className="n">7.6K</div>
                  <div className="l">Views · 30d</div>
                </div>
              </div>
              <div className="sync-log"><span className="dot" />Pushed 3 new Marina listings · 2h ago</div>
              <div className="sync-log"><span className="dot" />Featured upgrade · Emaar Beachfront · 6h ago</div>
              <div className="sync-log"><span className="dot" />Full export · 84 listings · yesterday</div>
            </div>
          </div>
          <div className="section-gap" />
          <div className="card panel">
            <div className="panel-h">
              <div>
                <h3>Export Queue</h3>
                <div className="sub">Portal-ready feed · generated nightly</div>
              </div><a className="link" onclick="toast('Portal CSV feed downloaded','sync')">Download feed →</a>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Ref</th>
                  <th>Portal</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="cell-main">
                      <div className="nm">Marina Gate · 2BR Sea View</div>
                    </div>
                  </td>
                  <td className="mono" style={{color: 'var(--muted)'}}>MG-3801</td>
                  <td><span className="src-tag">Bayut · PF</span></td>
                  <td>New listing</td>
                  <td><span className="chip green">Published</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="cell-main">
                      <div className="nm">Palm Jumeirah Signature Villa</div>
                    </div>
                  </td>
                  <td className="mono" style={{color: 'var(--muted)'}}>PJ-204</td>
                  <td><span className="src-tag">Bayut · PF</span></td>
                  <td>Price update</td>
                  <td><span className="chip green">Published</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="cell-main">
                      <div className="nm">Business Bay · 1BR Canal</div>
                    </div>
                  </td>
                  <td className="mono" style={{color: 'var(--muted)'}}>BB-512</td>
                  <td><span className="src-tag">Property Finder</span></td>
                  <td>New listing</td>
                  <td><span className="chip bronze">Queued</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="cell-main">
                      <div className="nm">Downtown · Burj View 3BR</div>
                    </div>
                  </td>
                  <td className="mono" style={{color: 'var(--muted)'}}>DT-118</td>
                  <td><span className="src-tag">Bayut · PF</span></td>
                  <td>Remove · sold</td>
                  <td><span className="chip grey">Processing</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* CLIENT ACCOUNT (super admin) */}
        <section className="view" id="client">
          <div className="card panel" style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'}}>
            <div className="avatar" style={{width: 58, height: 58, borderRadius: 16, fontSize: '1.2rem', background: 'linear-gradient(135deg,#EBBA63,#E0A33B)'}}>
              YA</div>
            <div style={{flex: 1, minWidth: 200}}>
              <h3 className="serif" style={{fontSize: '1.4rem', color: 'var(--ink)'}}>Your Agency Name</h3>
              <div className="sub">Real Estate Intelligence · Powered by PropSync</div>
            </div>
            <span className="chip green"><span className="d" style={{background: 'var(--emerald)'}} />Account Active</span>
            <button className="mini-btn" onclick="toast('Edit client profile','user')">Edit profile</button>
          </div>
          <div className="acct-grid">
            <div className="card panel">
              <div className="panel-h">
                <h3>Company Metadata</h3>
              </div>
              <div className="kv-row"><span className="k">Legal name</span><span className="v">Your Agency Name</span></div>
              <div className="kv-row"><span className="k">Workspace ID</span><span className="v mono">WS-UAE-0001</span></div>
              <div className="kv-row"><span className="k">Market</span><span className="v">UAE Real Estate</span></div>
              <div className="kv-row"><span className="k">Monthly lead volume</span><span className="v">~1,000 leads</span></div>
              <div className="kv-row"><span className="k">Languages</span><span className="v">English · Arabic</span></div>
              <div className="kv-row"><span className="k">Data region</span><span className="v">UAE · Asia/Dubai (UTC+4)</span>
              </div>
              <div className="kv-row"><span className="k">Onboarded</span><span className="v">12 Feb 2026</span></div>
            </div>
            <div className="card panel">
              <div className="panel-h">
                <h3>Contacts</h3>
              </div>
              <div className="kv-row"><span className="k">Client owner</span><span className="v">Agency Owner</span></div>
              <div className="kv-row"><span className="k">Owner phone</span><span className="v mono">+91 7559822081</span></div>
              <div className="kv-row"><span className="k">Owner email</span><span className="v">owner@youragency.ae</span></div>
              <div className="kv-row"><span className="k">Account manager</span><span className="v">Account Manager</span></div>
              <div className="kv-row"><span className="k">Agency</span><span className="v">PropSync Technologies</span></div>
              <div className="kv-row"><span className="k">Agency email</span><span className="v">support@propsync.io</span></div>
              <div className="kv-row"><span className="k">Agency phone</span><span className="v mono">+91 73562 01710</span></div>
            </div>
            <div className="card panel">
              <div className="panel-h">
                <div>
                  <h3>Connected Services</h3>
                  <div className="sub">Infrastructure managed by PropSync</div>
                </div>
              </div>
              <div className="svc">
                <div className="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg></div>
                <div>
                  <div className="sn">WhatsApp Business</div>
                  <div className="sd">360Dialog BSP · +917559822081</div>
                </div><span className="status"><span className="live-dot" />Connected</span>
              </div>
              <div className="svc">
                <div className="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx={12} cy={12} r={9} />
                    <path d="M8 12h8M12 8v8" />
                  </svg></div>
                <div>
                  <div className="sn">OpenAI · GPT-4.1-mini</div>
                  <div className="sd">Client-owned API key</div>
                </div><span className="status"><span className="live-dot" />Connected</span>
              </div>
              <div className="svc">
                <div className="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x={3} y={4} width={18} height={18} rx={2} />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg></div>
                <div>
                  <div className="sn">Google Calendar</div>
                  <div className="sd">5 agents authorised</div>
                </div><span className="status"><span className="live-dot" />Connected</span>
              </div>
              <div className="svc">
                <div className="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 8l8 5 8-5" />
                  </svg></div>
                <div>
                  <div className="sn">Resend Email</div>
                  <div className="sd">notifications@propsync.io</div>
                </div><span className="status"><span className="live-dot" />Connected</span>
              </div>
            </div>
            <div className="card panel">
              <div className="panel-h">
                <h3>Portals &amp; Platform</h3>
              </div>
              <div className="svc">
                <div className="si" style={{color: '#3DBE6E'}}>B</div>
                <div>
                  <div className="sn">Bayut</div>
                  <div className="sd">84 live listings</div>
                </div><span className="status"><span className="live-dot" />Connected</span>
              </div>
              <div className="svc">
                <div className="si" style={{color: '#E8765A'}}>P</div>
                <div>
                  <div className="sn">Property Finder</div>
                  <div className="sd">84 live listings</div>
                </div><span className="status"><span className="live-dot" />Connected</span>
              </div>
              <div className="svc">
                <div className="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <ellipse cx={12} cy={5} rx={9} ry={3} />
                    <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                  </svg></div>
                <div>
                  <div className="sn">Supabase Database</div>
                  <div className="sd">PostgreSQL · pgvector</div>
                </div><span className="status"><span className="live-dot" />Healthy</span>
              </div>
              <div className="svc">
                <div className="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg></div>
                <div>
                  <div className="sn">n8n Automation</div>
                  <div className="sd">10 workflows · Railway</div>
                </div><span className="status"><span className="live-dot" />Running</span>
              </div>
            </div>
          </div>
        </section>
        {/* SUBSCRIPTION (super admin) */}
        <section className="view" id="billing">
          <div id="renew-slot" />
          <div className="row split" style={{marginBottom: 16}}>
            <div className="card panel">
              <div className="panel-h">
                <div>
                  <h3>Current Subscription</h3>
                  <div className="sub">Growth Plan · managed subscription</div>
                </div><span className="chip bronze">Growth</span>
              </div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 16px'}}><span className="serif" style={{fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink)'}}>AED 799</span><span style={{color: 'var(--muted)', fontWeight: 600}}>/ month</span></div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '.76rem', color: 'var(--muted)', fontWeight: 600, marginBottom: 7}}>
                <span id="cycle-label">Day 30 of 30</span><span id="cycle-left">Renews today</span></div>
              <div className="cycle-bar">
                <div className="cycle-fill" id="cycle-fill" style={{width: '100%'}} />
              </div>
              <div className="flex" style={{marginTop: 14}}><span style={{fontSize: '.72rem', color: 'var(--muted)', fontWeight: 600}}>Simulate cycle:</span>
                <div className="seg" id="cycle-sim"><button data-d={1}>Day 1</button><button data-d={18}>Day
                    18</button><button className="on" data-d={30}>Day 30</button></div>
              </div>
            </div>
            <div className="card panel">
              <div className="panel-h">
                <h3>This Cycle</h3>
              </div>
              <div className="kv-row"><span className="k">Leads processed</span><span className="v mono">1,024 / 1,000</span></div>
              <div className="kv-row"><span className="k">WhatsApp messages</span><span className="v mono">3,847</span></div>
              <div className="kv-row"><span className="k">Site visits booked</span><span className="v mono">312</span></div>
              <div className="kv-row"><span className="k">Next invoice</span><span className="v">AED 799 · 23 Jun</span></div>
              <div className="kv-row"><span className="k">Payment method</span><span className="v">Visa •••• 4291</span></div>
            </div>
          </div>
          <div className="panel-h" style={{padding: '0 2px'}}>
            <div>
              <h3 className="serif" style={{fontSize: '1.25rem', color: 'var(--ink)'}}>Explore Plans</h3>
              <div className="sub">Choose the plan that fits your agency's growth</div>
            </div>
          </div>
          <div className="plan-grid" id="plan-grid" />
        </section>
      </div>
    </div>
  </div>
  <div className="qr-ov" id="qr-ov" onclick="closeQR()" />
  <div className="qr-modal" id="qr-modal">
    <button className="drawer-x" onclick="closeQR()"><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M18 6L6 18M6 6l12 12" />
      </svg></button>
    <div className="qr-head">
      <div className="wal"><svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 0 1 12 4zm-3 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.2.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3-.3-.2-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.2-1.2-.4-2.2-1.3-.8-.7-1.3-1.6-1.5-1.9-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.4z" />
        </svg></div>
      <div>
        <h3>Link WhatsApp</h3>
        <p>Connect this dashboard to your WhatsApp Business number.</p>
      </div>
    </div>
    <div className="qr-box"><svg className="qr" viewBox="0 0 296 296" width={190} height={190} xmlns="http://www.w3.org/2000/svg">
        <rect width={296} height={296} fill="#fff" />
        <g fill="#111B21">
          <rect x={16} y={16} width={8} height={8} />
          <rect x={24} y={16} width={8} height={8} />
          <rect x={32} y={16} width={8} height={8} />
          <rect x={40} y={16} width={8} height={8} />
          <rect x={48} y={16} width={8} height={8} />
          <rect x={56} y={16} width={8} height={8} />
          <rect x={64} y={16} width={8} height={8} />
          <rect x={96} y={16} width={8} height={8} />
          <rect x={120} y={16} width={8} height={8} />
          <rect x={128} y={16} width={8} height={8} />
          <rect x={144} y={16} width={8} height={8} />
          <rect x={168} y={16} width={8} height={8} />
          <rect x={200} y={16} width={8} height={8} />
          <rect x={208} y={16} width={8} height={8} />
          <rect x={224} y={16} width={8} height={8} />
          <rect x={232} y={16} width={8} height={8} />
          <rect x={240} y={16} width={8} height={8} />
          <rect x={248} y={16} width={8} height={8} />
          <rect x={256} y={16} width={8} height={8} />
          <rect x={264} y={16} width={8} height={8} />
          <rect x={272} y={16} width={8} height={8} />
          <rect x={16} y={24} width={8} height={8} />
          <rect x={64} y={24} width={8} height={8} />
          <rect x={88} y={24} width={8} height={8} />
          <rect x={96} y={24} width={8} height={8} />
          <rect x={120} y={24} width={8} height={8} />
          <rect x={128} y={24} width={8} height={8} />
          <rect x={136} y={24} width={8} height={8} />
          <rect x={144} y={24} width={8} height={8} />
          <rect x={152} y={24} width={8} height={8} />
          <rect x={160} y={24} width={8} height={8} />
          <rect x={224} y={24} width={8} height={8} />
          <rect x={272} y={24} width={8} height={8} />
          <rect x={16} y={32} width={8} height={8} />
          <rect x={32} y={32} width={8} height={8} />
          <rect x={40} y={32} width={8} height={8} />
          <rect x={48} y={32} width={8} height={8} />
          <rect x={64} y={32} width={8} height={8} />
          <rect x={80} y={32} width={8} height={8} />
          <rect x={96} y={32} width={8} height={8} />
          <rect x={120} y={32} width={8} height={8} />
          <rect x={136} y={32} width={8} height={8} />
          <rect x={144} y={32} width={8} height={8} />
          <rect x={160} y={32} width={8} height={8} />
          <rect x={184} y={32} width={8} height={8} />
          <rect x={192} y={32} width={8} height={8} />
          <rect x={224} y={32} width={8} height={8} />
          <rect x={240} y={32} width={8} height={8} />
          <rect x={248} y={32} width={8} height={8} />
          <rect x={256} y={32} width={8} height={8} />
          <rect x={272} y={32} width={8} height={8} />
          <rect x={16} y={40} width={8} height={8} />
          <rect x={32} y={40} width={8} height={8} />
          <rect x={40} y={40} width={8} height={8} />
          <rect x={48} y={40} width={8} height={8} />
          <rect x={64} y={40} width={8} height={8} />
          <rect x={80} y={40} width={8} height={8} />
          <rect x={96} y={40} width={8} height={8} />
          <rect x={128} y={40} width={8} height={8} />
          <rect x={136} y={40} width={8} height={8} />
          <rect x={144} y={40} width={8} height={8} />
          <rect x={152} y={40} width={8} height={8} />
          <rect x={176} y={40} width={8} height={8} />
          <rect x={192} y={40} width={8} height={8} />
          <rect x={208} y={40} width={8} height={8} />
          <rect x={224} y={40} width={8} height={8} />
          <rect x={240} y={40} width={8} height={8} />
          <rect x={248} y={40} width={8} height={8} />
          <rect x={256} y={40} width={8} height={8} />
          <rect x={272} y={40} width={8} height={8} />
          <rect x={16} y={48} width={8} height={8} />
          <rect x={32} y={48} width={8} height={8} />
          <rect x={40} y={48} width={8} height={8} />
          <rect x={48} y={48} width={8} height={8} />
          <rect x={64} y={48} width={8} height={8} />
          <rect x={80} y={48} width={8} height={8} />
          <rect x={88} y={48} width={8} height={8} />
          <rect x={120} y={48} width={8} height={8} />
          <rect x={136} y={48} width={8} height={8} />
          <rect x={160} y={48} width={8} height={8} />
          <rect x={168} y={48} width={8} height={8} />
          <rect x={176} y={48} width={8} height={8} />
          <rect x={200} y={48} width={8} height={8} />
          <rect x={224} y={48} width={8} height={8} />
          <rect x={240} y={48} width={8} height={8} />
          <rect x={248} y={48} width={8} height={8} />
          <rect x={256} y={48} width={8} height={8} />
          <rect x={272} y={48} width={8} height={8} />
          <rect x={16} y={56} width={8} height={8} />
          <rect x={64} y={56} width={8} height={8} />
          <rect x={80} y={56} width={8} height={8} />
          <rect x={88} y={56} width={8} height={8} />
          <rect x={104} y={56} width={8} height={8} />
          <rect x={136} y={56} width={8} height={8} />
          <rect x={144} y={56} width={8} height={8} />
          <rect x={160} y={56} width={8} height={8} />
          <rect x={176} y={56} width={8} height={8} />
          <rect x={192} y={56} width={8} height={8} />
          <rect x={208} y={56} width={8} height={8} />
          <rect x={224} y={56} width={8} height={8} />
          <rect x={272} y={56} width={8} height={8} />
          <rect x={16} y={64} width={8} height={8} />
          <rect x={24} y={64} width={8} height={8} />
          <rect x={32} y={64} width={8} height={8} />
          <rect x={40} y={64} width={8} height={8} />
          <rect x={48} y={64} width={8} height={8} />
          <rect x={56} y={64} width={8} height={8} />
          <rect x={64} y={64} width={8} height={8} />
          <rect x={80} y={64} width={8} height={8} />
          <rect x={96} y={64} width={8} height={8} />
          <rect x={112} y={64} width={8} height={8} />
          <rect x={128} y={64} width={8} height={8} />
          <rect x={144} y={64} width={8} height={8} />
          <rect x={160} y={64} width={8} height={8} />
          <rect x={176} y={64} width={8} height={8} />
          <rect x={192} y={64} width={8} height={8} />
          <rect x={208} y={64} width={8} height={8} />
          <rect x={224} y={64} width={8} height={8} />
          <rect x={232} y={64} width={8} height={8} />
          <rect x={240} y={64} width={8} height={8} />
          <rect x={248} y={64} width={8} height={8} />
          <rect x={256} y={64} width={8} height={8} />
          <rect x={264} y={64} width={8} height={8} />
          <rect x={272} y={64} width={8} height={8} />
          <rect x={80} y={72} width={8} height={8} />
          <rect x={88} y={72} width={8} height={8} />
          <rect x={96} y={72} width={8} height={8} />
          <rect x={104} y={72} width={8} height={8} />
          <rect x={136} y={72} width={8} height={8} />
          <rect x={160} y={72} width={8} height={8} />
          <rect x={168} y={72} width={8} height={8} />
          <rect x={176} y={72} width={8} height={8} />
          <rect x={184} y={72} width={8} height={8} />
          <rect x={192} y={72} width={8} height={8} />
          <rect x={16} y={80} width={8} height={8} />
          <rect x={32} y={80} width={8} height={8} />
          <rect x={40} y={80} width={8} height={8} />
          <rect x={48} y={80} width={8} height={8} />
          <rect x={56} y={80} width={8} height={8} />
          <rect x={64} y={80} width={8} height={8} />
          <rect x={96} y={80} width={8} height={8} />
          <rect x={104} y={80} width={8} height={8} />
          <rect x={120} y={80} width={8} height={8} />
          <rect x={128} y={80} width={8} height={8} />
          <rect x={136} y={80} width={8} height={8} />
          <rect x={152} y={80} width={8} height={8} />
          <rect x={160} y={80} width={8} height={8} />
          <rect x={176} y={80} width={8} height={8} />
          <rect x={200} y={80} width={8} height={8} />
          <rect x={208} y={80} width={8} height={8} />
          <rect x={224} y={80} width={8} height={8} />
          <rect x={232} y={80} width={8} height={8} />
          <rect x={240} y={80} width={8} height={8} />
          <rect x={248} y={80} width={8} height={8} />
          <rect x={256} y={80} width={8} height={8} />
          <rect x={24} y={88} width={8} height={8} />
          <rect x={32} y={88} width={8} height={8} />
          <rect x={40} y={88} width={8} height={8} />
          <rect x={72} y={88} width={8} height={8} />
          <rect x={88} y={88} width={8} height={8} />
          <rect x={112} y={88} width={8} height={8} />
          <rect x={128} y={88} width={8} height={8} />
          <rect x={144} y={88} width={8} height={8} />
          <rect x={152} y={88} width={8} height={8} />
          <rect x={168} y={88} width={8} height={8} />
          <rect x={184} y={88} width={8} height={8} />
          <rect x={192} y={88} width={8} height={8} />
          <rect x={200} y={88} width={8} height={8} />
          <rect x={224} y={88} width={8} height={8} />
          <rect x={232} y={88} width={8} height={8} />
          <rect x={248} y={88} width={8} height={8} />
          <rect x={256} y={88} width={8} height={8} />
          <rect x={272} y={88} width={8} height={8} />
          <rect x={24} y={96} width={8} height={8} />
          <rect x={40} y={96} width={8} height={8} />
          <rect x={64} y={96} width={8} height={8} />
          <rect x={80} y={96} width={8} height={8} />
          <rect x={88} y={96} width={8} height={8} />
          <rect x={96} y={96} width={8} height={8} />
          <rect x={104} y={96} width={8} height={8} />
          <rect x={112} y={96} width={8} height={8} />
          <rect x={136} y={96} width={8} height={8} />
          <rect x={152} y={96} width={8} height={8} />
          <rect x={176} y={96} width={8} height={8} />
          <rect x={184} y={96} width={8} height={8} />
          <rect x={192} y={96} width={8} height={8} />
          <rect x={216} y={96} width={8} height={8} />
          <rect x={224} y={96} width={8} height={8} />
          <rect x={240} y={96} width={8} height={8} />
          <rect x={256} y={96} width={8} height={8} />
          <rect x={264} y={96} width={8} height={8} />
          <rect x={80} y={104} width={8} height={8} />
          <rect x={88} y={104} width={8} height={8} />
          <rect x={112} y={104} width={8} height={8} />
          <rect x={128} y={104} width={8} height={8} />
          <rect x={136} y={104} width={8} height={8} />
          <rect x={144} y={104} width={8} height={8} />
          <rect x={168} y={104} width={8} height={8} />
          <rect x={176} y={104} width={8} height={8} />
          <rect x={184} y={104} width={8} height={8} />
          <rect x={192} y={104} width={8} height={8} />
          <rect x={240} y={104} width={8} height={8} />
          <rect x={248} y={104} width={8} height={8} />
          <rect x={256} y={104} width={8} height={8} />
          <rect x={16} y={112} width={8} height={8} />
          <rect x={48} y={112} width={8} height={8} />
          <rect x={64} y={112} width={8} height={8} />
          <rect x={72} y={112} width={8} height={8} />
          <rect x={88} y={112} width={8} height={8} />
          <rect x={96} y={112} width={8} height={8} />
          <rect x={104} y={112} width={8} height={8} />
          <rect x={112} y={112} width={8} height={8} />
          <rect x={136} y={112} width={8} height={8} />
          <rect x={152} y={112} width={8} height={8} />
          <rect x={192} y={112} width={8} height={8} />
          <rect x={200} y={112} width={8} height={8} />
          <rect x={208} y={112} width={8} height={8} />
          <rect x={232} y={112} width={8} height={8} />
          <rect x={240} y={112} width={8} height={8} />
          <rect x={248} y={112} width={8} height={8} />
          <rect x={272} y={112} width={8} height={8} />
          <rect x={24} y={120} width={8} height={8} />
          <rect x={48} y={120} width={8} height={8} />
          <rect x={56} y={120} width={8} height={8} />
          <rect x={88} y={120} width={8} height={8} />
          <rect x={96} y={120} width={8} height={8} />
          <rect x={120} y={120} width={8} height={8} />
          <rect x={128} y={120} width={8} height={8} />
          <rect x={136} y={120} width={8} height={8} />
          <rect x={144} y={120} width={8} height={8} />
          <rect x={176} y={120} width={8} height={8} />
          <rect x={200} y={120} width={8} height={8} />
          <rect x={224} y={120} width={8} height={8} />
          <rect x={264} y={120} width={8} height={8} />
          <rect x={272} y={120} width={8} height={8} />
          <rect x={24} y={128} width={8} height={8} />
          <rect x={40} y={128} width={8} height={8} />
          <rect x={48} y={128} width={8} height={8} />
          <rect x={56} y={128} width={8} height={8} />
          <rect x={64} y={128} width={8} height={8} />
          <rect x={72} y={128} width={8} height={8} />
          <rect x={88} y={128} width={8} height={8} />
          <rect x={96} y={128} width={8} height={8} />
          <rect x={112} y={128} width={8} height={8} />
          <rect x={120} y={128} width={8} height={8} />
          <rect x={128} y={128} width={8} height={8} />
          <rect x={184} y={128} width={8} height={8} />
          <rect x={216} y={128} width={8} height={8} />
          <rect x={224} y={128} width={8} height={8} />
          <rect x={248} y={128} width={8} height={8} />
          <rect x={256} y={128} width={8} height={8} />
          <rect x={264} y={128} width={8} height={8} />
          <rect x={16} y={136} width={8} height={8} />
          <rect x={56} y={136} width={8} height={8} />
          <rect x={80} y={136} width={8} height={8} />
          <rect x={88} y={136} width={8} height={8} />
          <rect x={96} y={136} width={8} height={8} />
          <rect x={128} y={136} width={8} height={8} />
          <rect x={144} y={136} width={8} height={8} />
          <rect x={160} y={136} width={8} height={8} />
          <rect x={184} y={136} width={8} height={8} />
          <rect x={192} y={136} width={8} height={8} />
          <rect x={208} y={136} width={8} height={8} />
          <rect x={216} y={136} width={8} height={8} />
          <rect x={224} y={136} width={8} height={8} />
          <rect x={232} y={136} width={8} height={8} />
          <rect x={256} y={136} width={8} height={8} />
          <rect x={48} y={144} width={8} height={8} />
          <rect x={64} y={144} width={8} height={8} />
          <rect x={80} y={144} width={8} height={8} />
          <rect x={88} y={144} width={8} height={8} />
          <rect x={112} y={144} width={8} height={8} />
          <rect x={128} y={144} width={8} height={8} />
          <rect x={144} y={144} width={8} height={8} />
          <rect x={152} y={144} width={8} height={8} />
          <rect x={160} y={144} width={8} height={8} />
          <rect x={176} y={144} width={8} height={8} />
          <rect x={208} y={144} width={8} height={8} />
          <rect x={216} y={144} width={8} height={8} />
          <rect x={232} y={144} width={8} height={8} />
          <rect x={240} y={144} width={8} height={8} />
          <rect x={272} y={144} width={8} height={8} />
          <rect x={16} y={152} width={8} height={8} />
          <rect x={40} y={152} width={8} height={8} />
          <rect x={72} y={152} width={8} height={8} />
          <rect x={88} y={152} width={8} height={8} />
          <rect x={104} y={152} width={8} height={8} />
          <rect x={128} y={152} width={8} height={8} />
          <rect x={144} y={152} width={8} height={8} />
          <rect x={168} y={152} width={8} height={8} />
          <rect x={184} y={152} width={8} height={8} />
          <rect x={192} y={152} width={8} height={8} />
          <rect x={200} y={152} width={8} height={8} />
          <rect x={216} y={152} width={8} height={8} />
          <rect x={224} y={152} width={8} height={8} />
          <rect x={232} y={152} width={8} height={8} />
          <rect x={248} y={152} width={8} height={8} />
          <rect x={256} y={152} width={8} height={8} />
          <rect x={16} y={160} width={8} height={8} />
          <rect x={24} y={160} width={8} height={8} />
          <rect x={40} y={160} width={8} height={8} />
          <rect x={48} y={160} width={8} height={8} />
          <rect x={64} y={160} width={8} height={8} />
          <rect x={88} y={160} width={8} height={8} />
          <rect x={96} y={160} width={8} height={8} />
          <rect x={104} y={160} width={8} height={8} />
          <rect x={112} y={160} width={8} height={8} />
          <rect x={120} y={160} width={8} height={8} />
          <rect x={136} y={160} width={8} height={8} />
          <rect x={144} y={160} width={8} height={8} />
          <rect x={184} y={160} width={8} height={8} />
          <rect x={192} y={160} width={8} height={8} />
          <rect x={208} y={160} width={8} height={8} />
          <rect x={216} y={160} width={8} height={8} />
          <rect x={232} y={160} width={8} height={8} />
          <rect x={240} y={160} width={8} height={8} />
          <rect x={256} y={160} width={8} height={8} />
          <rect x={264} y={160} width={8} height={8} />
          <rect x={16} y={168} width={8} height={8} />
          <rect x={32} y={168} width={8} height={8} />
          <rect x={56} y={168} width={8} height={8} />
          <rect x={80} y={168} width={8} height={8} />
          <rect x={88} y={168} width={8} height={8} />
          <rect x={128} y={168} width={8} height={8} />
          <rect x={144} y={168} width={8} height={8} />
          <rect x={184} y={168} width={8} height={8} />
          <rect x={192} y={168} width={8} height={8} />
          <rect x={200} y={168} width={8} height={8} />
          <rect x={216} y={168} width={8} height={8} />
          <rect x={232} y={168} width={8} height={8} />
          <rect x={240} y={168} width={8} height={8} />
          <rect x={248} y={168} width={8} height={8} />
          <rect x={256} y={168} width={8} height={8} />
          <rect x={264} y={168} width={8} height={8} />
          <rect x={16} y={176} width={8} height={8} />
          <rect x={24} y={176} width={8} height={8} />
          <rect x={32} y={176} width={8} height={8} />
          <rect x={40} y={176} width={8} height={8} />
          <rect x={56} y={176} width={8} height={8} />
          <rect x={64} y={176} width={8} height={8} />
          <rect x={104} y={176} width={8} height={8} />
          <rect x={120} y={176} width={8} height={8} />
          <rect x={144} y={176} width={8} height={8} />
          <rect x={152} y={176} width={8} height={8} />
          <rect x={176} y={176} width={8} height={8} />
          <rect x={192} y={176} width={8} height={8} />
          <rect x={200} y={176} width={8} height={8} />
          <rect x={208} y={176} width={8} height={8} />
          <rect x={232} y={176} width={8} height={8} />
          <rect x={248} y={176} width={8} height={8} />
          <rect x={264} y={176} width={8} height={8} />
          <rect x={272} y={176} width={8} height={8} />
          <rect x={16} y={184} width={8} height={8} />
          <rect x={40} y={184} width={8} height={8} />
          <rect x={48} y={184} width={8} height={8} />
          <rect x={96} y={184} width={8} height={8} />
          <rect x={112} y={184} width={8} height={8} />
          <rect x={128} y={184} width={8} height={8} />
          <rect x={136} y={184} width={8} height={8} />
          <rect x={168} y={184} width={8} height={8} />
          <rect x={184} y={184} width={8} height={8} />
          <rect x={216} y={184} width={8} height={8} />
          <rect x={224} y={184} width={8} height={8} />
          <rect x={248} y={184} width={8} height={8} />
          <rect x={256} y={184} width={8} height={8} />
          <rect x={272} y={184} width={8} height={8} />
          <rect x={16} y={192} width={8} height={8} />
          <rect x={32} y={192} width={8} height={8} />
          <rect x={40} y={192} width={8} height={8} />
          <rect x={48} y={192} width={8} height={8} />
          <rect x={56} y={192} width={8} height={8} />
          <rect x={64} y={192} width={8} height={8} />
          <rect x={72} y={192} width={8} height={8} />
          <rect x={96} y={192} width={8} height={8} />
          <rect x={104} y={192} width={8} height={8} />
          <rect x={112} y={192} width={8} height={8} />
          <rect x={120} y={192} width={8} height={8} />
          <rect x={136} y={192} width={8} height={8} />
          <rect x={144} y={192} width={8} height={8} />
          <rect x={152} y={192} width={8} height={8} />
          <rect x={160} y={192} width={8} height={8} />
          <rect x={192} y={192} width={8} height={8} />
          <rect x={208} y={192} width={8} height={8} />
          <rect x={216} y={192} width={8} height={8} />
          <rect x={232} y={192} width={8} height={8} />
          <rect x={248} y={192} width={8} height={8} />
          <rect x={256} y={192} width={8} height={8} />
          <rect x={264} y={192} width={8} height={8} />
          <rect x={16} y={200} width={8} height={8} />
          <rect x={32} y={200} width={8} height={8} />
          <rect x={48} y={200} width={8} height={8} />
          <rect x={80} y={200} width={8} height={8} />
          <rect x={96} y={200} width={8} height={8} />
          <rect x={104} y={200} width={8} height={8} />
          <rect x={112} y={200} width={8} height={8} />
          <rect x={120} y={200} width={8} height={8} />
          <rect x={136} y={200} width={8} height={8} />
          <rect x={160} y={200} width={8} height={8} />
          <rect x={168} y={200} width={8} height={8} />
          <rect x={184} y={200} width={8} height={8} />
          <rect x={192} y={200} width={8} height={8} />
          <rect x={208} y={200} width={8} height={8} />
          <rect x={216} y={200} width={8} height={8} />
          <rect x={224} y={200} width={8} height={8} />
          <rect x={232} y={200} width={8} height={8} />
          <rect x={256} y={200} width={8} height={8} />
          <rect x={16} y={208} width={8} height={8} />
          <rect x={48} y={208} width={8} height={8} />
          <rect x={64} y={208} width={8} height={8} />
          <rect x={72} y={208} width={8} height={8} />
          <rect x={80} y={208} width={8} height={8} />
          <rect x={128} y={208} width={8} height={8} />
          <rect x={136} y={208} width={8} height={8} />
          <rect x={144} y={208} width={8} height={8} />
          <rect x={152} y={208} width={8} height={8} />
          <rect x={160} y={208} width={8} height={8} />
          <rect x={176} y={208} width={8} height={8} />
          <rect x={208} y={208} width={8} height={8} />
          <rect x={216} y={208} width={8} height={8} />
          <rect x={224} y={208} width={8} height={8} />
          <rect x={232} y={208} width={8} height={8} />
          <rect x={240} y={208} width={8} height={8} />
          <rect x={248} y={208} width={8} height={8} />
          <rect x={272} y={208} width={8} height={8} />
          <rect x={80} y={216} width={8} height={8} />
          <rect x={96} y={216} width={8} height={8} />
          <rect x={104} y={216} width={8} height={8} />
          <rect x={120} y={216} width={8} height={8} />
          <rect x={168} y={216} width={8} height={8} />
          <rect x={192} y={216} width={8} height={8} />
          <rect x={208} y={216} width={8} height={8} />
          <rect x={240} y={216} width={8} height={8} />
          <rect x={256} y={216} width={8} height={8} />
          <rect x={264} y={216} width={8} height={8} />
          <rect x={272} y={216} width={8} height={8} />
          <rect x={16} y={224} width={8} height={8} />
          <rect x={24} y={224} width={8} height={8} />
          <rect x={32} y={224} width={8} height={8} />
          <rect x={40} y={224} width={8} height={8} />
          <rect x={48} y={224} width={8} height={8} />
          <rect x={56} y={224} width={8} height={8} />
          <rect x={64} y={224} width={8} height={8} />
          <rect x={96} y={224} width={8} height={8} />
          <rect x={104} y={224} width={8} height={8} />
          <rect x={120} y={224} width={8} height={8} />
          <rect x={136} y={224} width={8} height={8} />
          <rect x={160} y={224} width={8} height={8} />
          <rect x={176} y={224} width={8} height={8} />
          <rect x={184} y={224} width={8} height={8} />
          <rect x={192} y={224} width={8} height={8} />
          <rect x={200} y={224} width={8} height={8} />
          <rect x={208} y={224} width={8} height={8} />
          <rect x={224} y={224} width={8} height={8} />
          <rect x={240} y={224} width={8} height={8} />
          <rect x={256} y={224} width={8} height={8} />
          <rect x={16} y={232} width={8} height={8} />
          <rect x={64} y={232} width={8} height={8} />
          <rect x={80} y={232} width={8} height={8} />
          <rect x={104} y={232} width={8} height={8} />
          <rect x={112} y={232} width={8} height={8} />
          <rect x={128} y={232} width={8} height={8} />
          <rect x={160} y={232} width={8} height={8} />
          <rect x={176} y={232} width={8} height={8} />
          <rect x={184} y={232} width={8} height={8} />
          <rect x={192} y={232} width={8} height={8} />
          <rect x={208} y={232} width={8} height={8} />
          <rect x={240} y={232} width={8} height={8} />
          <rect x={248} y={232} width={8} height={8} />
          <rect x={256} y={232} width={8} height={8} />
          <rect x={16} y={240} width={8} height={8} />
          <rect x={32} y={240} width={8} height={8} />
          <rect x={40} y={240} width={8} height={8} />
          <rect x={48} y={240} width={8} height={8} />
          <rect x={64} y={240} width={8} height={8} />
          <rect x={80} y={240} width={8} height={8} />
          <rect x={88} y={240} width={8} height={8} />
          <rect x={104} y={240} width={8} height={8} />
          <rect x={112} y={240} width={8} height={8} />
          <rect x={120} y={240} width={8} height={8} />
          <rect x={128} y={240} width={8} height={8} />
          <rect x={136} y={240} width={8} height={8} />
          <rect x={160} y={240} width={8} height={8} />
          <rect x={176} y={240} width={8} height={8} />
          <rect x={208} y={240} width={8} height={8} />
          <rect x={216} y={240} width={8} height={8} />
          <rect x={224} y={240} width={8} height={8} />
          <rect x={232} y={240} width={8} height={8} />
          <rect x={240} y={240} width={8} height={8} />
          <rect x={248} y={240} width={8} height={8} />
          <rect x={264} y={240} width={8} height={8} />
          <rect x={16} y={248} width={8} height={8} />
          <rect x={32} y={248} width={8} height={8} />
          <rect x={40} y={248} width={8} height={8} />
          <rect x={48} y={248} width={8} height={8} />
          <rect x={64} y={248} width={8} height={8} />
          <rect x={80} y={248} width={8} height={8} />
          <rect x={88} y={248} width={8} height={8} />
          <rect x={112} y={248} width={8} height={8} />
          <rect x={120} y={248} width={8} height={8} />
          <rect x={128} y={248} width={8} height={8} />
          <rect x={136} y={248} width={8} height={8} />
          <rect x={144} y={248} width={8} height={8} />
          <rect x={160} y={248} width={8} height={8} />
          <rect x={168} y={248} width={8} height={8} />
          <rect x={184} y={248} width={8} height={8} />
          <rect x={200} y={248} width={8} height={8} />
          <rect x={208} y={248} width={8} height={8} />
          <rect x={216} y={248} width={8} height={8} />
          <rect x={240} y={248} width={8} height={8} />
          <rect x={256} y={248} width={8} height={8} />
          <rect x={264} y={248} width={8} height={8} />
          <rect x={272} y={248} width={8} height={8} />
          <rect x={16} y={256} width={8} height={8} />
          <rect x={32} y={256} width={8} height={8} />
          <rect x={40} y={256} width={8} height={8} />
          <rect x={48} y={256} width={8} height={8} />
          <rect x={64} y={256} width={8} height={8} />
          <rect x={80} y={256} width={8} height={8} />
          <rect x={96} y={256} width={8} height={8} />
          <rect x={104} y={256} width={8} height={8} />
          <rect x={112} y={256} width={8} height={8} />
          <rect x={120} y={256} width={8} height={8} />
          <rect x={128} y={256} width={8} height={8} />
          <rect x={176} y={256} width={8} height={8} />
          <rect x={184} y={256} width={8} height={8} />
          <rect x={208} y={256} width={8} height={8} />
          <rect x={224} y={256} width={8} height={8} />
          <rect x={232} y={256} width={8} height={8} />
          <rect x={16} y={264} width={8} height={8} />
          <rect x={64} y={264} width={8} height={8} />
          <rect x={88} y={264} width={8} height={8} />
          <rect x={96} y={264} width={8} height={8} />
          <rect x={112} y={264} width={8} height={8} />
          <rect x={144} y={264} width={8} height={8} />
          <rect x={160} y={264} width={8} height={8} />
          <rect x={176} y={264} width={8} height={8} />
          <rect x={184} y={264} width={8} height={8} />
          <rect x={192} y={264} width={8} height={8} />
          <rect x={200} y={264} width={8} height={8} />
          <rect x={240} y={264} width={8} height={8} />
          <rect x={256} y={264} width={8} height={8} />
          <rect x={16} y={272} width={8} height={8} />
          <rect x={24} y={272} width={8} height={8} />
          <rect x={32} y={272} width={8} height={8} />
          <rect x={40} y={272} width={8} height={8} />
          <rect x={48} y={272} width={8} height={8} />
          <rect x={56} y={272} width={8} height={8} />
          <rect x={64} y={272} width={8} height={8} />
          <rect x={80} y={272} width={8} height={8} />
          <rect x={104} y={272} width={8} height={8} />
          <rect x={120} y={272} width={8} height={8} />
          <rect x={128} y={272} width={8} height={8} />
          <rect x={144} y={272} width={8} height={8} />
          <rect x={152} y={272} width={8} height={8} />
          <rect x={160} y={272} width={8} height={8} />
          <rect x={176} y={272} width={8} height={8} />
          <rect x={208} y={272} width={8} height={8} />
          <rect x={224} y={272} width={8} height={8} />
          <rect x={232} y={272} width={8} height={8} />
          <rect x={248} y={272} width={8} height={8} />
          <rect x={264} y={272} width={8} height={8} />
        </g>
      </svg>
      <div className="qr-logo"><svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 0 1 12 4zm-3 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.2.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3-.3-.2-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.2-1.2-.4-2.2-1.3-.8-.7-1.3-1.6-1.5-1.9-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.4z" />
        </svg></div>
    </div>
    <ol className="qr-steps">
      <li>Open WhatsApp on your phone</li>
      <li>Tap Menu, then Linked devices</li>
      <li>Point your phone at this screen to scan</li>
    </ol>
    <a className="qr-open" href="https://wa.me/917559822081?text=Hello" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z" />
      </svg> Open in WhatsApp</a>
  </div>
  <div className="drawer-ov" id="drawer-ov" onclick="closeDrawer()" />
  <aside className="drawer" id="drawer" />
  <div id="toast-wrap" />
  {/* ===== WHATSAPP FLOATING BUTTON ===== */}
</div>

    </>
  );
}