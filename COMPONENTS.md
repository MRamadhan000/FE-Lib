# Component Documentation

## Overview

This document describes all React components in the Lib Aspire app.

---

## Components

### 1. Navbar
**File**: `app/components/Navbar.tsx`

Sticky navigation bar at the top of the page.

**Features**:
- Logo with gradient background
- Links to Books section and Admin page
- Search box (toggleable)
- Theme toggle button (sun/moon icon)
- Responsive design (hidden menu on mobile)

**Usage**:
```tsx
import Navbar from '@/app/components/Navbar';

export default function Layout() {
  return (
    <>
      <Navbar />
      {/* page content */}
    </>
  );
}
```

**Props**: None (uses internal state and context)

---

### 2. Footer
**File**: `app/components/Footer.tsx`

Footer component with links and information.

**Features**:
- About section
- Quick links
- Contact information
- Copyright
- Responsive grid layout

**Usage**:
```tsx
import Footer from '@/app/components/Footer';

export default function Layout() {
  return (
    <>
      {/* page content */}
      <Footer />
    </>
  );
}
```

**Props**: None (static content)

---

### 3. Hero
**File**: `app/components/Hero.tsx`

Hero section with welcome message and features.

**Features**:
- Gradient icon
- Welcome heading
- Feature cards (3 columns)
- CTA buttons
- Responsive design

**Usage**:
```tsx
import Hero from '@/app/components/Hero';

export default function Home() {
  return <Hero />;
}
```

**Props**: None (static content)

---

### 4. BookCard
**File**: `app/components/BookCard.tsx`

Card component to display individual book.

**Props**:
```typescript
interface BookCardProps {
  book: Book;              // Book object
  onEdit?: (book: Book) => void;    // Edit callback
  onDelete?: (id: number) => void;  // Delete callback
  isAdmin?: boolean;       // Show edit/delete buttons (default: false)
}
```

**Features**:
- Book cover image (with fallback)
- Title and author
- Description (truncated)
- Edit/Delete buttons (admin mode)
- Hover effect

**Usage**:
```tsx
import BookCard from '@/app/components/BookCard';
import { Book } from '@/lib/services/bookService';

function MyComponent({ books }: { books: Book[] }) {
  const handleEdit = (book: Book) => {
    console.log('Edit:', book);
  };

  const handleDelete = (id: number) => {
    console.log('Delete:', id);
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={true}
        />
      ))}
    </div>
  );
}
```

---

### 5. BookList
**File**: `app/components/BookList.tsx`

Fetches and displays all books from API.

**Features**:
- Fetches books on mount
- Loading state with spinner
- Error handling
- Empty state
- Responsive grid (1-2-4 columns)

**Usage**:
```tsx
import BookList from '@/app/components/BookList';

export default function Home() {
  return <BookList />;
}
```

**Props**: None (uses API service internally)

**State**:
- `books` - Array of books
- `loading` - Loading state
- `error` - Error message

---

## Services

### BookService
**File**: `lib/services/bookService.ts`

API service for book operations.

**Types**:
```typescript
interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  img?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

**Functions**:
```typescript
// Get all books
getAllBooks(): Promise<Book[]>

// Get single book
getBook(id: number): Promise<Book | null>

// Create new book
createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<Book | null>

// Update book
updateBook(id: number, book: Partial<Book>): Promise<Book | null>

// Delete book
deleteBook(id: number): Promise<boolean>
```

**Usage**:
```tsx
import { getAllBooks, createBook } from '@/lib/services/bookService';

// Get all books
const books = await getAllBooks();

// Create new book
const newBook = await createBook({
  title: 'My Book',
  author: 'Author Name',
  description: 'Book description',
  img: 'https://example.com/image.jpg'
});

// Update book
const updated = await updateBook(1, {
  title: 'Updated Title'
});

// Delete book
const success = await deleteBook(1);
```

---

## Context

### ThemeContext
**File**: `lib/context/ThemeContext.tsx`

Manages dark/light theme state.

**Provider**:
```tsx
import { ThemeProvider } from '@/lib/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* app content */}
    </ThemeProvider>
  );
}
```

**Hook**:
```tsx
import { useTheme } from '@/lib/context/ThemeContext';

export default function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      Current theme: {theme}
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

**Features**:
- Theme persistence in localStorage
- CSS class applied to html element
- `dark:` prefix support in Tailwind

---

## Styling Guidelines

### Color Scheme

**Light Mode**:
- Background: White
- Text: Dark gray/black
- Borders: Light gray

**Dark Mode**:
- Background: Slate-900 (`#0f172a`)
- Text: White/light gray
- Borders: Dark slate

### Tailwind Classes

Use these patterns:
```tsx
// Light mode (default)
<div className="bg-white text-gray-900">
  Light mode
</div>

// Dark mode
<div className="dark:bg-slate-800 dark:text-white">
  Dark mode variant
</div>

// Both
<div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
  Responsive to theme
</div>
```

### Spacing & Layout

- Use Tailwind's spacing scale (p-4, gap-6, etc.)
- Use grid/flex for layouts
- Mobile-first: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

---

## Common Patterns

### Fetching Data
```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetch = async () => {
    setLoading(true);
    try {
      const result = await getAllBooks();
      setData(result);
    } catch (err) {
      setError('Error message');
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

### Forms
```tsx
const [formData, setFormData] = useState({
  title: '',
  author: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await createBook(formData);
  if (result) {
    // Success
  }
};
```

---

## File Checklist

- ✅ `app/components/Navbar.tsx` - Navigation
- ✅ `app/components/Footer.tsx` - Footer
- ✅ `app/components/Hero.tsx` - Hero section
- ✅ `app/components/BookCard.tsx` - Book card
- ✅ `app/components/BookList.tsx` - Book list
- ✅ `lib/services/bookService.ts` - API service
- ✅ `lib/context/ThemeContext.tsx` - Theme provider
- ✅ `app/page.tsx` - Landing page
- ✅ `app/admin/page.tsx` - Admin page
- ✅ `app/layout.tsx` - Root layout
- ✅ `app/globals.css` - Global styles

---

## Next Steps

1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Test theme toggle
4. Test API calls with admin panel
5. Customize styling if needed

---

For questions or improvements, refer to the main README!
