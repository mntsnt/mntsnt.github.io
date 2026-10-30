'use client';

import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'What I do', href: '#practice', id: 'practice' },
  { label: 'Currently', href: '#currently', id: 'currently' },
  { label: 'Selected work', href: '#work', id: 'work' },
  { label: 'Certificates', href: '#certificates', id: 'certificates' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['top', 'about', 'practice', 'currently', 'work', 'certificates', 'lab', 'education', 'skills', 'contact'];
      const scrollPos = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border transition-colors duration-150">
      <div className="max-w-site mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Name */}
        <a
          href="#top"
          className="text-base font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          Mintesnot Leliso
        </a>

        {/* Right: Desktop Navigation */}
        <nav aria-label="Primary" className="hidden md:flex items-center space-x-6">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-150 py-1 ${
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pl-2 border-l border-border">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile: Controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors duration-150"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-border bg-background px-6 py-3 flex flex-col space-y-1"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`min-h-[44px] flex items-center text-sm transition-colors duration-150 border-b border-border/50 last:border-0 ${
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
