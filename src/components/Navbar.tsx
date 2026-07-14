'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled ? 'bg-[#050505]/95 shadow-lg' : 'bg-[#050505]/80'
      } border-b border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
            <div className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center bg-gradient-to-br from-gray-700 to-black overflow-hidden shadow-[0_0_10px_rgba(150,150,150,0.3)]">
              <i className="fas fa-car-side text-gray-300 text-xl"></i>
            </div>
            <span className="font-display font-bold text-2xl tracking-wider uppercase text-chrome-effect">
              Audi Motor
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">
              Beranda
            </Link>
            <Link href="/#koleksi" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">
              Koleksi Mobil
            </Link>
            <Link href="/#tentang" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">
              Tentang Kami
            </Link>
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-full border border-gray-500 hover:border-gray-300 hover:bg-gray-800 transition-all text-sm font-medium tracking-wide"
            >
              Admin
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileOpen(false)}>Beranda</Link>
              <Link href="/#koleksi" className="text-gray-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileOpen(false)}>Koleksi Mobil</Link>
              <Link href="/#tentang" className="text-gray-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileOpen(false)}>Tentang Kami</Link>
              <Link href="/admin" className="text-gray-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileOpen(false)}>Admin</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
