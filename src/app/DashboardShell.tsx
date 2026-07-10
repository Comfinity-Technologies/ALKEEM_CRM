"use client";

import { useEffect, useRef } from "react";

interface Props {
  isSuperAdmin: boolean;
  userName: string;
  rawHtml: string;
}

export default function DashboardShell({ isSuperAdmin, userName, rawHtml }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !rawHtml) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(rawHtml);
    doc.close();

    iframe.onload = () => {
      const win = iframe.contentWindow as any;

      // Fetch live Property Finder data and inject into the dashboard
      fetch("/api/properties")
        .then((r) => r.json())
        .then((data) => {
          if (!win || !data.properties?.length) return;

          // Convert API response to the format the HTML's renderProps() expects:
          // [title, location, price, status, statusLabel, size, beds, baths, imgIndex, matchedLeads, link]
          const liveProps = data.properties.map((p: any, i: number) => [
            p.title,
            p.location,
            p.price,
            p.status,
            p.status_label,
            p.size || "—",
            p.bedrooms || 0,
            p.bathrooms || 0,
            i % 9,
            p.matched_leads || 0,
            p.link || "",
          ]);

          // Override the props array and re-render
          if (win.props !== undefined) {
            win.props = liveProps;
          }

          // Patch renderProps to support the link field (index 10)
          if (typeof win.renderProps === "function") {
            const origRenderProps = win.renderProps;
            win.renderProps = function (f: string) {
              const filter = f || "all";
              const list = liveProps.filter((p: any) => filter === "all" || p[3] === filter);
              const grid = win.document.getElementById("prop-grid");
              if (!grid) return;

              const artFn = win.art || function () { return "background:#1a3a5c"; };
              const skyFn = win.sky || function () { return ""; };

              grid.innerHTML = list
                .map((p: any) => {
                  const matchHtml =
                    p[9] > 0
                      ? `<span class="match"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/></svg>${p[9]} matched leads</span>`
                      : `<span style="font-size:.7rem;color:var(--muted-2);font-weight:600">No active matches</span>`;
                  const bedLabel = p[6] > 0 ? `${p[6]} Bed` : "Studio";
                  const clickAction = p[10]
                    ? `window.open('${p[10]}','_blank')`
                    : `toast('${p[0].replace(/'/g, "")}','check')`;
                  const viewBtnAction = p[10]
                    ? `window.open('${p[10]}','_blank')`
                    : `toast('Details opened','check')`;

                  return `<div class="card pcard" onclick="${clickAction}">
                    <div class="ph" style="${artFn(p[8])}">${skyFn()}
                      <span class="st-badge ${p[3]}">${p[4]}</span>
                      <span class="price">${p[2]}</span>
                    </div>
                    <div class="info">
                      <div class="ttl">${p[0]}</div>
                      <div class="area"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${p[1]}</div>
                      <div class="specs">
                        <div class="spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3M2 11h20v7M4 18v2M20 18v2"/></svg>${bedLabel}</div>
                        <div class="spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/></svg>${p[7]} Bath</div>
                        <div class="spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM9 3v18M3 9h18"/></svg>${p[5]}</div>
                      </div>
                      <div class="foot">${matchHtml}<button class="mini-btn" onclick="event.stopPropagation();${viewBtnAction}">View on PF</button></div>
                    </div>
                  </div>`;
                })
                .join("");
            };

            // Re-wire filter buttons
            const buttons = win.document.querySelectorAll("#prop-filter button");
            buttons.forEach((btn: any) => {
              btn.addEventListener("click", () => {
                buttons.forEach((b: any) => b.classList.remove("on"));
                btn.classList.add("on");
                win.renderProps(btn.getAttribute("data-f"));
              });
            });

            win.renderProps("all");
          }

          // Update the agent info in the sidebar to reflect the logged-in user
          const meNm = win.document.getElementById("me-nm");
          const meRl = win.document.getElementById("me-rl");
          const meAv = win.document.getElementById("me-av");
          if (meNm) meNm.textContent = userName;
          if (meRl) meRl.textContent = isSuperAdmin ? "Super Admin" : "Admin";
          if (meAv) {
            meAv.textContent = userName.slice(0, 2).toUpperCase();
            meAv.style.background = isSuperAdmin
              ? "linear-gradient(135deg,#EBBA63,#E0A33B)"
              : "linear-gradient(135deg,#3FB6A8,#268a7e)";
          }
        })
        .catch(console.error);
    };
  }, [rawHtml, isSuperAdmin, userName]);

  if (!rawHtml) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: "#6B7690",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span style={{ fontWeight: 600 }}>pms_updated.html not found in project root</span>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title="Al Alkeem Dashboard"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
    />
  );
}
