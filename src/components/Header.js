'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/#tattoos', label: 'Tattoos' },
    { href: '/aftercare', label: 'Aftercare' },
    { href: '/faq', label: 'FAQ' },
    { href: '/book', label: 'Book Consult' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Onide Tattoo home" className="relative h-20 w-56">
          <Image
            src="/logo.png"
            alt="Onide Tattoo"
            width={220}
            height={72}
            priority
            className="h-full w-full object-contain object-left"
          />
        </Link>

        <nav className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gray-400 transition">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col items-center gap-4 pb-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="hover:text-gray-400 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}