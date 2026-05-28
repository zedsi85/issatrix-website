import { useRef, useState, useEffect } from 'react';
import { C, FONT_SANS, FONT_MONO } from './Primitives.jsx';

const TOKEN_POOL = (() => {
  const syms = ['AQX-A', 'AQX-B', 'SYN-22', 'REA-11', 'CCX-04', 'GLD-04'];
  const chains = ['Ethereum L1', 'Base L2', 'Polygon', 'Avalanche'];
  const out = [];
  let s = 1337;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = 0; i < 360; i++) {
    const hex = (n) => Math.floor(rnd() * 16).toString(16).repeat(n);
    const addr = `0x${hex(4)}…${hex(4)}`;
    const units = (Math.floor(rnd() * 480) + 1) * 1000;
    out.push({
      addr, units,
      chain: chains[Math.floor(rnd() * chains.length)],
      sym: syms[Math.floor(rnd() * syms.length)],
      verified: rnd() > 0.18,
    });
  }
  return out;
})();

function HoverCard({ x, y, cell, coord, data, wrapWidth }) {
  const w = 240;
  const flip = x + w + 16 > wrapWidth;
  const left = flip ? x - cell - w - 8 : x + 8;
  const top = Math.max(8, y - 4);

  return (
    <div style={{
      position: 'absolute', left, top, width: w,
      background: '#FFFFFF', border: '1px solid #CFC9BD',
      boxShadow: '0 8px 24px rgba(10, 25, 32, 0.14)',
      borderRadius: 2, padding: '12px 14px',
      fontFamily: FONT_SANS, pointerEvents: 'none', zIndex: 5,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: '#7B7468', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{coord}</span>
        <span style={{
          fontFamily: FONT_MONO, fontSize: 9, padding: '2px 6px', borderRadius: 999,
          background: data.verified ? '#E6F0E9' : '#F5ECDC',
          color: data.verified ? '#2C7A4B' : '#A66B12',
          letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>{data.verified ? '● VERIFIED' : '◐ PENDING'}</span>
      </div>
      <div style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 13, color: '#0A1920', fontWeight: 500 }}>
        {data.addr}
      </div>
      <div style={{
        marginTop: 10, paddingTop: 8, borderTop: '1px solid #E6E2DA',
        display: 'grid', gridTemplateColumns: '70px 1fr', rowGap: 4, columnGap: 10, fontSize: 12,
      }}>
        <span style={{ fontFamily: FONT_MONO, color: '#7B7468', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>UNITS</span>
        <span style={{ fontFamily: FONT_MONO, color: '#0A1920', fontVariantNumeric: 'tabular-nums' }}>{data.units.toLocaleString()}</span>
        <span style={{ fontFamily: FONT_MONO, color: '#7B7468', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SYMBOL</span>
        <span style={{ fontFamily: FONT_MONO, color: '#0A1920' }}>{data.sym}</span>
        <span style={{ fontFamily: FONT_MONO, color: '#7B7468', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>CHAIN</span>
        <span style={{ fontFamily: FONT_SANS, color: '#0A1920' }}>{data.chain}</span>
      </div>
    </div>
  );
}

export default function HeroMatrix({ cell = 32, density = 16, intensity = 0 }) {
  const wrapRef = useRef(null);
  const [dims, setDims] = useState({ cols: 40, rows: 18 });
  const [hover, setHover] = useState(null);
  const [spotlights, setSpotlights] = useState([]);
  const [autoCardTarget, setAutoCardTarget] = useState(null);

  useEffect(() => {
    const calc = () => {
      const el = wrapRef.current;
      if (!el) return;
      setDims({
        cols: Math.max(8, Math.floor(el.clientWidth / cell)),
        rows: Math.max(6, Math.floor(el.clientHeight / cell)),
      });
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [cell]);

  const dataFor = (r, c) => {
    const idx = (r * 73856093) ^ (c * 19349663);
    const u = (idx >>> 0) % 1000;
    if (u >= density * 10) return null;
    return TOKEN_POOL[u % TOKEN_POOL.length];
  };

  // Pick spotlight cells randomly; rotate every 3s
  useEffect(() => {
    function pickSpots() {
      const picks = [];
      const seen = new Set();
      let iters = 0;
      while (picks.length < 6 && iters < 400) {
        const r = Math.floor(Math.random() * dims.rows);
        const c = Math.floor(Math.random() * dims.cols);
        const key = `${r}-${c}`;
        const d = dataFor(r, c);
        if (d && !seen.has(key)) {
          picks.push({ r, c, data: d });
          seen.add(key);
        }
        iters++;
      }
      return picks;
    }

    const init = pickSpots();
    setSpotlights(init);
    setAutoCardTarget(init[0] || null);

    const id = setInterval(() => {
      const next = pickSpots();
      setSpotlights(next);
      setAutoCardTarget(next[Math.floor(Math.random() * next.length)] || null);
    }, 3000);
    return () => clearInterval(id);
  }, [dims]);

  const lineColor = `rgba(10, 25, 32, ${0.04 + intensity * 0.04})`;
  const fillColor = `rgba(10, 25, 32, ${0.10 + intensity * 0.06})`;

  const onMove = (e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const c = Math.floor(x / cell);
    const r = Math.floor(y / cell);
    if (c < 0 || r < 0 || c >= dims.cols || r >= dims.rows) { setHover(null); return; }
    const d = dataFor(r, c);
    if (!d) { setHover(null); return; }
    setHover({ r, c, data: d, x: (c + 1) * cell, y: r * cell });
  };

  const isSpotlit = (r, c) => spotlights.some(s => s.r === r && s.c === c);

  const activeCard = hover || (autoCardTarget
    ? { ...autoCardTarget, x: (autoCardTarget.c + 1) * cell, y: autoCardTarget.r * cell }
    : null);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      style={{ position: 'absolute', inset: 0, cursor: hover ? 'crosshair' : 'default', overflow: 'hidden' }}
    >
      <style>{`
        @keyframes heroMatrixDrift {
          from { background-position: 0 0; }
          to   { background-position: ${cell}px 0; }
        }
        @keyframes spotlightPulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* Animated grid lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(to right, ${lineColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
        `,
        backgroundSize: `${cell}px ${cell}px`,
        animation: `heroMatrixDrift ${cell * 110}ms linear infinite`,
        pointerEvents: 'none',
      }} />

      {/* Cell fills */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: dims.rows }).map((_, r) =>
          Array.from({ length: dims.cols }).map((_, c) => {
            const d = dataFor(r, c);
            if (!d) return null;
            const isHov = hover && hover.r === r && hover.c === c;
            const isAuto = !hover && autoCardTarget && autoCardTarget.r === r && autoCardTarget.c === c;
            const spot = isSpotlit(r, c);
            let fill = fillColor;
            if (isHov || isAuto) fill = '#1F6F7A';
            else if (spot) fill = `rgba(31, 111, 122, 0.38)`;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cell + 1} y={r * cell + 1}
                width={cell - 2} height={cell - 2}
                fill={fill}
                style={spot && !isHov && !isAuto ? { animation: 'spotlightPulse 2.4s ease-in-out infinite' } : undefined}
              />
            );
          })
        )}
        {(hover || (!hover && autoCardTarget)) && (() => {
          const t = hover || autoCardTarget;
          return (
            <rect
              x={t.c * cell} y={t.r * cell}
              width={cell} height={cell}
              fill="none" stroke="#0A1920" strokeWidth="1.5"
            />
          );
        })()}
      </svg>

      {activeCard && (
        <HoverCard
          x={activeCard.x} y={activeCard.y} cell={cell}
          coord={`${String.fromCharCode(65 + (activeCard.r % 26))} · ${(activeCard.c + 1).toString().padStart(2, '0')}`}
          data={activeCard.data}
          wrapWidth={wrapRef.current ? wrapRef.current.clientWidth : 0}
        />
      )}
    </div>
  );
}
