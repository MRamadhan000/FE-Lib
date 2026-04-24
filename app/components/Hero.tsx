"use client";
import { useEffect, useRef, useState } from "react";

const FLOATING_BOOKS = [
  { title: "Dune", color: "#c9a84c", angle: -15, x: "8%", y: "20%", z: 1 },
  { title: "Neuromancer", color: "#3a7bd5", angle: 8, x: "82%", y: "15%", z: 2 },
  { title: "1984", color: "#e05252", angle: -5, x: "75%", y: "65%", z: 1 },
  { title: "Solaris", color: "#4caf8a", angle: 12, x: "12%", y: "70%", z: 2 },
  { title: "Kafka", color: "#9b59b6", angle: -20, x: "60%", y: "8%", z: 1 },
  { title: "Borges", color: "#e67e22", angle: 6, x: "3%", y: "45%", z: 2 },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        hue: Math.random() * 60 + 200,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;

      // Draw particle field
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + t * 20}, 70%, 70%, ${p.alpha})`;
        ctx.fill();
      });

      // Draw flowing lines
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.3 + i * 0.2));
        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height * (0.3 + i * 0.2) + Math.sin(x * 0.008 + t + i) * 40 + Math.sin(x * 0.003 + t * 0.7) * 60;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${220 + i * 30 + t * 10}, 80%, 65%, 0.06)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Space+Mono:wght@400;700&family=Crimson+Pro:ital,wght@0,300;1,300&display=swap');

        .hero-root {
          position: relative;
          min-height: 100vh;
          background: #070b14;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Space Mono', monospace;
          cursor: crosshair;
        }

        .hero-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Radial gradient overlay */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,40,90,0.5) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(60,20,80,0.4) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(20,60,100,0.3) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Grid texture */
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(100,120,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,120,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Floating book spine */
        .book-spine {
          position: absolute;
          width: 28px;
          border-radius: 3px;
          box-shadow: 4px 4px 20px rgba(0,0,0,0.5), inset 1px 0 rgba(255,255,255,0.15);
          transition: transform 0.3s ease;
          animation: floatBook 6s ease-in-out infinite;
          cursor: pointer;
        }
        .book-spine:hover {
          transform: scale(1.15) translateY(-6px) !important;
          z-index: 10 !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(100,140,255,0.3);
        }
        .book-spine .spine-title {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.7);
          padding: 8px 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 90px;
        }

        @keyframes floatBook {
          0%, 100% { transform: translateY(0px) rotate(var(--angle)); }
          50% { transform: translateY(-14px) rotate(var(--angle)); }
        }

        /* Center content */
        .hero-content {
          position: relative;
          z-index: 5;
          text-align: center;
          max-width: 820px;
          padding: 0 24px;
          animation: fadeUp 1s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.35em;
          color: #6b9dff;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          animation: fadeUp 1s 0.1s ease both;
        }
        .hero-eyebrow::before,
        .hero-eyebrow::after {
          content: '';
          display: block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #6b9dff);
        }
        .hero-eyebrow::after {
          background: linear-gradient(90deg, #6b9dff, transparent);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(52px, 9vw, 100px);
          font-weight: 900;
          line-height: 0.95;
          color: #fff;
          margin: 0 0 8px;
          animation: fadeUp 1s 0.2s ease both;
          letter-spacing: -0.02em;
        }

        .hero-title .word-alt {
          font-style: italic;
          font-weight: 400;
          background: linear-gradient(135deg, #7eb3ff 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle-line {
          font-family: 'Crimson Pro', Georgia, serif;
          font-size: clamp(18px, 2.5vw, 26px);
          font-style: italic;
          font-weight: 300;
          color: rgba(180, 200, 255, 0.6);
          margin: 20px 0 40px;
          animation: fadeUp 1s 0.35s ease both;
          letter-spacing: 0.02em;
        }

        .hero-search {
          position: relative;
          max-width: 560px;
          margin: 0 auto 44px;
          animation: fadeUp 1s 0.45s ease both;
        }

        .hero-search input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(100,140,255,0.25);
          border-radius: 2px;
          padding: 18px 130px 18px 52px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #fff;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          backdrop-filter: blur(12px);
          letter-spacing: 0.05em;
        }
        .hero-search input::placeholder { color: rgba(150,170,220,0.4); }
        .hero-search input:focus {
          border-color: rgba(100,140,255,0.7);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px rgba(100,140,255,0.1), 0 8px 32px rgba(0,0,0,0.3);
        }

        .hero-search .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(100,140,255,0.6);
          font-size: 18px;
          pointer-events: none;
        }

        .hero-search .search-btn {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #4f7cff, #9f46e4);
          color: #fff;
          border: none;
          border-radius: 2px;
          padding: 10px 22px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          text-transform: uppercase;
        }
        .hero-search .search-btn:hover {
          opacity: 0.85;
          transform: translateY(-50%) scale(1.03);
        }

        /* Stats row */
        .hero-stats {
          display: flex;
          gap: 0;
          justify-content: center;
          margin-bottom: 44px;
          animation: fadeUp 1s 0.55s ease both;
          border: 1px solid rgba(100,140,255,0.12);
          border-radius: 2px;
          overflow: hidden;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-stat {
          flex: 1;
          padding: 18px 12px;
          border-right: 1px solid rgba(100,140,255,0.12);
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.02);
        }
        .hero-stat:last-child { border-right: none; }
        .hero-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          display: block;
          line-height: 1;
          margin-bottom: 4px;
        }
        .hero-stat-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(150,180,255,0.5);
        }

        /* CTA buttons */
        .hero-ctas {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp 1s 0.65s ease both;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: linear-gradient(135deg, #4f7cff 0%, #9f46e4 100%);
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(79,124,255,0.3);
          position: relative;
          overflow: hidden;
        }
        .cta-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(79,124,255,0.45); }
        .cta-primary:hover::before { opacity: 1; }

        .cta-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: transparent;
          color: rgba(180,200,255,0.8);
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(100,140,255,0.3);
          border-radius: 2px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .cta-ghost:hover {
          border-color: rgba(100,140,255,0.7);
          background: rgba(100,140,255,0.07);
          color: #fff;
        }

        /* Corner decorations */
        .corner-deco {
          position: absolute;
          width: 60px;
          height: 60px;
          pointer-events: none;
        }
        .corner-deco.tl { top: 32px; left: 32px; border-top: 1px solid rgba(100,140,255,0.3); border-left: 1px solid rgba(100,140,255,0.3); }
        .corner-deco.tr { top: 32px; right: 32px; border-top: 1px solid rgba(100,140,255,0.3); border-right: 1px solid rgba(100,140,255,0.3); }
        .corner-deco.bl { bottom: 32px; left: 32px; border-bottom: 1px solid rgba(100,140,255,0.3); border-left: 1px solid rgba(100,140,255,0.3); }
        .corner-deco.br { bottom: 32px; right: 32px; border-bottom: 1px solid rgba(100,140,255,0.3); border-right: 1px solid rgba(100,140,255,0.3); }

        /* Cursor glow */
        .cursor-glow {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,124,255,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
          transform: translate(-50%, -50%);
          transition: left 0.1s, top 0.1s;
        }

        /* Scanline overlay */
        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.03) 3px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
        }

        /* Genre tags */
        .genre-tags {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 40px;
          animation: fadeUp 1s 0.3s ease both;
        }
        .genre-tag {
          padding: 5px 14px;
          border: 1px solid rgba(100,140,255,0.2);
          border-radius: 1px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(150,180,255,0.5);
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .genre-tag:hover {
          color: #fff;
          border-color: rgba(100,140,255,0.6);
          background: rgba(100,140,255,0.08);
        }

        /* bottom scroll hint */
        .scroll-hint {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(150,180,255,0.35);
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          animation: fadeUp 1s 1s ease both;
        }
        .scroll-hint-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(100,140,255,0.4));
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          40% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          80% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
        }
      `}</style>

      <div className="hero-root" onMouseMove={handleMouseMove}>
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-overlay" />
        <div className="hero-grid" />
        <div className="scanlines" />

        {/* Cursor glow */}
        <div
          className="cursor-glow"
          style={{ left: mousePos.x, top: mousePos.y }}
        />

        {/* Corner decorations */}
        <div className="corner-deco tl" />
        <div className="corner-deco tr" />
        <div className="corner-deco bl" />
        <div className="corner-deco br" />

        {/* Floating book spines */}
        {mounted && FLOATING_BOOKS.map((book, i) => (
          <div
            key={i}
            className="book-spine"
            style={{
              left: book.x,
              top: book.y,
              height: `${80 + (i % 3) * 30}px`,
              background: `linear-gradient(135deg, ${book.color}cc, ${book.color}88)`,
              "--angle": `${book.angle}deg`,
              zIndex: book.z,
              animationDelay: `${i * 0.9}s`,
            } as React.CSSProperties}
          >
            <span className="spine-title">{book.title}</span>
          </div>
        ))}

        {/* Main content */}
        <div className="hero-content">
          <div className="hero-eyebrow">Digital Archive</div>

          <h1 className="hero-title">
            Every Story<br />
            <span className="word-alt">Ever Told</span>
          </h1>

          <p className="hero-subtitle-line">
            A sanctuary for the curious mind — ten thousand worlds, one place.
          </p>

          {/* Genre tags */}
          <div className="genre-tags">
            {["Sci-Fi", "Philosophy", "Fiction", "History", "Poetry", "Mystery"].map(g => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>

          {/* Search */}
          <div className="hero-search">
            <span className="search-icon">⌕</span>
            <input type="text" placeholder="Search titles, authors, genres..." />
            <button className="search-btn">Search</button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { num: "48K+", label: "Titles" },
              { num: "12K", label: "Authors" },
              { num: "320", label: "Genres" },
              { num: "99%", label: "Free" },
            ].map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-ctas">
            <a href="#books" className="cta-primary">
              <span>↓</span> Explore Collection
            </a>
            <a href="/admin" className="cta-ghost">
              <span>⊞</span> Admin Panel
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-hint-line" />
        </div>
      </div>
    </>
  );
}