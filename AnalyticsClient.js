'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AnalyticsClient({ user }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setAnalytics);
  }, []);

  const scoreColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  const statusColors = { New: '#3b82f6', Contacted: '#8b5cf6', 'In Progress': '#f59e0b', Closed: '#10b981', Lost: '#ef4444' };

  if (!analytics) return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" user={user} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--muted)' }}>Loading analytics...</div>
      </main>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="admin" user={user} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '36px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Analytics</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '32px' }}>Full system overview</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Leads', value: analytics.totalLeads, color: '#3b82f6', icon: '📋' },
            { label: 'High Priority', value: analytics.scoreCounts?.find(s=>s._id==='High')?.count || 0, color: '#ef4444', icon: '🔥' },
            { label: 'Overdue Follow-ups', value: analytics.overdueFollowUps || 0, color: '#f59e0b', icon: '⚠️' },
            { label: 'Agents Active', value: analytics.agentPerformance?.length || 0, color: '#8b5cf6', icon: '👥' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: c.color }} />
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{c.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Syne', color: c.color, lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          {[
            { title: 'Status Distribution', data: analytics.statusCounts, colors: statusColors },
            { title: 'Priority Distribution', data: analytics.scoreCounts, colors: scoreColors },
          ].map(({ title, data, colors }) => (
            <div key={title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: '16px', marginBottom: '24px' }}>{title}</h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '120px', marginBottom: '16px' }}>
                {data?.map(s => {
                  const max = Math.max(...(data?.map(x => x.count) || [1]));
                  const pct = (s.count / max) * 100;
                  return (
                    <div key={s._id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: colors[s._id] || '#6b7280' }}>{s.count}</div>
                      <div style={{ width: '100%', background: `${colors[s._id] || '#6b7280'}`, borderRadius: '6px 6px 0 0', height: `${pct}%`, minHeight: '8px', transition: 'height 0.5s' }} />
                      <div style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.2 }}>{s._id}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {analytics.agentPerformance?.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: '16px', marginBottom: '24px' }}>Agent Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {analytics.agentPerformance.map((a, i) => (
                <div key={i} style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '20px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '14px', fontFamily: 'Syne' }}>{a.agentName?.[0]}</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{a.agentName}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ background: 'rgba(59,130,246,0.1)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Syne', color: '#3b82f6' }}>{a.total}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Assigned</div>
                    </div>
                    <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Syne', color: '#10b981' }}>{a.closed}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Closed</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--muted)' }}>Conversion</span>
                      <span style={{ color: '#10b981', fontWeight: '700' }}>{a.total > 0 ? ((a.closed/a.total)*100).toFixed(0) : 0}%</span>
                    </div>
                    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', background: '#10b981', borderRadius: '3px', width: `${a.total > 0 ? (a.closed/a.total)*100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}