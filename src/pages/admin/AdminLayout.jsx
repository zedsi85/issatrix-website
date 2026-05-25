import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { C, FONT_SANS, FONT_MONO } from '../../tokens.js';
import { getToken, clearToken } from '../../lib/api.js';

function SidebarLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 36,
        padding: '0 14px',
        borderRadius: 4,
        fontFamily: FONT_SANS,
        fontSize: 13,
        fontWeight: 500,
        textDecoration: 'none',
        color: isActive ? C.paper : 'rgba(245,242,235,0.55)',
        background: isActive ? 'rgba(245,242,235,0.10)' : 'transparent',
        transition: 'background 100ms, color 100ms',
      })}
    >
      {children}
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin/login', { replace: true });
    } else {
      setReady(true);
    }
  }, [navigate]);

  function handleLogout() {
    clearToken();
    navigate('/admin/login');
  }

  if (!ready) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: FONT_SANS }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: C.ink,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: 32, paddingLeft: 14 }}>
          <img src="/assets/issatrix-wordmark.svg" alt="Issatrix" height={18} style={{ filter: 'invert(1) brightness(0.85)' }} />
          <div style={{
            marginTop: 6,
            fontFamily: FONT_MONO,
            fontSize: 10,
            letterSpacing: '0.12em',
            color: 'rgba(245,242,235,0.4)',
            textTransform: 'uppercase',
          }}>
            Agent Console
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <div style={{ fontSize: 10, fontFamily: FONT_MONO, color: 'rgba(245,242,235,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 14px 8px' }}>
            Agents
          </div>
          <SidebarLink to="/admin" end>Dashboard</SidebarLink>
          <SidebarLink to="/admin/agent/new">+ New Structuring</SidebarLink>

          <div style={{ fontSize: 10, fontFamily: FONT_MONO, color: 'rgba(245,242,235,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '16px 14px 8px' }}>
            Projects
          </div>
          <SidebarLink to="/admin/projects">All Projects</SidebarLink>
        </nav>

        <div style={{ paddingLeft: 14, paddingBottom: 4 }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: FONT_SANS,
              fontSize: 12,
              color: 'rgba(245,242,235,0.35)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: 220,
        minHeight: '100vh',
        background: C.slate50,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
