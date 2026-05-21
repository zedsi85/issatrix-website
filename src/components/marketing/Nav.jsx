import { Link, useLocation } from 'react-router-dom';
import { C, FONT_SANS, FONT_MONO, Btn } from './Primitives.jsx';
import wordmark from '/assets/issatrix-wordmark.svg';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

const items = [
  { label: 'Platform',   to: '/' },
  { label: 'Issuance',   to: '/issuance' },
  { label: 'Compliance', to: '/compliance' },
  { label: 'Docs',       to: '/docs' },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 64, padding: '0 32px',
      borderBottom: `1px solid ${C.slate200}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(245, 242, 235, 0.82)',
      backdropFilter: 'saturate(180%) blur(12px)',
      WebkitBackdropFilter: 'saturate(180%) blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
          <img src={wordmark} alt="Issatrix" style={{ height: 18, display: 'block' }} />
        </Link>
        <nav style={{ display: 'flex', gap: 24, fontFamily: FONT_SANS, fontSize: 13 }}>
          {items.map(it => {
            const isActive = it.to === '/' ? pathname === '/' : pathname.startsWith(it.to);
            return (
              <Link key={it.label} to={it.to}
                style={{
                  color: isActive ? C.ink : C.slate500,
                  textDecoration: 'none',
                  padding: '22px 0',
                  borderBottom: isActive ? `2px solid ${C.ink}` : '2px solid transparent',
                  transition: 'color 120ms cubic-bezier(0.2,0,0,1)',
                }}>{it.label}</Link>
            );
          })}
        </nav>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Btn variant="secondary" size="sm">Sign in</Btn>
        <Btn variant="primary" size="sm" href={CONTACT_URL}>Get in touch →</Btn>
      </div>
    </div>
  );
}
