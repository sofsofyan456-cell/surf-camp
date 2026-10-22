// filepath: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "../config/site";
import Link from "next/link";
import Navbar from "../components/Navbar"; // <-- Import our new Navbar!

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
<html lang="en" data-scroll-behavior="smooth">      <body className={`${inter.className} bg-sand-50 text-ocean-900 antialiased min-h-screen flex flex-col`}>
        
        {/* We use our new responsive Navbar component here */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="flex-grow">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-ocean-900 text-sand-200 py-10 text-center mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-2xl font-bold text-white mb-2">{siteConfig.name}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
              <Link href="/about" className="hover:text-white">About Us</Link>
              <Link href="/activities" className="hover:text-white">Activities</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
            <p className="mb-6 text-sm text-gray-400">{siteConfig.contact.address}</p>
            
            <p className="text-sm opacity-70">
              © 2026 {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}