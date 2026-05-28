import { useState, useEffect, useRef } from 'react';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow } from './Primitives.jsx';

const CYCLE_MS = 4200;

const ASSETS = [
  {
    id: 'realestate', label: 'Real estate', unit: '120,000 ft²', cells: { cols: 10, rows: 6 },
    clip: 'polygon(0% 38%, 18% 38%, 18% 18%, 30% 8%, 50% 18%, 70% 8%, 82% 18%, 82% 38%, 100% 38%, 100% 100%, 0% 100%)',
  },
  {
    id: 'gold', label: 'Gold reserve', unit: '4,800 troy oz', cells: { cols: 10, rows: 6 },
    clip: 'polygon(14% 28%, 86% 28%, 94% 84%, 6% 84%)',
  },
  {
    id: 'water', label: 'Water reserve', unit: '7.2M m³', cells: { cols: 10, rows: 6 },
    clip: 'polygon(0% 32%, 8% 26%, 16% 32%, 24% 26%, 32% 32%, 40% 26%, 48% 32%, 56% 26%, 64% 32%, 72% 26%, 80% 32%, 88% 26%, 96% 32%, 100% 30%, 100% 96%, 0% 96%)',
  },
  {
    id: 'commodities', label: 'Commodities', unit: '24,000 bbl', cells: { cols: 10, rows: 6 },
    clip: 'polygon(20% 16%, 80% 16%, 80% 20%, 84% 26%, 84% 74%, 80% 80%, 80% 84%, 20% 84%, 20% 80%, 16% 74%, 16% 26%, 20% 20%)',
  },
  {
    id: 'carbon', label: 'Carbon credits', unit: '180,000 tCO₂e', cells: { cols: 10, rows: 6 },
    clip: 'polygon(50% 6%, 70% 26%, 60% 26%, 82% 48%, 66% 48%, 90% 72%, 56% 72%, 56% 94%, 44% 94%, 44% 72%, 10% 72%, 34% 48%, 18% 48%, 40% 26%, 30% 26%)',
  },
  {
    id: 'infrastructure', label: 'Infrastructure', unit: '12.4 MW', cells: { cols: 10, rows: 6 },
    clip: 'polygon(0% 50%, 12% 50%, 12% 28%, 18% 28%, 18% 50%, 30% 50%, 30% 22%, 38% 22%, 38% 50%, 50% 50%, 50% 26%, 58% 26%, 58% 50%, 70% 50%, 70% 22%, 78% 22%, 78% 50%, 90% 50%, 90% 28%, 100% 28%, 100% 82%, 0% 82%)',
  },
];

const INVESTOR_POOL = [
  { addr: '0x7a3c…ae04', region: 'EU', pct: '1.20%', units: '12,400', status: 'verified', chain: 'Ethereum L1' },
  { addr: '0x9F2c…1102', region: 'US', pct: '0.82%', units: '8,200',  status: 'verified', chain: 'Ethereum L1' },
  { addr: '0x55de…3a18', region: 'SG', pct: '0.64%', units: '6,400',  status: 'verified', chain: 'Base L2' },
  { addr: '0x88c1…0f44', region: 'UK', pct: '0.41%', units: '4,100',  status: 'pending',  chain: 'Ethereum L1' },
  { addr: '0xa01f…7732', region: 'AE', pct: '0.36%', units: '3,600',  status: 'verified', chain: 'Polygon' },
  { addr: '0x412e…9bb8', region: 'CH', pct: '0.28%', units: '2,800',  status: 'verified', chain: 'Ethereum L1' },
  { addr: '0xd6b1…2c91', region: 'JP', pct: '0.22%', units: '2,200',  status: 'verified', chain: 'Base L2' },
  { addr: '0xe204…4d77', region: 'AU', pct: '0.18%', units: '1,800',  status: 'pending',  chain: 'Avalanche' },
  { addr: '0x6c0a…ba03', region: 'DE', pct: '0.15%', units: '1,500',  status: 'verified', chain: 'Ethereum L1' },
  { addr: '0xfa70…5e16', region: 'FR', pct: '0.12%', units: '1,200',  status: 'verified', chain: 'Polygon' },
  { addr: '0x33ce…9018', region: 'CA', pct: '0.10%', units: '1,000',  status: 'verified', chain: 'Ethereum L1' },
  { addr: '0x9e51…81da', region: 'BR', pct: '0.08%', units: '800',    status: 'pending',  chain: 'Base L2' },
];

const dataFor = (r, c) =>
  INVESTOR_POOL[((r * 31 + c * 17) % INVESTOR_POOL.length + INVESTOR_POOL.length) % INVESTOR_POOL.length];

const FEATURED = [{ r: 1, c: 3 }, { r: 3, c: 5 }, { r: 4, c: 8 }];
const isFeatured = (r, c) => FEATURED.some(f => f.r === r && f.c === c);

const STEP_LABELS = [
  { i: 0, l: 'Whole asset' },
  { i: 1, l: 'Tokenized cells' },
  { i: 2, l: 'Investor data' },
];

function InvestorCard({ hover, containerWidth }) {
  const w = 220;
  const idealLeft = hover.cellLeft + hover.cellWidth + 8;
  const flip = idealLeft + w + 8 > containerWidth;
  const left = flip ? hover.cellLeft - w - 8 : idealLeft;
  const top = Math.max(8, hover.cellTop - 6);
  const coord = `${String.fromCharCode(65 + hover.r)} · ${(hover.c + 1).toString().padStart(2, '0')}`;
  const d = hover.data;

  return (
    <div style={{
      position: 'absolute', left, top, width: w,
      background: C.bone, border: `1px solid ${C.slate200}`,
      boxShadow: '0 8px 24px rgba(10, 25, 32, 0.14)',
      borderRadius: 2, padding: '10px 12px 12px',
      fontFamily: FONT_SANS, pointerEvents: 'none', zIndex: 5,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{coord}</span>
        <span style={{
          fontFamily: FONT_MONO, fontSize: 9, padding: '2px 6px', borderRadius: 999,
          background: d.status === 'pending' ? '#F5ECDC' : '#E6F0E9',
          color: d.status === 'pending' ? C.pending : C.verified,
          letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>{d.status === 'pending' ? '◐ PENDING' : '● VERIFIED'}</span>
      </div>
      <div style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 12, color: C.ink, fontWeight: 500 }}>
        {d.addr}
      </div>
      <div style={{
        marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.slate100}`,
        display: 'grid', gridTemplateColumns: '46px 1fr', rowGap: 4, columnGap: 10,
        fontFamily: FONT_MONO, fontSize: 11,
      }}>
        <span style={{ color: C.slate400, fontSize: 10, letterSpacing: '0.04em' }}>UNITS</span>
        <span style={{ color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{d.units}</span>
        <span style={{ color: C.slate400, fontSize: 10, letterSpacing: '0.04em' }}>OWN</span>
        <span style={{ color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{d.pct}</span>
        <span style={{ color: C.slate400, fontSize: 10, letterSpacing: '0.04em' }}>REG</span>
        <span style={{ color: C.ink }}>{d.region}</span>
        <span style={{ color: C.slate400, fontSize: 10, letterSpacing: '0.04em' }}>CHAIN</span>
        <span style={{ color: C.ink, fontFamily: FONT_SANS, fontSize: 11 }}>{d.chain}</span>
        <span style={{ color: C.slate400, fontSize: 10, letterSpacing: '0.04em' }}>XFER</span>
        <span style={{ color: d.status === 'pending' ? C.pending : C.ink }}>
          {d.status === 'pending' ? 'LOCKED · audit' : 'ALLOWLIST OK'}
        </span>
      </div>
    </div>
  );
}

export default function MatrixExplainer() {
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState(0);
  const [hover, setHover] = useState(null);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const asset = ASSETS[idx];

  // Stage animation when asset changes
  useEffect(() => {
    setStage(0);
    setHover(null);
    setProgress(0);
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [idx]);

  // Progress bar + auto-advance (always runs, hover only pauses the card inspector)
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / CYCLE_MS) * 100);
      setProgress(pct);
      if (elapsed >= CYCLE_MS) {
        clearInterval(id);
        setIdx(i => (i + 1) % ASSETS.length);
      }
    }, 40);
    return () => clearInterval(id);
  }, [idx]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerWidth(el.clientWidth));
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const onCellEnter = (e, r, c) => {
    if (stage < 1 || !containerRef.current) return;
    const cellRect = e.currentTarget.getBoundingClientRect();
    const cRect = containerRef.current.getBoundingClientRect();
    setHover({
      r, c,
      cellLeft: cellRect.left - cRect.left,
      cellTop: cellRect.top - cRect.top,
      cellWidth: cellRect.width,
      cellHeight: cellRect.height,
      data: dataFor(r, c),
    });
  };

  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <Eyebrow coord="02 ·">THE ISSUANCE MATRIX</Eyebrow>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 44,
          lineHeight: 1.1, letterSpacing: '-0.02em', color: C.ink,
          margin: '20px 0 64px', maxWidth: 760, textWrap: 'balance',
        }}>
          Every asset becomes a structured ownership grid.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, alignItems: 'flex-start' }}>
          {/* Left — copy + asset selector + step indicator */}
          <div>
            <p style={{ fontFamily: FONT_SANS, fontSize: 17, lineHeight: 1.65, color: C.slate500, margin: 0, maxWidth: 480 }}>
              Issatrix transforms real-world assets into digital matrices. Each cell represents a tokenized ownership unit linked to investor identity, wallet data, compliance status, transfer rules, and asset lifecycle information.
            </p>

            <div style={{ marginTop: 36 }}>
              <Eyebrow>SELECT ASSET CLASS</Eyebrow>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                {ASSETS.map((a, i) => {
                  const active = i === idx;
                  return (
                    <button key={a.id}
                      onClick={() => setIdx(i)}
                      style={{
                        position: 'relative', overflow: 'hidden',
                        padding: '8px 14px',
                        border: `1px solid ${active ? C.ink : C.slate200}`,
                        background: active ? C.ink : 'transparent',
                        color: active ? C.paper : C.ink,
                        fontFamily: FONT_SANS, fontSize: 13, fontWeight: 500,
                        cursor: 'pointer', borderRadius: 2, whiteSpace: 'nowrap',
                        transition: 'all 120ms cubic-bezier(0.2,0,0,1)',
                      }}>
                      {a.label}
                      {/* Progress fill bar at bottom of button */}
                      {active && (
                        <span style={{
                          position: 'absolute', bottom: 0, left: 0,
                          height: 2,
                          width: `${progress}%`,
                          background: C.aqua300,
                          transition: 'width 40ms linear',
                          display: 'block',
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {STEP_LABELS.map(s => {
                const isActive = stage >= s.i;
                return (
                  <div key={s.i} style={{ position: 'relative', paddingTop: 14 }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                      background: isActive ? C.ink : C.slate200,
                      transition: 'background 320ms cubic-bezier(0.2,0,0,1)',
                    }} />
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.06em' }}>
                      STEP 0{s.i + 1}
                    </div>
                    <div style={{
                      fontFamily: FONT_SANS, fontSize: 13, fontWeight: 500, marginTop: 4,
                      color: isActive ? C.ink : C.slate400,
                      transition: 'color 320ms cubic-bezier(0.2,0,0,1)',
                    }}>{s.l}</div>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: 32, paddingTop: 16, borderTop: `1px solid ${C.slate200}`,
              display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
              fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.04em',
            }}>
              <span>{hover ? '◐ Paused · cell inspector' : `● Auto-cycling · ${idx + 1} / ${ASSETS.length}`}</span>
              <span>HOVER ANY CELL TO INSPECT</span>
            </div>
          </div>

          {/* Right — visual stage */}
          <div
            ref={containerRef}
            onMouseLeave={() => setHover(null)}
            style={{
              width: '100%', aspectRatio: '4 / 3', position: 'relative',
              background: C.paper2, border: `1px solid ${C.slate200}`, overflow: 'hidden',
            }}
          >
            {/* Grid background */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `
                linear-gradient(to right, rgba(10,25,32,0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(10,25,32,0.04) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px', pointerEvents: 'none',
            }} />

            {/* Asset shape */}
            <div style={{
              position: 'absolute', inset: 28,
              clipPath: asset.clip, WebkitClipPath: asset.clip,
              background: C.paper2,
              transition: 'clip-path 600ms cubic-bezier(0.2,0,0,1)',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'grid',
                gridTemplateColumns: `repeat(${asset.cells.cols}, 1fr)`,
                gridTemplateRows: `repeat(${asset.cells.rows}, 1fr)`,
                gap: stage >= 1 ? 3 : 0,
                transition: 'gap 800ms cubic-bezier(0.2,0,0,1)',
              }}>
                {Array.from({ length: asset.cells.cols * asset.cells.rows }).map((_, i) => {
                  const r = Math.floor(i / asset.cells.cols);
                  const c = i % asset.cells.cols;
                  const featuredCell = stage >= 2 && isFeatured(r, c);
                  const isHovered = hover && hover.r === r && hover.c === c;
                  let bg = C.ink;
                  if (isHovered) bg = C.aqua700;
                  else if (featuredCell) {
                    const d = dataFor(r, c);
                    bg = d.status === 'pending' ? C.aqua300 : C.aqua600;
                  }
                  return (
                    <div
                      key={i}
                      onMouseEnter={(e) => onCellEnter(e, r, c)}
                      style={{
                        background: bg, cursor: stage >= 1 ? 'crosshair' : 'default',
                        transition: 'background 160ms cubic-bezier(0.2,0,0,1)',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Labels — asset name top-left, unit top-right */}
            <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.06em' }}>
              ▦ {asset.label.toUpperCase()}
            </div>
            <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.06em' }}>
              {asset.unit.toUpperCase()}
            </div>
            {/* Grid dimensions bottom-left, status bottom-right */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.06em' }}>
              {asset.cells.cols} × {asset.cells.rows} · {asset.cells.cols * asset.cells.rows} UNITS
            </div>
            <div style={{
              position: 'absolute', bottom: 14, right: 14,
              fontFamily: FONT_MONO, fontSize: 11,
              color: stage >= 2 ? C.aqua700 : C.slate400,
              letterSpacing: '0.06em', transition: 'color 320ms',
            }}>
              {stage === 0 ? 'WHOLE' : stage === 1 ? 'STRUCTURED' : 'POPULATED'}
            </div>

            {hover && stage >= 1 && (
              <InvestorCard hover={hover} containerWidth={containerWidth} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
