'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const adminNav = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/admin/leads', label: 'All Leads', icon: '📋' },
  { href: '/dashboard/admin/agents', label: 'Agents', icon: '👥' },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: '📈' },
];
const agentNav = [
  { href: '/dashboard/agent', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/agent/leads', label: 'My Leads', icon: '📋' },
];

export default function Sidebar({ role, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = role === 'admin' ? adminNav : agentNav;

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/auth/login');
  };

  return (
    <aside style={{ width: '260px', minHeight: '100vh', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
      <div style={{ padding: '28px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🏠</span>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: '800', fontSize: '16px', color: 'var(--text)' }}>Property CRM</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '20px 12px', flex: 1 }}>
        {nav.map(item => (
          <Link key={item.href} href={item.href}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', marginBottom: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'all 0.15s',
              background: pathname === item.href ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: pathname === item.href ? 'var(--accent2)' : 'var(--muted)',
              borderLeft: pathname === item.href ? '3px solid var(--accent)' : '3px solid transparent' }}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{user?.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{user?.email}</div>
        </div>
        <button onClick={logout}
          style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}