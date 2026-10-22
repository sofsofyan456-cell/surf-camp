// filepath: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "../config/site";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${siteConfig.name} | Surf & Stay`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-sand-50 text-ocean-900 antialiased min-h-screen flex flex-col`}>
        
        {/* HEADER (Navbar) */}
        <header className="bg-ocean-800 text-white py-4 shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-turquoise-400 transition-colors">
              <span>🏄‍♂️</span> {siteConfig.shortName}
            </Link>
            
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex gap-6 items-center">
              <Link href="/" className="hover:text-turquoise-400 transition-colors font-medium">Home</Link>
              <Link href="/#rooms" className="hover:text-turquoise-400 transition-colors font-medium">Rooms</Link>
              <Link href="/activities" className="hover:text-turquoise-400 transition-colors font-medium">Activities</Link>
              <Link href="/about" className="hover:text-turquoise-400 transition-colors font-medium">About</Link>
              <Link href="/contact" className="bg-turquoise-500 hover:bg-turquoise-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden text-sm font-bold text-turquoise-400">
              <Link href="/contact">Menu</Link>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-grow">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-ocean-900 text-sand-200 py-10 text-center mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-2xl font-bold text-white mb-2">{siteConfig.name}</p>
            <div className="flex justify-center gap-4 mb-4 text-sm">
              <Link href="/about" className="hover:text-white">About Us</Link>
              <Link href="/activities" className="hover:text-white">Activities</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
            <p className="mb-6 text-sm text-gray-400">{siteConfig.contact.address}</p>
            
            {/* FIX IS HERE: We removed the new Date() and just typed 2026 */}
            <p className="text-sm opacity-70">
              © 2026 {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}