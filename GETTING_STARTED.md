# Getting Started - Complete Integration Guide

Welcome to Lib Aspire! This guide will help you set up and understand the complete system.

## 📋 What You Have

A complete Next.js library app with:
- ✅ Landing page with book showcase
- ✅ Dark/Light mode (default: dark)
- ✅ Admin panel for book management
- ✅ TypeScript type safety
- ✅ Tailwind CSS styling
- ✅ API service layer
- ✅ Minimal, clean design

---

## 🚀 Quick Setup (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Make sure your API is running at http://localhost:8000

# 4. Start the app
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

That's it! 🎉

---

## 📁 What Files Were Created

### Components (Reusable UI Blocks)
```
app/components/
├── Navbar.tsx        - Top navigation with theme toggle
├── Footer.tsx        - Bottom footer
├── Hero.tsx          - Welcome section with features
├── BookCard.tsx      - Individual book display
└── BookList.tsx      - Grid of all books
```

### Pages (Full Pages)
```
app/
├── page.tsx          - Home/Landing page
└── admin/page.tsx    - Admin management page
```

### Services & State (Business Logic)
```
lib/
├── services/bookService.ts      - API calls
└── context/ThemeContext.tsx     - Dark/Light mode
```

---

## 🎨 Features Explained

### 1. Landing Page (/)
Shows:
- Navbar with branding
- Hero section explaining the app
- All books from your API
- Footer with info

Try:
- Click the sun/moon icon to toggle dark mode
- Scroll through books
- Click "Admin" in navbar to manage books

### 2. Admin Page (/admin)
Allows you to:
- ➕ **Add** new books via form
- ✏️ **Edit** existing books
- ❌ **Delete** books
- View all books in admin grid

Try:
- Add a new book with title, author, description, image URL
- Click Edit to modify a book
- Click Delete to remove a book

### 3. Dark/Light Mode
- Toggle with sun/moon icon in navbar
- Default: Dark mode
- Saved to browser storage
- Smooth transitions

---

## 🔌 API Integration

The app calls these endpoints:

```
Your API (Laravel)
http://localhost:8000

GET    /api/books           → Get all books
GET    /api/books/1         → Get one book
POST   /api/books           → Create book
PUT    /api/books/1         → Update book
DELETE /api/books/1         → Delete book
```

**Book object** looks like:
```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  "description": "Description...",
  "img": "https://example.com/image.jpg",
  "created_at": "2024-04-24T10:00:00Z",
  "updated_at": "2024-04-24T10:00:00Z"
}
```

---

## 🛠️ Customization

### Change Colors
Edit `app/globals.css`:
```css
html.dark {
  --background: #0f172a;  /* Change this */
  --foreground: #ededed;  /* Or this */
}
```

### Change API URL
Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api
```

### Add New Component
1. Create `app/components/MyComponent.tsx`
2. Export default function
3. Import and use it

### Modify Logo/Branding
Edit `Navbar.tsx` - Look for the "LA" text and gradient box

---

## 📚 File Guide

| File | What It Does |
|------|-------------|
| `app/page.tsx` | Landing page content |
| `app/admin/page.tsx` | Admin interface |
| `app/layout.tsx` | Overall app layout + theme provider |
| `lib/services/bookService.ts` | Talk to API |
| `lib/context/ThemeContext.tsx` | Dark/light mode logic |
| `app/components/*.tsx` | Reusable UI blocks |
| `app/globals.css` | Global styles |
| `.env.local` | Your API URL (create this) |

---

## ✅ Checklist

- [ ] Ran `npm install`
- [ ] Created `.env.local` with API URL
- [ ] Started API server at `http://localhost:8000`
- [ ] Started Next.js with `npm run dev`
- [ ] Opened `http://localhost:3000`
- [ ] See books loading on home page
- [ ] Toggle dark/light mode works
- [ ] Admin page loads books
- [ ] Can add a test book in admin
- [ ] Can edit a book
- [ ] Can delete a book

---

## 🐛 Troubleshooting

### ❌ "Books are not loading"
- Check API is running: `http://localhost:8000/api/books`
- Check `.env.local` has correct URL
- Check browser console for errors (F12)
- Check Network tab to see API calls

### ❌ "Dark mode doesn't work"
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check if `ThemeProvider` is in `layout.tsx`

### ❌ "Images not showing"
- Check image URL is valid
- Try a different image URL
- Check browser console for CORS errors

### ❌ "Admin form doesn't work"
- Fill in all required fields (title, author, description)
- Check API is running
- Look for error messages on page

---

## 📖 Documentation Files

Read these for more info:

1. **QUICK_START.md** - 5-minute setup
2. **README_LIBRARY.md** - Full documentation
3. **COMPONENTS.md** - Component details
4. **PROJECT_STRUCTURE.md** - File organization

---

## 🎯 Next Steps

1. **Get it running**
   - Follow "Quick Setup" above
   - Make sure books load

2. **Test it**
   - Try adding a book in admin
   - Toggle dark mode
   - Refresh page to test persistence

3. **Customize it**
   - Change colors/styling
   - Modify text/branding
   - Add more pages/components

4. **Deploy it**
   - Run `npm run build`
   - Run `npm start`
   - Deploy to Vercel, Netlify, etc.

---

## 💡 Key Features

✨ **What Makes This Good:**
- Minimal, clean design
- Dark mode built-in
- Type-safe with TypeScript
- Organized file structure
- Easy to customize
- API ready
- Responsive (mobile-friendly)
- Fast performance

---

## 📞 Need Help?

Check these in order:
1. QUICK_START.md - Simple setup
2. COMPONENTS.md - How components work
3. README_LIBRARY.md - Complete reference
4. Browser console (F12) - Error messages
5. Network tab (F12) - API calls

---

## 🚀 Deploy to Production

```bash
# Build
npm run build

# Test production build locally
npm start

# Deploy to Vercel
npm install -g vercel
vercel

# Or push to GitHub and deploy from there
```

---

## 📝 Environment Variables

Create `.env.local`:

```env
# Required - Your API endpoint
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Optional - Add more as needed
# NEXT_PUBLIC_APP_NAME=Lib Aspire
```

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 🎉 You're Ready!

Everything is set up. Now:
1. Customize the design to your liking
2. Add features you need
3. Connect your API
4. Deploy and share!

**Happy coding!** 🚀

---

**Created**: April 2024
**Tech Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
**Features**: 2 Pages + 5 Components + 1 Service + 1 Context Provider
