// filepath: components/Navbar.tsx
"use client"; // This tells Next.js this part of the site is interactive

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "../config/site";

export default function Navbar() {
  // We use this "state" to remember if the mobile menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Function to close the menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-ocean-800 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-bold flex items-center gap-2 hover:text-turquoise-400 transition-colors"
          onClick={closeMenu}
        >
          <span>🏄‍♂️</span> {siteConfig.shortName}
        </Link>
        
        {/* DESKTOP MENU (Hidden on small screens) */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="hover:text-turquoise-400 transition-colors font-medium">Home</Link>
          <Link href="/#rooms" className="hover:text-turquoise-400 transition-colors font-medium">Rooms</Link>
          <Link href="/activities" className="hover:text-turquoise-400 transition-colors font-medium">Activities</Link>
          <Link href="/about" className="hover:text-turquoise-400 transition-colors font-medium">About</Link>
          <Link href="/contact" className="bg-turquoise-500 hover:bg-turquoise-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Contact
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON (Hidden on desktop) */}
        <button 
          className="md:hidden text-white focus:outline-none p-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {/* We draw a Hamburger Icon with SVG */}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              // X icon when open
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              // 3 lines icon when closed
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden bg-ocean-900 border-t border-ocean-700 absolute w-full left-0 shadow-2xl">
          <nav className="flex flex-col px-6 py-6 gap-6">
            <Link href="/" className="text-xl font-medium hover:text-turquoise-400" onClick={closeMenu}>Home</Link>
            <Link href="/#rooms" className="text-xl font-medium hover:text-turquoise-400" onClick={closeMenu}>Rooms</Link>
            <Link href="/activities" className="text-xl font-medium hover:text-turquoise-400" onClick={closeMenu}>Activities</Link>
            <Link href="/about" className="text-xl font-medium hover:text-turquoise-400" onClick={closeMenu}>About Us</Link>
            <Link href="/contact" className="bg-turquoise-500 text-center text-white px-4 py-4 rounded-lg font-bold text-xl mt-2" onClick={closeMenu}>
              Contact & Book
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}