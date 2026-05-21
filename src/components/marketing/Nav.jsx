import { useState } from 'react';
import { C, FONT_SANS, FONT_MONO, Btn } from './Primitives.jsx';
import wordmark from '/assets/issatrix-wordmark.svg';

export default function Nav({ active, onNav }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = ['Platform', 'Issuance', 'Compliance', 'AquaIndex', 'Docs'];

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
        <a href="#" style={{ textDecoration: 'none', display: 'block' }}>
          <img src={wordmark} alt="Issatrix" style={{ height: 18, display: 'block' }} />
        </a>
        <nav style={{ display: 'flex', gap: 24, fontFamily: FONT_SANS, fontSize: 13 }}>
          {items.map(it => {
            const isActive = active === it;
            return (
              <a key={it} href="#"
                onClick={(e) => { e.preventDefault(); onNav && onNav(it); }}
                style={{
                  color: isActive ? C.ink : C.slate500,
                  textDecoration: 'none',
                  padding: '22px 0',
                  borderBottom: isActive ? `2px solid ${C.ink}` : '2px solid transparent',
                  transition: 'color 120ms cubic-bezier(0.2,0,0,1)',
                }}>{it}</a>
            );
          })}
        </nav>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Btn variant="secondary" size="sm">Sign in</Btn>
        <Btn variant="primary" size="sm">Request access →</Btn>
      </div>
    </div>
  );
}
