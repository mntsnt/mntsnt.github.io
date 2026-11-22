'use client';

import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

const MOBILE_NAV_LINKS = [
  { label: 'Selected Work', href: '#work', id: 'work' },
  { label: 'About & Story', href: '#about', id: 'about' },
  { label: 'Focus Matrix', href: '#practice', id: 'practice' },
  { label: 'Certificates', href: '#certificates', id: 'certificates' },
  { label: 'Skills & Toolkit', href: '#skills', id: 'skills' },
  { label: 'Get in Touch', href: '#contact', id: 'contact' },
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
      const sections = ['top', 'work', 'about', 'practice', 'certificates', 'skills', 'education', 'contact'];
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
        {/* Left: Clean Brand Name */}
        <a
          href="#top"
          className="text-sm sm:text-base font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Mintesnot Leliso
        </a>

        {/* Right: Clean, Minimal Navigation */}
        <nav aria-label="Primary" className="hidden sm:flex items-center space-x-6">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-wider transition-colors duration-150 py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          <div className="pl-1 border-l border-border">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-1.5 sm:hidden">
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
          className="sm:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col space-y-1.5"
        >
          {MOBILE_NAV_LINKS.map((link) => {
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
