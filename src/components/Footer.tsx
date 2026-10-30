'use client';

import React from 'react';
import { PortfolioData, SocialLinks } from '@/types/portfolio';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  footer: PortfolioData['footer'];
  socials: SocialLinks;
}

export function Footer({ footer, socials }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 border-t border-border bg-background">
      <div className="max-w-site mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-12 border-b border-border">
          {/* Brand info */}
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              {footer.name}
            </p>
            <p className="text-sm text-foreground-muted">
              {footer.description}
            </p>
            <p className="text-xs text-foreground-muted pt-1">
              {footer.signature}
            </p>
          </div>

          {/* Navigation links & Socials */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground-muted">
            <a href="#about" className="hover:text-foreground transition-colors">
              About
            </a>
            <a href="#work" className="hover:text-foreground transition-colors">
              Work
            </a>
            <a href="#certificates" className="hover:text-foreground transition-colors">
              Certificates
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">
              Contact
            </a>
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            )}
            {socials.telegram && (
              <a
                href={socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Bale Helm
              </a>
            )}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-muted">
          <p>{footer.copyright}</p>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="min-h-[44px] px-3 inline-flex items-center space-x-1.5 rounded-md border border-border hover:border-foreground text-foreground transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
