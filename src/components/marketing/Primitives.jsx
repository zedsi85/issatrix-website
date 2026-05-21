import { useState } from 'react';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO } from '../../tokens.js';

export { C, FONT_DISPLAY, FONT_SANS, FONT_MONO };

export function Eyebrow({ coord, children, color }) {
  return (
    <div style={{
      fontFamily: FONT_SANS, fontWeight: 500, fontSize: 12, textTransform: 'uppercase',
      letterSpacing: '0.14em', color: color || C.slate500,
      display: 'inline-flex', gap: 10, alignItems: 'center',
    }}>
      {coord && (
        <span style={{ fontFamily: FONT_MONO, color: C.slate400, letterSpacing: 0 }}>{coord}</span>
      )}
      <span>{children}</span>
    </div>
  );
}

export function Btn({ variant = 'primary', size = 'md', children, onClick, href }) {
  const [hover, setHover] = useState(false);
  const styles = {
    primary:   { bg: hover ? C.inkPress : C.ink,               fg: C.paper, border: 'transparent' },
    secondary: { bg: hover ? 'rgba(10,25,32,0.06)' : 'transparent', fg: C.ink,   border: C.slate200 },
    ghost:     { bg: hover ? 'rgba(10,25,32,0.06)' : 'transparent', fg: C.ink,   border: 'transparent' },
    accent:    { bg: hover ? C.aqua700 : C.aqua600,            fg: C.paper, border: 'transparent' },
  }[variant];
  const sz = size === 'sm' ? { h: 30, px: 12, fs: 12 } : { h: 40, px: 18, fs: 14 };
  const common = {
    fontFamily: FONT_SANS, fontWeight: 500, fontSize: sz.fs,
    height: sz.h, padding: `0 ${sz.px}px`,
    borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 8,
    cursor: 'pointer', background: styles.bg, color: styles.fg,
    border: `1px solid ${styles.border}`, whiteSpace: 'nowrap',
    textDecoration: 'none',
    transition: 'background 120ms cubic-bezier(0.2,0,0,1)',
  };
  if (href) {
    return (
      <a href={href} style={common}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} style={common}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
    </button>
  );
}

export function Badge({ tone = 'verified', glyph, children }) {
  const pal = {
    verified: { bg: '#E6F0E9', fg: C.verified,  glyph: '●' },
    pending:  { bg: '#F5ECDC', fg: C.pending,   glyph: '◐' },
    halted:   { bg: '#F2DEDE', fg: C.halted,    glyph: '▮' },
    draft:    { bg: C.paper2,  fg: C.slate500,  glyph: '○' },
    aqua:     { bg: C.aqua50,  fg: C.aqua700,   glyph: '▦' },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 24, padding: '0 10px', borderRadius: 999,
      fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.04em',
      background: pal.bg, color: pal.fg,
    }}>
      <span>{glyph || pal.glyph}</span>
      <span>{children}</span>
    </span>
  );
}

export function MatrixBg({ children, opacity = 0.06, cell = 32, style }) {
  return (
    <div style={{
      backgroundImage: `
        linear-gradient(to right, rgba(10,25,32,${opacity}) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(10,25,32,${opacity}) 1px, transparent 1px)
      `,
      backgroundSize: `${cell}px ${cell}px`,
      ...style,
    }}>
      {children}
    </div>
  );
}
