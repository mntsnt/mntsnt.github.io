'use client';

import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, Search, Command } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Focus', href: '#practice', id: 'practice' },
  { label: 'Selected Work', href: '#work', id: 'work' },
  { label: 'Certificates', href: '#certificates', id: 'certificates' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Reading progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Active section spy
      const sections = ['top', 'about', 'practice', 'currently', 'work', 'certificates', 'lab', 'education', 'skills', 'contact'];
      const scrollPos = window.scrollY + 120;

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

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border transition-colors duration-150">
      {/* 2px Reading Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-foreground transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <div className="max-w-site mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <a
          href="#top"
          className="group flex items-center space-x-2.5 text-foreground hover:opacity-80 transition-opacity"
        >
          <span className="text-base font-semibold tracking-tight">
            Mintesnot Leliso
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded border border-border text-foreground-muted bg-surface/50 group-hover:border-foreground/30 transition-colors">
            Med × Design × Dev
          </span>
        </a>

        {/* Right: Desktop Navigation + Search & Theme */}
        <nav aria-label="Primary" className="hidden md:flex items-center space-x-5">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-wider transition-colors duration-150 py-1 ${
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open Command Menu (⌘K or Ctrl+K)"
            className="min-h-[34px] px-2.5 py-1 rounded-md border border-border hover:border-foreground bg-surface/40 hover:bg-surface text-foreground-muted hover:text-foreground text-xs inline-flex items-center space-x-2 transition-all"
          >
            <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="hidden lg:inline text-[11px]">Search</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-foreground">
              ⌘K
            </kbd>
          </button>

          <div className="pl-1 border-l border-border">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-1.5 md:hidden">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open Command Menu"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-md border border-border text-foreground hover:border-foreground transition-colors"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
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
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col space-y-1.5"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`min-h-[44px] flex items-center justify-between text-sm transition-colors border-b border-border/40 last:border-0 ${
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-xs font-mono text-foreground-muted">→</span>
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
