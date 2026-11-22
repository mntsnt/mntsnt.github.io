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
          <div className="space-y-1.5 max-w-sm">
            <p className="text-base font-semibold text-foreground tracking-tight">
              {footer.name || 'Mintesnot Leliso'}
            </p>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Medical student, graphic designer, and web developer based in Addis Ababa, Ethiopia.
            </p>
            <p className="text-[11px] font-mono text-foreground-muted pt-1">
              Medicine × Design × Technology
            </p>
          </div>

          {/* Navigation links & Socials */}
          <div className="flex flex-col sm:flex-row gap-8 text-xs text-foreground-muted">
            <nav aria-label="Footer Navigation" className="flex flex-col space-y-2">
              <span className="font-mono uppercase tracking-wider text-foreground text-[10px] font-semibold">
                Navigation
              </span>
              <a href="#work" className="hover:text-foreground transition-colors">
                Selected Work
              </a>
              <a href="#about" className="hover:text-foreground transition-colors">
                About & Story
              </a>
              <a href="#practice" className="hover:text-foreground transition-colors">
                Focus Matrix
              </a>
              <a href="#certificates" className="hover:text-foreground transition-colors">
                Certificates
              </a>
              <a href="#skills" className="hover:text-foreground transition-colors">
                Skills & Toolkit
              </a>
              <a href="#contact" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>

            <div className="flex flex-col space-y-2">
              <span className="font-mono uppercase tracking-wider text-foreground text-[10px] font-semibold">
                Connect
              </span>
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
                  Telegram (@bale_helm)
                </a>
              )}
              {socials.upwork && (
                <a
                  href={socials.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Upwork
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-muted">
          <div>
            <span>© {new Date().getFullYear()} Mintesnot Leliso. All rights reserved.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="min-h-[40px] px-3.5 inline-flex items-center space-x-1.5 rounded-md border border-border hover:border-foreground text-foreground transition-colors text-xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
