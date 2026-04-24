"use client";

import { Book } from "@/lib/services/bookService";
import AdminActionButtons from "./AdminActionButtons";

// Color palette for book covers — matches Hero's accent palette
const COVER_PALETTES = [
  { bg: "linear-gradient(135deg, #4f7cff 0%, #9f46e4 100%)", accent: "#7eb3ff" },
  { bg: "linear-gradient(135deg, #c9a84c 0%, #e67e22 100%)", accent: "#f5c97a" },
  { bg: "linear-gradient(135deg, #e05252 0%, #9b59b6 100%)", accent: "#f472b6" },
  { bg: "linear-gradient(135deg, #3a7bd5 0%, #4caf8a 100%)", accent: "#7eb3ff" },
  { bg: "linear-gradient(135deg, #9f46e4 0%, #e05252 100%)", accent: "#c084fc" },
  { bg: "linear-gradient(135deg, #4caf8a 0%, #3a7bd5 100%)", accent: "#5ddbb0" },
];

function getCoverPalette(id: number | string) {
  const n = typeof id === "number" ? id : parseInt(String(id), 10) || 0;
  return COVER_PALETTES[n % COVER_PALETTES.length];
}

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

export default function BookCard({ book, onEdit, onDelete, isAdmin = false }: BookCardProps) {
  const palette = getCoverPalette(book.id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Space+Mono:wght@400;700&display=swap');

        .book-card {
          position: relative;
          width: 140px;
          cursor: pointer;
          group: book;
          transition: transform 0.3s ease;
        }
        .book-card:hover { transform: translateY(-8px); }

        /* Book cover */
        .book-cover {
          position: relative;
          width: 140px;
          height: 196px;
          border-radius: 3px 6px 6px 3px;
          overflow: hidden;
          box-shadow:
            -4px 0 8px rgba(0,0,0,0.5),
            4px 4px 20px rgba(0,0,0,0.4),
            inset -3px 0 8px rgba(0,0,0,0.3);
          margin-bottom: 10px;
          transition: box-shadow 0.3s ease;
        }
        .book-card:hover .book-cover {
          box-shadow:
            -4px 0 8px rgba(0,0,0,0.5),
            8px 12px 32px rgba(0,0,0,0.5),
            0 0 30px rgba(79,124,255,0.2),
            inset -3px 0 8px rgba(0,0,0,0.3);
        }

        .book-cover-bg {
          position: absolute;
          inset: 0;
        }
        .book-cover-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 12px 12px;
        }
        .book-cover-spine {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 10px;
          background: rgba(0,0,0,0.35);
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .book-cover-content {
          position: absolute;
          inset: 0;
          padding: 14px 12px 12px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .book-cover-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .book-cover-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
          word-break: break-word;
        }
        .book-cover-author {
          font-family: 'Space Mono', monospace;
          font-size: 7.5px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
          font-style: italic;
        }
        .book-cover-deco-line {
          position: absolute;
          bottom: 28px;
          left: 18px;
          right: 12px;
          height: 1px;
          background: rgba(255,255,255,0.2);
        }

        /* Hover overlay */
        .book-cover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(79,124,255,0.15);
          opacity: 0;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .book-card:hover .book-cover-overlay { opacity: 1; }
        .book-cover-overlay-icon {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          background: rgba(0,0,0,0.5);
          padding: 6px 10px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 1px;
        }

        /* Metadata */
        .book-meta-title {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(200,215,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 3px;
          letter-spacing: 0.02em;
        }
        .book-meta-author {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          color: rgba(150,175,255,0.45);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.05em;
          font-style: italic;
        }
      `}</style>

      <div className="book-card">
        <div className="book-cover">
          <div
            className="book-cover-bg"
            style={{ background: palette.bg }}
          />
          <div className="book-cover-grid" />
          <div className="book-cover-spine" />
          <div className="book-cover-deco-line" />
          <div className="book-cover-content">
            <span className="book-cover-eyebrow">Vol. {book.id}</span>
            <div>
              <p className="book-cover-title">{book.title}</p>
            </div>
            <span className="book-cover-author">{book.author}</span>
          </div>
          <div className="book-cover-overlay">
            {isAdmin && onEdit && onDelete ? (
              <AdminActionButtons book={book} onEdit={onEdit} onDelete={onDelete} />
            ) : null}
          </div>
        </div>

        <div className="book-meta-title">{book.title}</div>
        <div className="book-meta-author">{book.author}</div>
      </div>
    </>
  );
}