"use client";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    index: "01",
    title: "Easy Search",
    desc: "Find any title or author in milliseconds. Indexed, filtered, and always accurate.",
    symbol: "⌕",
    accent: "#4f7cff",
    tag: "Discovery",
  },
  {
    index: "02",
    title: "Clean UI",
    desc: "Every pixel earns its place. A reading interface stripped of everything unnecessary.",
    symbol: "⊡",
    accent: "#c084fc",
    tag: "Experience",
  },
  {
    index: "03",
    title: "Manage Books",
    desc: "Add, edit, curate. Your collection organized exactly the way you think.",
    symbol: "⊞",
    accent: "#34d399",
    tag: "Curation",
  },
  {
    index: "04",
    title: "Fast Performance",
    desc: "Zero lag. Instant responses. Built for speed from the ground up.",
    symbol: "⚡",
    accent: "#fbbf24",
    tag: "Speed",
  },
];

function FeatureCard({ feature, i }: { feature: typeof FEATURES[0]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const [mouseLocal, setMouseLocal] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseLocal({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      className="feat-card"
      style={{
        "--accent": feature.accent,
        animationDelay: `${i * 0.12}s`,
      } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-follow spotlight */}
      {hovered && (
        <div
          className="card-spotlight"
          style={{ left: mouseLocal.x, top: mouseLocal.y }}
        />
      )}

      {/* Top row */}
      <div className="card-top">
        <span className="card-index">{feature.index}</span>
        <span className="card-tag">{feature.tag}</span>
      </div>

      {/* Symbol */}
      <div className="card-symbol-wrap">
        <span className="card-symbol">{feature.symbol}</span>
        <div className="card-symbol-glow" />
      </div>

      {/* Divider */}
      <div className="card-divider">
        <div className="card-divider-fill" />
      </div>

      {/* Text */}
      <h3 className="card-title">{feature.title}</h3>
      <p className="card-desc">{feature.desc}</p>

      {/* Bottom accent line */}
      <div className="card-bottom-line" />
    </div>
  );
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Space+Mono:wght@400;700&family=Crimson+Pro:ital,wght@1,300&display=swap');

        .features-section {
          position: relative;
          background: #070b14;
          padding: 120px 24px;
          overflow: hidden;
          font-family: 'Space Mono', monospace;
        }

        /* Background texture */
        .features-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(100,120,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,120,255,0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Ambient glows */
        .features-glow-1 {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,124,255,0.06) 0%, transparent 70%);
          top: -200px;
          left: -200px;
          pointer-events: none;
        }
        .features-glow-2 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(192,132,252,0.05) 0%, transparent 70%);
          bottom: -150px;
          right: -100px;
          pointer-events: none;
        }

        /* Section header */
        .features-header {
          position: relative;
          max-width: 960px;
          margin: 0 auto 80px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }

        .features-header-left {
          flex: 1;
          min-width: 260px;
        }

        .features-eyebrow {
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #4f7cff;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s, transform 0.6s;
        }
        .features-eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: #4f7cff;
        }

        .features-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 700;
          line-height: 1.05;
          color: #fff;
          margin: 0;
          letter-spacing: -0.02em;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s 0.1s, transform 0.6s 0.1s;
        }
        .features-title em {
          font-style: italic;
          font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.35);
        }

        .features-header-right {
          max-width: 280px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s 0.2s, transform 0.6s 0.2s;
        }
        .features-header-right p {
          font-family: 'Crimson Pro', Georgia, serif;
          font-style: italic;
          font-size: 18px;
          font-weight: 300;
          color: rgba(160,185,255,0.55);
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .features-count {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(100,140,255,0.4);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .features-count::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: rgba(100,140,255,0.3);
        }

        /* Visible state */
        .features-section.is-visible .features-eyebrow,
        .features-section.is-visible .features-title,
        .features-section.is-visible .features-header-right {
          opacity: 1;
          transform: translateY(0);
        }
        .features-section.is-visible .feat-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* Cards grid */
        .features-grid {
          position: relative;
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(100,140,255,0.1);
          border: 1px solid rgba(100,140,255,0.1);
        }

        @media (max-width: 768px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr; }
        }

        /* Card */
        .feat-card {
          position: relative;
          background: #070b14;
          padding: 36px 28px 32px;
          overflow: hidden;
          cursor: default;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.6s var(--delay, 0s),
            transform 0.6s var(--delay, 0s),
            background 0.3s;
        }
        .feat-card:hover {
          background: rgba(10,15,28,1);
        }

        /* Hover spotlight */
        .card-spotlight {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(var(--accent-rgb, 79,124,255),0.1) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%);
        }

        /* Top row */
        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .card-index {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(100,140,255,0.3);
        }
        .card-tag {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(100,140,255,0.3);
          padding: 3px 8px;
          border: 1px solid rgba(100,140,255,0.12);
        }

        /* Symbol */
        .card-symbol-wrap {
          position: relative;
          margin-bottom: 24px;
          display: inline-block;
        }
        .card-symbol {
          font-size: 32px;
          color: var(--accent);
          display: block;
          transition: transform 0.3s;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 40%, transparent));
        }
        .feat-card:hover .card-symbol {
          transform: scale(1.1) translateY(-2px);
        }
        .card-symbol-glow {
          position: absolute;
          inset: -12px;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 15%, transparent) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feat-card:hover .card-symbol-glow { opacity: 1; }

        /* Divider */
        .card-divider {
          height: 1px;
          background: rgba(100,140,255,0.08);
          margin-bottom: 20px;
          overflow: hidden;
        }
        .card-divider-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, var(--accent), transparent);
          transition: width 0.5s ease;
        }
        .feat-card:hover .card-divider-fill { width: 100%; }

        /* Text */
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
          transition: color 0.2s;
        }
        .feat-card:hover .card-title {
          color: color-mix(in srgb, var(--accent) 30%, white);
        }
        .card-desc {
          font-family: 'Crimson Pro', Georgia, serif;
          font-style: italic;
          font-size: 15px;
          font-weight: 300;
          color: rgba(160,185,255,0.45);
          line-height: 1.65;
          margin: 0;
          transition: color 0.2s;
        }
        .feat-card:hover .card-desc { color: rgba(160,185,255,0.65); }

        /* Bottom accent line */
        .card-bottom-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .feat-card:hover .card-bottom-line { transform: scaleX(1); }

        /* Bottom strip */
        .features-footer {
          position: relative;
          max-width: 960px;
          margin: 0 auto;
          padding-top: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(100,140,255,0.08);
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s 0.5s, transform 0.6s 0.5s;
        }
        .features-section.is-visible .features-footer {
          opacity: 1;
          transform: translateY(0);
        }
        .features-footer-text {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(100,140,255,0.3);
          text-transform: uppercase;
        }
        .features-footer-dots {
          display: flex;
          gap: 6px;
        }
        .features-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(100,140,255,0.2);
          transition: background 0.2s;
        }
        .features-footer-dot.active { background: #4f7cff; }
      `}</style>

      <section
        ref={sectionRef}
        className={`features-section${visible ? " is-visible" : ""}`}
      >
        <div className="features-glow-1" />
        <div className="features-glow-2" />

        {/* Header */}
        <div className="features-header">
          <div className="features-header-left">
            <div className="features-eyebrow">Core Capabilities</div>
            <h2 className="features-title">
              Built for<br /><em>Readers</em>
            </h2>
          </div>
          <div className="features-header-right">
            <p>Every feature exists to get you to the right book, faster.</p>
            <div className="features-count">04 capabilities</div>
          </div>
        </div>

        {/* Grid */}
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} i={i} />
          ))}
        </div>

        {/* Footer strip */}
        <div className="features-footer">
          <span className="features-footer-text">Online Library — v2.0</span>
          <div className="features-footer-dots">
            {[0,1,2,3].map(i => (
              <div key={i} className={`features-footer-dot${i === 0 ? " active" : ""}`} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}