'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Book,
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from '@/lib/services/bookService';
import BookCard from '@/app/components/BookCard';
import BookModal from '@/app/components/BookModal';

interface FormData {
  title: string;
  author: string;
  description: string;
  img: string;
}

export default function AdminPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: '',
    description: '',
    img: '',
  });

  useEffect(() => {
    setMounted(true);
    fetchBooks();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; hue: number;
    }[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.08,
        hue: Math.random() * 60 + 200,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.004;

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

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.3 + i * 0.2));
        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            canvas.height * (0.3 + i * 0.2) +
            Math.sin(x * 0.008 + t + i) * 30 +
            Math.sin(x * 0.003 + t * 0.7) * 50;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${220 + i * 30 + t * 10}, 80%, 65%, 0.04)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  async function fetchBooks() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (!formData.title || !formData.author || !formData.description) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        const result = await updateBook(editingId, formData);
        if (result) {
          setSuccess('Book updated successfully!');
          setBooks(books.map((b) => (b.id === editingId ? result : b)));
          setEditingId(null);
        } else {
          setError('Failed to update book');
        }
      } else {
        const result = await createBook(formData);
        if (result) {
          setSuccess('Book created successfully!');
          setBooks([...books, result]);
        } else {
          setError('Failed to create book');
        }
      }
      setFormData({ title: '', author: '', description: '', img: '' });
      setShowForm(false);
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(book: Book) {
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      img: book.img || '',
    });
    setEditingId(book.id);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', author: '', description: '', img: '' });
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      const ok = await deleteBook(id);
      if (ok) {
        setBooks(books.filter((b) => b.id !== id));
        setSuccess('Book deleted successfully!');
      } else {
        setError('Failed to delete book');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    }
  }

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Space+Mono:wght@400;700&family=Crimson+Pro:ital,wght@0,300;1,300&display=swap');

        .adm-root {
          position: relative;
          min-height: 100vh;
          background: #070b14;
          font-family: 'Space Mono', monospace;
          color: #fff;
          overflow-x: hidden;
        }

        .adm-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .adm-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(100,120,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,120,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .adm-scanlines {
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.025) 3px,
            rgba(0,0,0,0.025) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        .cursor-glow {
          position: fixed;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,124,255,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
          transform: translate(-50%, -50%);
          transition: left 0.1s, top 0.1s;
        }

        .corner-deco {
          position: fixed;
          width: 52px;
          height: 52px;
          pointer-events: none;
          z-index: 3;
        }
        .corner-deco.tl { top: 24px; left: 24px; border-top: 1px solid rgba(100,140,255,0.28); border-left: 1px solid rgba(100,140,255,0.28); }
        .corner-deco.tr { top: 24px; right: 24px; border-top: 1px solid rgba(100,140,255,0.28); border-right: 1px solid rgba(100,140,255,0.28); }
        .corner-deco.bl { bottom: 24px; left: 24px; border-bottom: 1px solid rgba(100,140,255,0.28); border-left: 1px solid rgba(100,140,255,0.28); }
        .corner-deco.br { bottom: 24px; right: 24px; border-bottom: 1px solid rgba(100,140,255,0.28); border-right: 1px solid rgba(100,140,255,0.28); }

        /* ── Header ── */
        .adm-header {
          position: relative;
          z-index: 5;
          border-bottom: 1px solid rgba(100,140,255,0.14);
          background: rgba(7,11,20,0.88);
          backdrop-filter: blur(16px);
          padding: 0 48px;
        }

        .adm-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0 16px;
        }

        .adm-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .adm-brand-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #4f7cff, #9f46e4);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }

        .adm-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.01em;
          color: #fff;
        }

        .adm-brand-sub {
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(150,180,255,0.4);
          margin-top: 2px;
        }

        .adm-header-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .adm-nav-btn {
          padding: 8px 16px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(150,180,255,0.5);
          background: transparent;
          border: 1px solid transparent;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .adm-nav-btn:hover {
          color: #fff;
          border-color: rgba(100,140,255,0.3);
          background: rgba(100,140,255,0.06);
        }
        .adm-nav-btn.back {
          color: rgba(150,180,255,0.5);
          border-color: rgba(100,140,255,0.18);
        }

        .adm-header-stats {
          display: flex;
          gap: 0;
          border-top: 1px solid rgba(100,140,255,0.1);
          padding: 12px 0;
        }

        .adm-stat {
          padding: 0 28px 0 0;
          margin-right: 28px;
          border-right: 1px solid rgba(100,140,255,0.1);
        }
        .adm-stat:last-child {
          border-right: none;
        }

        .adm-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          display: block;
          line-height: 1;
          margin-bottom: 3px;
        }

        .adm-stat-label {
          font-size: 8px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(150,180,255,0.38);
        }

        /* ── Main ── */
        .adm-main {
          position: relative;
          z-index: 5;
          padding: 36px 48px 80px;
        }

        /* ── Toolbar ── */
        .adm-toolbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .adm-eyebrow {
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #6b9dff;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .adm-eyebrow::after {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, #6b9dff, transparent);
        }

        .adm-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1;
          color: #fff;
        }
        .adm-page-title em {
          font-style: italic;
          font-weight: 400;
          background: linear-gradient(135deg, #7eb3ff 0%, #c084fc 55%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .adm-toolbar-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .adm-search {
          position: relative;
        }
        .adm-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(100,140,255,0.5);
          font-size: 16px;
          pointer-events: none;
        }
        .adm-search input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(100,140,255,0.2);
          border-radius: 2px;
          padding: 10px 14px 10px 38px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #fff;
          outline: none;
          width: 230px;
          letter-spacing: 0.04em;
          transition: all 0.2s;
        }
        .adm-search input::placeholder { color: rgba(150,170,220,0.35); }
        .adm-search input:focus {
          border-color: rgba(100,140,255,0.55);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(100,140,255,0.08);
        }

        .btn-add-book {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: linear-gradient(135deg, #4f7cff, #9f46e4);
          color: #fff;
          border: none;
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(79,124,255,0.28);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        .btn-add-book::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-add-book:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(79,124,255,0.42);
        }
        .btn-add-book:hover::before { opacity: 1; }

        /* ── Alerts ── */
        .adm-alert {
          margin-bottom: 24px;
          padding: 14px 18px;
          border-radius: 2px;
          font-size: 12px;
          letter-spacing: 0.04em;
        }
        .adm-alert.error {
          background: rgba(220,60,60,0.1);
          border: 1px solid rgba(220,60,60,0.25);
          color: rgba(255,120,120,0.9);
        }
        .adm-alert.success {
          background: rgba(79,200,120,0.08);
          border: 1px solid rgba(79,200,120,0.25);
          color: rgba(100,220,150,0.9);
        }

        /* ── Books grid section label ── */
        .adm-books-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .adm-books-count {
          font-family: 'Crimson Pro', Georgia, serif;
          font-size: 15px;
          font-style: italic;
          color: rgba(150,180,255,0.45);
          letter-spacing: 0.04em;
        }

        /* ── Loading ── */
        .adm-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          gap: 16px;
        }
        .adm-spinner {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(100,140,255,0.15);
          border-top-color: #6b9dff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .adm-loading-text {
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(150,180,255,0.35);
        }

        /* ── Empty state ── */
        .adm-empty {
          text-align: center;
          padding: 80px 20px;
          border: 1px dashed rgba(100,140,255,0.14);
          border-radius: 3px;
        }
        .adm-empty p {
          font-family: 'Crimson Pro', Georgia, serif;
          font-style: italic;
          font-size: 18px;
          color: rgba(150,180,255,0.35);
          margin-bottom: 24px;
        }

        /* ── Books grid ── */
        .adm-books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        /* ── Scroll hint ── */
        .adm-scroll-hint {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(150,180,255,0.28);
          font-size: 8px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          pointer-events: none;
          z-index: 2;
        }
        .adm-scroll-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, transparent, rgba(100,140,255,0.35));
          animation: scrollLine 2.2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          40% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          80% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
        }
      `}</style>

      <div
        className="adm-root"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {/* Background layers */}
        <canvas ref={canvasRef} className="adm-canvas" />
        <div className="adm-grid" />
        <div className="adm-scanlines" />

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

        {/* ── Header ── */}
        <header className="adm-header">
          <div className="adm-header-top">
            <div className="adm-brand">
              <div className="adm-brand-icon">⊞</div>
              <div>
                <div className="adm-brand-name">Archive</div>
                <div className="adm-brand-sub">Admin Control</div>
              </div>
            </div>
            <nav className="adm-header-nav">
              <Link href="/" className="adm-nav-btn back">
                ← Back to Home
              </Link>
            </nav>
          </div>

          <div className="adm-header-stats">
            <div className="adm-stat">
              <span className="adm-stat-num">{books.length}</span>
              <span className="adm-stat-label">Total Books</span>
            </div>
            <div className="adm-stat">
              <span className="adm-stat-num">
                {new Set(books.map((b) => b.author)).size}
              </span>
              <span className="adm-stat-label">Authors</span>
            </div>
            <div className="adm-stat">
              <span className="adm-stat-num">{filteredBooks.length}</span>
              <span className="adm-stat-label">Showing</span>
            </div>
            <div className="adm-stat">
              <span className="adm-stat-num">99%</span>
              <span className="adm-stat-label">Free Access</span>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="adm-main">
          {/* Toolbar */}
          <div className="adm-toolbar">
            <div>
              <div className="adm-eyebrow">Collection</div>
              <h1 className="adm-page-title">
                Manage <em>Books</em>
              </h1>
            </div>
            <div className="adm-toolbar-controls">
              <div className="adm-search">
                <span className="adm-search-icon">⌕</span>
                <input
                  type="text"
                  placeholder="Search titles, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="btn-add-book"
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({ title: '', author: '', description: '', img: '' });
                }}
              >
                + Add Book
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && <div className="adm-alert error">{error}</div>}
          {success && <div className="adm-alert success">{success}</div>}

          {/* Modal — your existing component, untouched */}
          <BookModal
            isOpen={showForm}
            onClose={handleCancel}
            onSubmit={handleSubmit}
            formData={formData}
            onInputChange={handleInputChange}
            editingId={editingId}
            loading={submitting}
          />

          {/* Loading */}
          {loading && (
            <div className="adm-loading">
              <div className="adm-spinner" />
              <span className="adm-loading-text">Loading archive...</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && books.length === 0 && (
            <div className="adm-empty">
              <p>The archive is empty. Add the first book.</p>
              <button
                className="btn-add-book"
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({ title: '', author: '', description: '', img: '' });
                }}
              >
                + Add First Book
              </button>
            </div>
          )}

          {/* Books */}
          {!loading && books.length > 0 && (
            <>
              <div className="adm-books-header">
                <div className="adm-books-count">
                  {filteredBooks.length === books.length
                    ? `${books.length} title${books.length !== 1 ? 's' : ''} in collection`
                    : `${filteredBooks.length} of ${books.length} titles`}
                </div>
              </div>
              <div className="adm-books-grid">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isAdmin={true}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* Scroll hint */}
        <div className="adm-scroll-hint">
          <span>Scroll</span>
          <div className="adm-scroll-line" />
        </div>
      </div>
    </>
  );
}