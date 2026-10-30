'use client';

import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { CommandPalette } from './CommandPalette';
import { Menu, X, Activity } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

const NAV_LINKS = [
  { label: 'About', href: '#about', index: '02' },
  { label: 'Practice', href: '#practice', index: '03' },
  { label: 'Work', href: '#work', index: '05' },
  { label: 'Certificates', href: '#certificates', index: '06' },
  { label: 'Contact', href: '#contact', index: '10' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [addisTime, setAddisTime] = useState<string>('');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Addis Ababa Live Time (UTC+3)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Africa/Addis_Ababa',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setAddisTime(timeStr);
      } catch {
        setAddisTime('09:15 AM');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['top', 'about', 'practice', 'now', 'work', 'certificates', 'lab', 'education', 'skills', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-25% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-hairline py-3'
            : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand & Specimen Code */}
          <div className="flex items-center space-x-3">
            <a
              href="#top"
              className="text-sm font-extrabold tracking-tight hover:opacity-80 transition-opacity flex items-center space-x-2"
            >
              <span className="font-mono text-accent text-xs font-bold">[ML]</span>
              <span className="font-extrabold tracking-widest text-foreground">MINTESNOT</span>
            </a>

            {/* Live Addis Ababa Time Chip */}
            <div className="hidden sm:inline-flex items-center space-x-2 px-2.5 py-1 text-[11px] font-mono border border-hairline bg-background-alt text-foreground-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>ADDIS ABABA {addisTime || 'EAT'}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden md:flex items-center space-x-7 text-xs font-mono uppercase tracking-wider">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-150 relative py-1 flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-foreground font-bold'
                      : 'text-foreground-muted hover:text-foreground'
                  }`}
                >
                  <span className="text-[9px] text-accent font-semibold">{link.index}</span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Command Palette & Theme Toggle */}
          <div className="flex items-center space-x-3">
            <CommandPalette />
            <ThemeToggle />

            {/* Mobile Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              className="md:hidden p-2 text-foreground rounded-none border border-hairline hover:bg-background-alt"
            >
              <span className="sr-only">Menu</span>
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav"
            className="md:hidden fixed inset-x-0 top-[57px] bg-background border-b border-hairline px-6 py-8 shadow-2xl transition-all"
          >
            <nav className="flex flex-col space-y-4 font-mono text-sm uppercase tracking-wider">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-foreground hover:text-accent transition-colors py-2 border-b border-hairline/60"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-accent font-bold">{link.index}</span>
                </a>
              ))}
            </nav>
            {addisTime && (
              <p className="mt-6 text-[11px] font-mono text-foreground-muted flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Addis Ababa, ET — {addisTime} (GMT+3)</span>
              </p>
            )}
          </div>
        )}
      </header>
    </>
  );
}
