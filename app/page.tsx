'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookList from './components/BookList';
import FeaturesSection from './components/Features';

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <BookList />
      </main>
    </>
  );
}
