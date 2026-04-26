import Link from 'next/link';

const scoreColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const statusColors = { New: '#3b82f6', Contacted: '#8b5cf6', 'In Progress': '#f59e0b', Closed: '#10b981', Lost: '#ef4444' };

export default function LeadCard({ lead, onDelete, isAdmin }) {
  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date() && lead.status !== 'Closed';

  return (
    <div style={{ background: 'var(--surface)', border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`, borderRadius: '14px', padding: '20px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
      {isOverdue && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--red)' }} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontFamily: 'Syne', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{lead.name}</h3>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{lead.propertyInterest}</div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: `${scoreColors[lead.score]}22`, color: scoreColors[lead.score], border: `1px solid ${scoreColors[lead.score]}44` }}>
            {lead.score}
          </span>
          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: `${statusColors[lead.status] || '#6b7280'}22`, color: statusColors[lead.status] || '#6b7280' }}>
            {lead.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>💰 PKR {(lead.budget/1000000).toFixed(1)}M</div>
        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>📡 {lead.source}</div>
        {lead.phone && <div style={{ fontSize: '13px', color: 'var(--muted)' }}>📞 {lead.phone}</div>}
        {lead.assignedTo && <div style={{ fontSize: '13px', color: 'var(--muted)' }}>👤 {lead.assignedTo.name}</div>}
      </div>

      {isOverdue && <div style={{ fontSize: '12px', color: 'var(--red)', marginBottom: '12px', fontWeight: '600' }}>⚠️ Follow-up overdue!</div>}

      <div style={{ display: 'flex', gap: '8px' }}>
        <Link href={`/leads/${lead._id}`} style={{ flex: 1, padding: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: 'var(--accent2)', fontSize: '13px', fontWeight: '600', textAlign: 'center', textDecoration: 'none' }}>
          View Details
        </Link>
        {lead.phone && (
          <a href={`https://wa.me/92${lead.phone.replace(/^0/, '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
            style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#10b981', fontSize: '13px', textDecoration: 'none' }}>
            💬
          </a>
        )}
        {isAdmin && onDelete && (
          <button onClick={() => onDelete(lead._id)}
            style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}