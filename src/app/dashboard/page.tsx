"use client";

import { useEffect, useState } from "react";

// grabbing real data from our apis finally
export default function DashboardPage() {
  const [stats, setStats] = useState({ leads: 0, properties: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch leads and properties in parallel
    Promise.all([
      fetch("/api/leads").then(res => res.json()),
      fetch("/api/properties").then(res => res.json())
    ]).then(([leadsData, propsData]) => {
      setStats({
        leads: leadsData.count || 0,
        properties: propsData.count || 0
      });
      setLoading(false);
    }).catch(err => {
      console.error("failed to load stats", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading real data...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* leads metric card */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#666', margin: 0 }}>Total Leads</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{stats.leads}</p>
        </div>

        {/* properties metric card */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#666', margin: 0 }}>Properties</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{stats.properties}</p>
        </div>
      </div>
      
      {/* we will drop in the leads table here next */}
      <div style={{ marginTop: '40px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3>Recent Leads</h3>
        <p style={{ color: '#888' }}>Table coming up next...</p>
      </div>
    </div>
  );
}
