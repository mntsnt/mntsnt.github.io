'use client';

import React from 'react';
import { PortfolioData, SocialLinks } from '@/types/portfolio';
import { ArrowUpRight, ArrowUp } from 'lucide-react';

interface FooterProps {
  footer: PortfolioData['footer'];
  socials: SocialLinks;
}

export function Footer({ footer, socials }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-20 md:py-28 bg-background border-t border-hairline relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-hairline">
          {/* Identity block (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-accent text-xs font-bold">[ML]</span>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {footer.name}
              </p>
            </div>
            <p className="text-sm text-foreground-muted">
              {footer.description}
            </p>
            <p className="text-xs font-mono text-accent pt-1">
              {footer.signature}
            </p>
          </div>

          {/* Navigation Links & Socials (7 cols) */}
          <div className="md:col-span-7 flex flex-wrap gap-x-8 gap-y-4 items-center md:justify-end text-xs font-mono uppercase tracking-wider">
            <a href="#about" className="text-foreground-muted hover:text-foreground transition-colors">
              About
            </a>
            <a href="#work" className="text-foreground-muted hover:text-foreground transition-colors">
              Work
            </a>
            <a href="#certificates" className="text-foreground-muted hover:text-foreground transition-colors">
              Certificates
            </a>
            <a href="#contact" className="text-foreground-muted hover:text-foreground transition-colors">
              Contact
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-foreground-muted hover:text-foreground transition-colors"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-foreground-muted hover:text-foreground transition-colors"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-foreground-muted hover:text-foreground transition-colors"
            >
              <span>Bale Helm</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              title="Return to summit"
              className="p-2 border border-hairline bg-background-alt hover:bg-background text-foreground transition-colors ml-2"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Specimen Stamp & Copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-foreground-muted gap-4">
          <p>{footer.copyright}</p>
          <p className="text-[11px] text-foreground-muted">
            LAT 09°01&apos;N · LON 38°45&apos;E · ADDIS ABABA
          </p>
        </div>
      </div>
    </footer>
  );
}
