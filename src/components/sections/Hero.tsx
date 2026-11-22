'use client';

import React, { useState, useEffect } from 'react';
import { HeroData, SocialLinks } from '@/types/portfolio';
import {
  Github,
  Linkedin,
  Send,
  Mail,
  ExternalLink,
  Copy,
  Check,
  ArrowDown,
  Command,
} from 'lucide-react';

interface HeroProps {
  data: HeroData;
  socials: SocialLinks;
}

function AddisAbabaClock() {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Addis_Ababa',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now);
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-xs text-foreground-muted inline-flex items-center space-x-1.5">
      <span>Addis Ababa, ET</span>
      <span className="text-foreground-muted/60">·</span>
      <span className="font-medium text-foreground">{timeStr || 'EAT'}</span>
    </span>
  );
}

export function Hero({ data, socials }: HeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mintesnoh@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <section aria-labelledby="hero-title" id="top" className="py-20 sm:py-28 md:py-32">
      <div className="max-w-site mx-auto px-6">
        {/* Availability Badge & Live Addis Ababa Clock */}
        <div className="inline-flex flex-wrap items-center gap-2.5 sm:gap-3 py-1 px-3 sm:py-1.5 sm:px-3.5 rounded-full border border-border bg-surface/60 text-xs mb-8">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-foreground">Available for new projects</span>
          </div>
          <span className="hidden sm:inline text-border">|</span>
          <AddisAbabaClock />
        </div>

        {/* Name & Dual-Role Heading */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-foreground-muted font-mono font-medium">
            Mintesnot Leliso · Portfolio 2026
          </p>
          <h1
            id="hero-title"
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            Medical student by day.
            <br />
            <span className="text-foreground-muted font-normal">
              Designer & developer by craft.
            </span>
          </h1>
        </div>

        {/* Plain English Subhead */}
        <p className="mt-6 text-base sm:text-lg text-foreground-muted leading-relaxed max-w-[62ch]">
          I study medicine at St. Paul&apos;s (SPHMMC) in Addis Ababa, design brand identities and editorial visuals, and build clean software tools for real-world impact.
        </p>

        {/* Primary Actions */}
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="min-h-[44px] px-6 py-2.5 rounded-md bg-foreground text-background font-medium text-sm inline-flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <span>Explore selected work</span>
            <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
          </a>

          {/* Interactive One-Click Copy Email Pill */}
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label="Copy email address"
            className="group min-h-[44px] px-4 py-2.5 rounded-md border border-border hover:border-foreground bg-surface/40 hover:bg-surface text-foreground transition-all duration-150 inline-flex items-center space-x-2 text-xs font-mono"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
                <span className="text-emerald-500 font-sans font-medium">
                  Copied to clipboard!
                </span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground" strokeWidth={1.5} />
                <span>mintesnoh@gmail.com</span>
                <Copy className="w-3 h-3 text-foreground-muted group-hover:text-foreground opacity-60 group-hover:opacity-100" strokeWidth={1.5} />
              </>
            )}
          </button>

          <a
            href="#contact"
            className="min-h-[44px] px-5 py-2.5 rounded-md border border-border text-foreground font-medium text-sm inline-flex items-center justify-center hover:border-foreground transition-colors"
          >
            Let&apos;s talk
          </a>
        </div>

        {/* Social Links & Command Menu Trigger */}
        <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-md border border-border text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
              >
                <Github className="w-4 h-4" strokeWidth={1.5} />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-md border border-border text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" strokeWidth={1.5} />
              </a>
            )}
            {socials.upwork && (
              <a
                href={socials.upwork}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Upwork Freelancer Profile"
                className="min-h-[40px] px-3 inline-flex items-center space-x-1.5 rounded-md border border-border text-xs font-medium text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
              >
                <span>Upwork</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
              </a>
            )}
            {socials.telegram && (
              <a
                href={socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram Profile"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-md border border-border text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
              </a>
            )}
          </div>

          {/* Quick Keyboard hint */}
          <button
            type="button"
            onClick={openCommandPalette}
            className="text-xs text-foreground-muted hover:text-foreground inline-flex items-center space-x-1.5 transition-colors"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Press</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-surface text-foreground">
              ⌘K
            </kbd>
            <span>for quick menu</span>
          </button>
        </div>
      </div>
    </section>
  );
}
