'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function AdminDashboardClient({ user }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [lastPoll, setLastPoll] = useState(new Date().toISOString());

  const fetchData = async () => {
    const [aRes, lRes] = await Promise.all([fetch('/api/analytics'), fetch('/api/leads')]);
    const aData = await aRes.json();
    const lData = await lRes.json();
    setAnalytics(aData);
    setRecentLeads(lData.leads?.slice(0, 6) || []);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(async () => {
      const res = await fetch(`/api/leads/poll?since=${lastPoll}`);
      const data = await res.json();
      if (data.leads?.length > 0) { fetchData(); setLastPoll(data.timestamp); }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const scoreColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  const statusColors = { New: '#3b82f6', Contacted: '#8b5cf6', 'In Progress': '#f59e0b', Closed: '#10b981', Lost: '#ef4444' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" user={user} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '36px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '6px' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Welcome back, {user.name} · Live updates every 10s</p>
        </div>

        {analytics && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Leads', value: analytics.totalLeads, icon: '📋', color: '#3b82f6' },
                { label: 'High Priority', value: analytics.scoreCounts?.find(s=>s._id==='High')?.count || 0, icon: '🔥', color: '#ef4444' },
                { label: 'Overdue Follow-ups', value: analytics.overdueFollowUps || 0, icon: '⚠️', color: '#f59e0b' },
                { label: 'Closed Deals', value: analytics.statusCounts?.find(s=>s._id==='Closed')?.count || 0, icon: '✅', color: '#10b981' },
              ].map((card, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: card.color }} />
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{card.icon}</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Syne', color: card.color, marginBottom: '4px' }}>{card.value}</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ fontFamily: 'Syne', marginBottom: '20px', fontSize: '16px' }}>Lead by Status</h3>
                {analytics.statusCounts?.map(s => (
                  <div key={s._id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                      <span style={{ color: statusColors[s._id] || '#6b7280' }}>{s._id}</span>
                      <span style={{ color: 'var(--muted)' }}>{s.count}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', borderRadius: '3px', background: statusColors[s._id] || '#6b7280', width: `${(s.count / analytics.totalLeads) * 100}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ fontFamily: 'Syne', marginBottom: '20px', fontSize: '16px' }}>Lead by Priority</h3>
                {analytics.scoreCounts?.map(s => (
                  <div key={s._id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                      <span style={{ color: scoreColors[s._id] }}>{s._id}</span>
                      <span style={{ color: 'var(--muted)' }}>{s.count}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', borderRadius: '3px', background: scoreColors[s._id], width: `${(s.count / analytics.totalLeads) * 100}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {analytics.agentPerformance?.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ fontFamily: 'Syne', marginBottom: '20px', fontSize: '16px' }}>Agent Performance</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Agent', 'Assigned Leads', 'Closed Deals', 'Conversion Rate'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--muted)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.agentPerformance.map((a, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--accent2)' }}>{a.agentName?.[0]}</div>{a.agentName}</div></td>
                          <td style={{ padding: '12px', color: 'var(--muted)' }}>{a.total}</td>
                          <td style={{ padding: '12px', color: 'var(--green)' }}>{a.closed}</td>
                          <td style={{ padding: '12px' }}><span style={{ color: a.total > 0 ? '#10b981' : 'var(--muted)' }}>{a.total > 0 ? ((a.closed / a.total) * 100).toFixed(0) : 0}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '20px' }}>Recent Leads</h2>
          <Link href="/dashboard/admin/leads" style={{ fontSize: '13px', color: 'var(--accent2)', textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {recentLeads.map(lead => {
            const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date() && lead.status !== 'Closed';
            const scoreC = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
            return (
              <div key={lead._id} style={{ background: 'var(--surface)', border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`, borderRadius: '12px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{lead.name}</div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: scoreC[lead.score], background: `${scoreC[lead.score]}22`, padding: '2px 8px', borderRadius: '20px' }}>{lead.score}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>{lead.propertyInterest}</div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>PKR {(lead.budget/1000000).toFixed(1)}M · {lead.status}</div>
                <Link href={`/leads/${lead._id}`} style={{ fontSize: '13px', color: 'var(--accent2)', textDecoration: 'none' }}>View →</Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}