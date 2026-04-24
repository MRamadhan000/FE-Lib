"use client";

import { useEffect, useState } from "react";
import { Book, getAllBooks } from "@/lib/services/bookService";
import BookCard from "./BookCard";

const GENRES = ["All", "Sci-Fi", "Philosophy", "Fiction", "History", "Poetry", "Mystery"];
const ITEMS_PER_PAGE = 10;

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchBooks(); }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = books.filter(
      (b) =>
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [searchQuery, books, activeGenre]);

  async function fetchBooks() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError("Failed to fetch books. Please make sure the API is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Space+Mono:wght@400;700&family=Crimson+Pro:ital,wght@0,300;1,300&display=swap');

        .bl-root {
          background: #070b14;
          min-height: 60vh;
          padding: 120px 24px;
          font-family: 'Space Mono', monospace;
          position: relative;
        }

        /* Grid texture (same as Hero) */
        .bl-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(100,120,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,120,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .bl-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Section header */
        .bl-header {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 48px;
          animation: blFadeUp 0.8s ease both;
        }

        @keyframes blFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bl-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #6b9dff;
        }
        .bl-eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #6b9dff);
        }

        .bl-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .bl-title em {
          font-style: italic;
          font-weight: 400;
          background: linear-gradient(135deg, #7eb3ff 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bl-subtitle {
          font-family: 'Crimson Pro', Georgia, serif;
          font-size: 16px;
          font-style: italic;
          color: rgba(180,200,255,0.45);
          margin: 0;
          letter-spacing: 0.03em;
        }

        /* Controls row */
        .bl-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          animation: blFadeUp 0.8s 0.1s ease both;
        }

        /* Genre filters */
        .bl-genres {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .bl-genre-btn {
          padding: 5px 14px;
          border: 1px solid rgba(100,140,255,0.2);
          border-radius: 1px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(150,180,255,0.5);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .bl-genre-btn:hover {
          color: #fff;
          border-color: rgba(100,140,255,0.6);
          background: rgba(100,140,255,0.08);
        }
        .bl-genre-btn.active {
          color: #fff;
          border-color: rgba(100,140,255,0.7);
          background: rgba(100,140,255,0.12);
        }

        /* Search */
        .bl-search {
          position: relative;
          width: 260px;
        }
        .bl-search input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(100,140,255,0.2);
          border-radius: 2px;
          padding: 10px 16px 10px 40px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #fff;
          outline: none;
          box-sizing: border-box;
          letter-spacing: 0.05em;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .bl-search input::placeholder { color: rgba(150,170,220,0.35); }
        .bl-search input:focus {
          border-color: rgba(100,140,255,0.6);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(100,140,255,0.1);
        }
        .bl-search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: rgba(100,140,255,0.5);
          pointer-events: none;
        }

        /* Divider */
        .bl-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(100,140,255,0.2), transparent);
          margin-bottom: 40px;
        }

        /* Book grid */
        .bl-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 28px 24px;
          margin-bottom: 56px;
          animation: blFadeUp 0.8s 0.2s ease both;
        }

        /* Loading spinner */
        .bl-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          gap: 12px;
          color: rgba(100,140,255,0.5);
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }
        .bl-spinner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6b9dff;
          animation: blPulse 1.2s ease-in-out infinite;
        }
        .bl-spinner-dot:nth-child(2) { animation-delay: 0.2s; }
        .bl-spinner-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        /* Empty state */
        .bl-empty {
          text-align: center;
          padding: 60px 20px;
          color: rgba(150,175,255,0.35);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        /* Error */
        .bl-error {
          border: 1px solid rgba(224,82,82,0.3);
          background: rgba(224,82,82,0.06);
          color: rgba(255,120,120,0.8);
          padding: 12px 16px;
          font-size: 11px;
          border-radius: 2px;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
        }

        /* Pagination */
        .bl-pagination {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: blFadeUp 0.8s 0.3s ease both;
        }
        .bl-page-info {
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(150,175,255,0.35);
        }
        .bl-page-controls {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .bl-page-btn {
          height: 32px;
          min-width: 32px;
          padding: 0 10px;
          background: transparent;
          border: 1px solid rgba(100,140,255,0.2);
          border-radius: 1px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(150,175,255,0.6);
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }
        .bl-page-btn:hover:not(:disabled) {
          color: #fff;
          border-color: rgba(100,140,255,0.6);
          background: rgba(100,140,255,0.08);
        }
        .bl-page-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .bl-page-btn.active {
          color: #fff;
          border-color: rgba(100,140,255,0.7);
          background: linear-gradient(135deg, rgba(79,124,255,0.25), rgba(159,70,228,0.2));
        }

        /* Bottom rule */
        .bl-bottom-rule {
          margin-top: 64px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: rgba(100,140,255,0.2);
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        .bl-bottom-rule::before,
        .bl-bottom-rule::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(100,140,255,0.12);
        }
      `}</style>

      <section id="books" className="bl-root">
        <div className="bl-inner">

          {/* Section header */}
          <div className="bl-header">
            <span className="bl-eyebrow">Collection</span>
            <h2 className="bl-title">
              The <em>Archive</em>
            </h2>
            <p className="bl-subtitle">
              Every volume, catalogued for the restless mind.
            </p>
          </div>

          {/* Controls */}
          <div className="bl-controls">
            <div className="bl-genres">
              {GENRES.map((g) => (
                <button
                  key={g}
                  className={`bl-genre-btn${activeGenre === g ? " active" : ""}`}
                  onClick={() => setActiveGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="bl-search">
              <span className="bl-search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search titles, authors…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bl-divider" />

          {/* Error */}
          {error && <div className="bl-error">{error}</div>}

          {/* Loading */}
          {loading && (
            <div className="bl-spinner">
              <div className="bl-spinner-dot" />
              <div className="bl-spinner-dot" />
              <div className="bl-spinner-dot" />
              <span>Loading archive</span>
            </div>
          )}

          {/* Empty states */}
          {!loading && books.length === 0 && !error && (
            <div className="bl-empty">No volumes in the archive.</div>
          )}
          {!loading && filteredBooks.length === 0 && books.length > 0 && (
            <div className="bl-empty">No results for "{searchQuery}"</div>
          )}

          {/* Grid */}
          {!loading && currentBooks.length > 0 && (
            <div className="bl-grid">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="bl-pagination">
              <span className="bl-page-info">
                {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredBooks.length)} of {filteredBooks.length} volumes
              </span>
              <div className="bl-page-controls">
                <button
                  className="bl-page-btn"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`bl-page-btn${currentPage === page ? " active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="bl-page-btn"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          <div className="bl-bottom-rule">End of collection</div>
        </div>
      </section>
    </>
  );
}